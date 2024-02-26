import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { UserGroup } from 'common/enums'
import { SimpleText, UpdateSimpleText } from "common/interfaces"
import { hasGroupAccess, isNullOrWhitespace } from 'common/utils'
import { useState } from "react"
import { usePotentialUser } from 'src/context/Authentication'
import { useSessionStorage } from 'src/hooks/useStorage'
import { fetchFn } from "src/utils/fetchAsync"
import { AuthorItem, authorInfoTextStyle } from './AuthorInfo'
import { MarkDownEditor, MarkDownRenderer } from "./MarkDownEditor"
import { Form } from "./form/Form"
import { EditMenuItem } from "./menu/EditOrDeleteMenu"
import { IconPopupMenu } from "./menu/IconPopupMenu"

export function SimpleTextFetcher({
    queryKeyModifier,
    textKey,
    skeleton,
}: {
    textKey: string,
    queryKeyModifier?: any[]
    skeleton?: React.ReactNode
}) {
    const { user, isLoggedIn } = usePotentialUser()
    const isEditor = isLoggedIn && hasGroupAccess(user, UserGroup.Editor)

    const queryKey = buildQueryKey(textKey, queryKeyModifier)
    const { isPending, isError, data, error } = useQuery<SimpleText>({
        queryKey: queryKey,
        queryFn: fetchFn<SimpleText>(`/api/simple-text/${textKey}`),
    })

    if(isPending)
        return skeleton ? <>{skeleton}</> : <></>

    if(isError)
        return <span>{`${error}`}</span>

    return (
        <SimpleTextEditor 
            value={data} 
            canEdit={isEditor}
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
        await queryClient.invalidateQueries({ queryKey: contextQueryKey })
        setIsEditing(false)
    }

    if(canEdit && isEditing) {
        return (
            <SimpleTextForm
                postUrl={`/api/simple-text/${value.id}/update`}
                initialValue={{
                    text: value.text
                }}
                storageKey={JSON.stringify(contextQueryKey)}
                onAbortClick={onAbortClick}
                onPostSuccess={onPosted}
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
    const isEmpty = isNullOrWhitespace(value.text)
    return (
        <div 
            style={{
                position: "relative"
            }}
        >
            <LastEditInfo simpleText={value} />
            <MarkDownRenderer value={value.text} />
            {canEdit && (
                <IconPopupMenu 
                    icon={<MoreHorizIcon/>} 
                    style={
                        isEmpty ? {

                        } :{
                        position: 'absolute',
                        top: -14,
                        right: 10,
                    }}
                > 
                    <EditMenuItem 
                        onClick={onEditClick} 
                        text={isEmpty ? "Skriv Tekst" : undefined}
                    />
                </IconPopupMenu>
            )}
        </div>
    )
}

function LastEditInfo( {simpleText}: {simpleText: SimpleText} ) {
    const { isLoggedIn } = usePotentialUser()

    if(!isLoggedIn)
        return <></>

    return (
        <div style={{
            ...authorInfoTextStyle,
            marginTop: "-15px",
            marginBottom: "-10px"
        }}>
            <span style={{paddingRight: "4px"}}>
                Redigert:
            </span>
            <AuthorItem 
                userId={simpleText.updatedBy} 
                dateTime={simpleText.updatedAt} 
            />
        </div>
    )
}

function SimpleTextForm( {
    initialValue,
    postUrl,
    storageKey,
    onAbortClick,
    onPostSuccess,
}: {
    initialValue: UpdateSimpleText | SimpleText,
    postUrl: string
    storageKey: string
    onAbortClick?: VoidFunction,
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
}){
    const [newValue, setNewValue, clearSessionValue] = useSessionStorage<UpdateSimpleText>({
        key: storageKey,
        initialValue: {text: initialValue.text},
        delay: 1000
    })
    const [hasPosted, setHasPosted] = useState(false)

    const validateData = () => {
        return newValue.text !== initialValue.text 
    }

    const handlePostSuccess = async (res: Response) => { 
        setHasPosted(true)
        clearSessionValue()
        onPostSuccess && await onPostSuccess(res)
    }

    const handleAbortClick = () => {
        clearSessionValue()
        onAbortClick && onAbortClick()
    }

    const disabled = !validateData() || hasPosted

    return (
        <Form 
            value={newValue}
            postUrl={postUrl}
            disabled={disabled}
            onAbortClick={handleAbortClick}
            onPostSuccess={handlePostSuccess}
        >
            <MarkDownEditor
                value={newValue.text}
                onChange={val => setNewValue({ text: val })} 
                placeholder="Skriv inn tekst her..."
            />
        </Form>
    )
}