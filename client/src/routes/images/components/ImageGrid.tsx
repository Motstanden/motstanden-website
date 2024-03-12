import { Theme, useMediaQuery } from "@mui/material";
import { EditOrDeleteMenu } from 'src/components/menu/EditOrDeleteMenu';

export type ComponentState = "read" | "edit" | "fetching"

export function ImageGrid({children}: {children?: React.ReactNode}) {
    const isSmallScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.between(400, 800))
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between(800, 1000))
    const isLargeScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.up(1000))

    let colCount = 1
    if(isSmallScreen)  colCount = 2;
    if(isMediumScreen) colCount = 3;
    if(isLargeScreen)  colCount = 4;

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            rowGap: "20px",
            columnGap: "30px"
        }}>
            {children}
        </div>
    )
}

export function ImageGridItem( {
    canEdit,
    readOnlyItem,
    editItem,
    placeholderItem,
    state,
}: {
    canEdit?: boolean,
    readOnlyItem: React.ReactNode,
    editItem: React.ReactNode,
    placeholderItem: React.ReactNode,
    state: ComponentState
}) {

    const onDeleteClick = () => {
        console.log("TODO")
    }

    const onEditClick = () => {
        console.log("TODO")
    }

    if(state === "read" && canEdit) {
        return (
           <div style={{
                position: "relative",
           }}>
                <EditOrDeleteMenu
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                    style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                    }}
                    // sx={iconButtonStaticStyle}
                    />
                {readOnlyItem}
           </div> 
        )
    }

    if(state === "read")
        return readOnlyItem

    if(state === "edit") {
        return editItem
    }
    
    if(state === "fetching")
        return placeholderItem

    return <></>
}