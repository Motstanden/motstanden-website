import { Stack } from "@mui/material";
import { useState } from "react";
import { EditOrDeleteMenu } from "src/components/menu/EditOrDeleteMenu";
import { useAuthenticatedUser } from "src/context/Authentication";
import { postJson } from "src/utils/postJson";

interface EditListProps<T> {
    items: T[],
    onItemChanged: VoidFunction,
    renderItem: (item: T) => React.ReactElement,
    renderEditForm: (props: RenderEditFormProps<T>) => React.ReactElement,
    deleteItemUrl: string,
    confirmDeleteItemText: string,
    itemComparer?: (a: T, b: T) => boolean,
    renderItemSkeleton?: React.ReactElement,
    itemSpacing?: string
}

type ItemBase = {
    id: number,
    createdBy: number
}

export type RenderEditFormProps<T> = {
    data: T,
    onEditSuccess: VoidFunction,
    onEditAbort: VoidFunction
}

export function EditList<T extends ItemBase>(props: EditListProps<T>) {
    return (
        <ul style={{
            paddingLeft: "5px",
            listStyleType: "none"
        }}
        >
            {props.items.map(item => (
                <li key={item.id}
                    style={{
                        maxWidth: "700px",
                        marginBottom: props.itemSpacing ?? "0px"
                    }}
                >
                    <RootItem<T>
                        data={item}
                        {...props}
                    />
                </li>
            )
            )}
        </ul>
    )
}

type RootItemProps<T> = Omit<EditListProps<T>, "items"> & {
    data: T
}

function RootItem<T extends ItemBase>(props: RootItemProps<T>) {
    const [isEditing, setIsEditing] = useState(false)
    const [prevData, setPrevData] = useState(props.data)
    const [isChanging, setIsChanging] = useState(false)

    const onEditClick = () => {
        setPrevData(props.data)
        setIsEditing(true)
    }

    const onEditAbort = () => {
        setIsEditing(false)
    }

    const onEditSuccess = () => {
        setIsEditing(false)
        setIsChanging(true)
        props.onItemChanged && props.onItemChanged()
    }

    if (isChanging) {
        if (props.itemComparer && props.itemComparer(prevData, props.data)) {
            return <>{props.renderItemSkeleton}</>
        }
        setPrevData(props.data)
        setIsChanging(false)
    }

    if (isEditing) {

        return props.renderEditForm({ data: props.data, onEditAbort: onEditAbort, onEditSuccess: onEditSuccess })
    }

    return <DefaultItem<T>
        data={props.data}
        renderItem={props.renderItem}
        onEditClick={onEditClick}
        onItemDeleted={props.onItemChanged}
        deleteItemUrl={props.deleteItemUrl}
        confirmDeleteItemText={props.confirmDeleteItemText}

    />
}

function DefaultItem<T extends ItemBase>({
    data,
    renderItem,
    onEditClick,
    onItemDeleted,
    deleteItemUrl,
    confirmDeleteItemText
}: {
    data: T,
    renderItem: (item: T) => React.ReactElement,
    onEditClick: VoidFunction,
    onItemDeleted: VoidFunction,
    deleteItemUrl: string,
    confirmDeleteItemText: string
}) {
    const [isHighlighted, setIsHighlighted] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const onMouseEnter = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsHighlighted(true)
    }

    const onMouseLeave = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsHighlighted(false)
    }

    const onMenuOpen = () => {
        setIsHighlighted(true)
    }

    const onMenuClose = () => {
        setIsHighlighted(false)
    }

    const onDeleteClick = async (_: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setIsDisabled(true)
        const response = await postJson(
            deleteItemUrl,
            { id: data.id },
            {
                alertOnFailure: true,
                confirmText: confirmDeleteItemText
            }
        )
        if (!response?.ok) {
            setIsDisabled(false)
        }
        if (response?.ok) {
            onItemDeleted()
        }
    }

    const { user, isAdmin } = useAuthenticatedUser()
    const canEdit = isAdmin || user.id === data.createdBy

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            bgcolor={isHighlighted || isDisabled ? "action.hover" : "transparent"}
            pl={1}
            ml={-1}
            style={{
                borderRadius: "5px",
                opacity: isDisabled ? 0.4 : 1
            }}
        >
            <div>
                {renderItem(data)}
            </div>
            {canEdit && (
                <div onMouseLeave={onMouseLeave}>
                    <EditOrDeleteMenu
                        disabled={isDisabled}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                        onMouseEnter={onMouseEnter}
                        onMenuOpen={onMenuOpen}
                        onMenuClose={onMenuClose}
                    />
                </div>
            )}
        </Stack>
    )
}
