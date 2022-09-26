import Skeleton from "@mui/material/Skeleton"
import { Rumour } from "common/interfaces"
import { useOutletContext } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"

export function RumourPage() {
    const rumours = useOutletContext<Rumour[]>()
    return (
        <>
            <h1>Ryktebørsen</h1>
            <h3>Har du hørt at...</h3>
            <ul>
                <li>
                    {rumours.map( item => <li>{item.rumour}</li>)}
                </li>
            </ul>
        </>
    )
}

export function PageSkeleton() {
    return (
        <>
            <h1>Ryktebørsen</h1>
            <ListSkeleton length={20}/>
        </>
    )
}

export function ListSkeleton( {length}: {length: number}) {
    return (
        <ul>
            { Array(length).fill(1).map( (_, i) => <ItemSkeleton key={i}/>) }
        </ul>
    ) 
} 


function ItemSkeleton() {
    return (
        <li>
            <Skeleton style={{maxWidth: "700px", height: "2em"}}/>
        </li>
    )
}