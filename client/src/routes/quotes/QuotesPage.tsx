import React, { useState } from "react"
import { useTitle } from "../../hooks/useTitle"
import { Quote as QuoteData } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"
import Stack from "@mui/material/Stack"
import { EditOrDeleteMenu } from "src/components/menu/EditOrDeleteMenu"

export default function QuotesPage(){
    useTitle("Sitater")
    const data = useOutletContext<QuoteData[]>()
    return (
        <>
            <h1>Sitater</h1>
            <QuoteList quotes={data}/>
        </>
    )
}

export function QuoteList( {quotes}: {quotes: QuoteData[] } ){
    return (
        <ul style={{ 
                paddingLeft: "5px", 
                listStyleType: "none" 
        }}>
            { quotes.map( item => <QuoteItem key={item.id} quoteData={item}/>)}
        </ul>
    )
}

function QuoteItem( {quoteData}: {quoteData: QuoteData}){

    const [isHighlighted, setIsHighlighted] = useState(false)

    const onMouseEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsHighlighted(true)
    }

    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsHighlighted(false)
    }

    const onMenuOpen = () => {
        setIsHighlighted(true)
    }

    const onMenuClose = () => {
        setIsHighlighted(false)
    }

    return ( 
        <li style={{ marginBottom: "25px", maxWidth: "700px"}}>
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                bgcolor={isHighlighted ? "action.hover" : "transparent"}
                pl={1}
                ml={-1}
                style={{borderRadius: "5px"}}
                >
                <div style={{marginBlock: "10px"}}>
                    <NewlineText text={quoteData.quote}/>
                    <span style={{
                        marginLeft: "20px", 
                        marginTop: 0, 
                        opacity: 0.6, 
                        fontSize: "small", 
                        fontWeight: "bold"
                    }}>
                    – {`${quoteData.utterer}, ${dayjs(quoteData.createdAt).utc(true).local().format("D MMMM YYYY")}`}
                    </span>
                </div>
                <div>
                    <ItemMenu 
                        quoteData={quoteData} 
                        onMouseEnter={onMouseEnter} 
                        onMouseLeave={onMouseLeave} 
                        onMenuOpen={onMenuOpen} 
                        onMenuClose={onMenuClose}/>
                </div>
            </Stack>
        </li>
    )
}   

function ItemMenu( {
    quoteData,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose
}: {
    quoteData: QuoteData,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction
}){

    const onEditClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        // #TODO
    }

    const onDeleteClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        // #TODO
    }

    return (
        <div onMouseLeave={onMouseLeave}>
            <EditOrDeleteMenu 
                onEditClick={onEditClick} 
                onDeleteClick={onDeleteClick} 
                onMouseEnter={onMouseEnter} 
                onMenuOpen={onMenuOpen}
                onMenuClose={onMenuClose}
            />
        </div>
    )
}

function NewlineText({ text }: {text: string}) {
    const newText = text.split('\n').map( (str, i) => <p key={i} style={{margin: 0}}>{str}</p>);
    return <span>{newText}</span>
}
