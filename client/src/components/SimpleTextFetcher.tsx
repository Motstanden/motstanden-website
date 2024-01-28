import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { UserGroup } from 'common/enums'
import { SimpleText, UpdateSimpleText } from "common/interfaces"
import { hasGroupAccess, isNullOrWhitespace } from 'common/utils'
import { useState } from "react"
import { useAuth } from 'src/context/Authentication'
import { fetchAsync, fetchFn } from "src/utils/fetchAsync"
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
    const user = useAuth().user
    const isEditor = !!user && hasGroupAccess(user, UserGroup.Editor)

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
    const isLoggedIn = !!useAuth().user

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
    onAbortClick,
    onPosted,
}: {
    initialValue: UpdateSimpleText | SimpleText,
    postUrl: string
    onAbortClick?: VoidFunction,
    onPosted?: ((res: Response) => Promise<void>) | ((res: Response) => void)
}){
    const [newValue, setNewValue] = useState<UpdateSimpleText>({text: initialValue.text})
    const [hasPosted, setHasPosted] = useState(false)

    const validateData = () => {
        return newValue.text !== initialValue.text 
    }

    const onPostSuccess = async (res: Response) => { 
        setHasPosted(true)
        if(onPosted){
            await onPosted(res)
        }
    }

    const disabled = !validateData() || hasPosted

    return (
        <Form 
            value={newValue}
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