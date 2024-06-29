import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Stack } from '@mui/material'
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { UserGroup } from 'common/enums'
import { SimpleText, UpdateSimpleText } from "common/interfaces"
import { hasGroupAccess, isNullOrWhitespace } from 'common/utils'
import { useState } from "react"
import { usePotentialUser } from 'src/context/Authentication'
import { StorageKeyArray, useSessionStorage } from 'src/hooks/useStorage'
import { fetchFn } from "src/utils/fetchAsync"
import { AuthorItem, authorInfoTextStyle } from './AuthorInfo'
import { MarkDownEditor, MarkDownRenderer } from "./MarkDownEditor"
import { Form } from "./form/Form"
import { EditMenuItem } from './menu/EditMenuItem'
import { IconPopupMenu } from "./menu/IconPopupMenu"

export function SimpleTextFetcher({
    queryKeyModifier,
    textKey,
    skeleton,
}: {
    textKey: string,
    queryKeyModifier?: (string | number)[]
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

function buildQueryKey(textKey: string, otherKeys?: (string | number)[]): (string | number)[] {
    const queryKey: (string | number)[] = ["get", "/api/simple-text/:key", textKey ]
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
    contextQueryKey: (string | number)[]
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
                storageKey={contextQueryKey}
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
    return (
        <>
            <Header canEdit={canEdit} onEditClick={onEditClick} simpleText={value} />
            <MarkDownRenderer value={value.text} />
        </>
    )
}

function Header( {
    canEdit,
    onEditClick,
    simpleText,
}: {
    canEdit?: boolean,
    onEditClick?: VoidFunction,
    simpleText: SimpleText   
}) {
    const { isLoggedIn } = usePotentialUser()

    if(!isLoggedIn)
        return <></>

    const isEmpty = isNullOrWhitespace(simpleText.text)

    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{
                mt: canEdit ? "-28px" : "-15px",
                mb: canEdit ? "-23px" : "-10px"
            }}
            >
            <LastEditInfo simpleText={simpleText} />
            {canEdit && (
                <IconPopupMenu 
                    icon={<MoreHorizIcon/>}
                    ariaLabel='Tekstmeny'
                > 
                    <EditMenuItem 
                        onClick={onEditClick} 
                        text={isEmpty ? "Skriv Tekst" : undefined}
                    />
                </IconPopupMenu>
            )}
        </Stack>
    )
}


function LastEditInfo( {simpleText}: {simpleText: SimpleText} ) {
    return (
        <div style={{
            ...authorInfoTextStyle,
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
    storageKey: StorageKeyArray,
    onAbortClick?: VoidFunction,
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
}){
    const [newValue, setNewValue, clearNewValue] = useSessionStorage<UpdateSimpleText>({
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
        clearNewValue()
        onPostSuccess && await onPostSuccess(res)
    }

    const handleAbortClick = () => {
        clearNewValue()
        onAbortClick && onAbortClick()
    }

    const disabled = !validateData() || hasPosted

    return (
        <Form 
            value={newValue}
            url={postUrl}
            disabled={disabled}
            onAbortClick={handleAbortClick}
            onSuccess={handlePostSuccess}
        >
            <MarkDownEditor
                value={newValue.text}
                onChange={val => setNewValue({ text: val })} 
                placeholder="Skriv inn tekst her..."
            />
        </Form>
    )
}