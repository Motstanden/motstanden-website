import { useQuery, useQueryClient } from "@tanstack/react-query"
import { SimpleText, UpdateSimpleText } from "common/interfaces"
import { fetchAsync } from "src/utils/fetchAsync"
import { MarkDownEditor, MarkDownRenderer } from "./MarkDownEditor"
import { useState } from "react"
import { IconPopupMenu } from "./menu/IconPopupMenu"
import { EditMenuItem } from "./menu/EditOrDeleteMenu"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Form } from "./form/Form"
import { isNullOrWhitespace } from "common/utils"

export function SimpleTextFetcher({
    queryKeyModifier,
    canEdit,
    textKey,
    skeleton,
}: {
    textKey: string,
    canEdit?: boolean
    queryKeyModifier?: any[]
    skeleton?: React.ReactNode
}) {
    const queryKey = buildQueryKey(textKey, queryKeyModifier)

    const { isLoading, isError, data, error } = useQuery<SimpleText>(queryKey, () => fetchAsync<SimpleText>(`/api/simple-text/${textKey}`))

    if(isLoading)
        return skeleton ? <>{skeleton}</> : <></>

    if(isError)
        return <span>{`${error}`}</span>

    return (
        <SimpleTextEditor 
            value={data} 
            canEdit={canEdit}
            contextQueryKey={queryKey}
        />
    )
}

function buildQueryKey(textKey: string, otherKeys?: any[]): any[] {
    const queryKey = ["get", "/api/simple-text/:key", textKey ]
    if(otherKeys)
        queryKey.push(...otherKeys)
    return queryKey
}

function SimpleTextEditor( {
    value,
    contextQueryKey,
    canEdit,
}: {
    value: SimpleText,
    contextQueryKey?: any[]
    canEdit?: boolean 
}) {
    const [isEditing, setIsEditing] = useState(false)
    const queryClient = useQueryClient()

    const onEditClick = () => {
        if(canEdit){
            setIsEditing(true)
        }
    }

    const onAbortClick = () => setIsEditing(false)

    const onPosted = async () => {
        await queryClient.invalidateQueries(contextQueryKey)
        setIsEditing(false)
    }

    if(canEdit && isEditing) {
        return (
            <SimpleTextForm
                postUrl={`/api/simple-text/${value.id}/update`}
                initialValue={{
                    text: value.text
                }}
                onAbortClick={onAbortClick}
                onPosted={onPosted}
            />   
        )
    }

    return (
        <SimpleTextReader
            value={value}
            canEdit={canEdit}
            onEditClick={onEditClick}
        />
    )
}

function SimpleTextReader( {
    value, 
    canEdit,
    onEditClick
}: {
    value: SimpleText, 
    canEdit?: boolean,
    onEditClick?: VoidFunction
}) {
    return (
        <div 
            style={{
                position: "relative"
            }}
        >
            <MarkDownRenderer value={value.text} />
            {canEdit && (
                <IconPopupMenu 
                    icon={<MoreHorizIcon/>} 
                    style={{
                        position: 'absolute',
                        top: 13,
                        right: 10,
                    }}
                > 
                    <EditMenuItem onClick={onEditClick} />
                </IconPopupMenu>
            )}
        </div>
    )
}

function SimpleTextForm( {
    initialValue,
    postUrl,
    onAbortClick,
    onPosted,
}: {
    initialValue: UpdateSimpleText,
    postUrl: string
    onAbortClick?: VoidFunction,
    onPosted?: ((res: Response) => Promise<void>) | ((res: Response) => void)
}){
    const [newValue, setNewValue] = useState(initialValue)
    const [hasPosted, setHasPosted] = useState(false)

    const validateData = () => {
        return !isNullOrWhitespace(newValue.text) && newValue.text !== initialValue.text 
    }

    const getSubmitData = (): UpdateSimpleText => ({ 
        text: newValue.text.trim()
    })

    const onPostSuccess = async (res: Response) => { 
        setHasPosted(true)
        if(onPosted){
            await onPosted(res)
        }
    }

    const disabled = !validateData() || hasPosted

    return (
        <Form 
            value={getSubmitData}
            postUrl={postUrl}
            disabled={disabled}
            onAbortClick={onAbortClick}
            onPostSuccess={onPostSuccess}
        >
            <MarkDownEditor
                value={newValue.text}
                onChange={val => setNewValue({ text: val })} 
                placeholder="Skriv inn tekst her..."
            />
        </Form>
    )
}