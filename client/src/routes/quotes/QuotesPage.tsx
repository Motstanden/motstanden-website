import React, { useState } from "react"
import { useTitle } from "../../hooks/useTitle"
import { NewQuote, Quote, Quote as QuoteData } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"
import Divider from "@mui/material/Divider"
import { Form } from "src/components/form/Form"
import { UpsertQuoteInputs } from "./NewPage"
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace"
import { useContextInvalidator } from "./Context"
import { Skeleton } from "@mui/material"
import { EditList, RenderEditFormProps } from "./components/EditList"
import { NewlineText } from "./components/NewlineText"

export default function QuotesPage(){
    useTitle("Sitater")

    const data = useOutletContext<QuoteData[]>()
    const contextInvalidator = useContextInvalidator()
    const onItemChanged = () => contextInvalidator()

    return (
        <>
            <h1>Sitater</h1>
            <QuoteList quotes={data} onItemChanged={onItemChanged}/>
        </>
    )
}

export function PageSkeleton() {
    return (
        <>
            <h1>Sitater</h1>
            <ListSkeleton length={20} />
        </>
    )
}

export function ListSkeleton( {length}: {length: number}) {
    return (
        <ul style={{ 
                paddingLeft: "5px", 
                listStyleType: "none" 
            }}>
            { Array(length).fill(1).map( (_, i) => <ItemSkeleton key={i}/>) }
        </ul>
    ) 
} 

function ItemSkeleton() {
    return (
        <li>
            <div>
                <Skeleton 
                    style={{
                        maxWidth: "700px", 
                        marginBottom: "-10px",
                        height: "5em"
                    }}/>
            </div>
            <div style={{marginBottom: "25px"}}>
                <Skeleton 
                    style={{
                        maxWidth: "650px", 
                        marginLeft: "50px", 
                        height: "2em"
                    }}
                />
            </div>
        </li>
    )
}

export function QuoteList( {quotes, onItemChanged}: {quotes: QuoteData[], onItemChanged?: VoidFunction } ){

    const renderItem = (quote: QuoteData) => <ReadOnlyItem quote={quote}/>
    const renderEditForm = (props: RenderEditFormProps<QuoteData>) => <EditItem {...props}/>
    const isEqual = (a: QuoteData, b: QuoteData) => a.utterer === b.utterer && a.quote === b.quote

    return (
        <EditList 
            items={quotes} 
            onItemChanged={() => onItemChanged && onItemChanged()} 
            renderItem={renderItem}
            renderEditForm={renderEditForm} 
            itemComparer={isEqual}
            renderItemSkeleton={<ItemSkeleton/>}
            deleteItemUrl="/api/quotes/delete"
            confirmDeleteItemText="Vil du permanent slette dette sitatet?"
            itemSpacing="25px"
        />
    )
}

function ReadOnlyItem({quote}: {quote: QuoteData}) {
    return (
        <div style={{marginTop: "10px", marginBottom: "10px"}}>
            <NewlineText text={quote.quote}/>
            <div style={{
                marginLeft: "20px", 
                marginTop: "2px", 
                opacity: 0.6, 
                fontSize: "small", 
                fontWeight: "bold",
                display: "flex",
                gap: "1ch"
            }}>
                <div>
                    –
                </div>
                <div>
                    {`${quote.utterer}, ${dayjs(quote.createdAt).utc(true).local().format("D MMMM YYYY")}`}
                </div>
            </div>
        </div>
    )
}

function EditItem(props: RenderEditFormProps<QuoteData>) {
    const quoteData = props.data
    const [newData, setNewData] = useState(quoteData)

    const onChange = (newVal: NewQuote) => setNewData({...quoteData, ...newVal})

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newData.quote) || isNullOrWhitespace(newData.utterer)
        const isEqual = newData.quote.trim() === quoteData.quote.trim() && newData.utterer.trim() === quoteData.utterer.trim()
        return !isEmpty && !isEqual 
    }

    const disabled = !validateData()
    return ( 
        <>
            <Divider sx={{mb: 4}}/>
            <Form 
                value={newData}  
                postUrl={"/api/quotes/update"}
                disabled={disabled}
                onAbortClick={() => props.onEditAbort()}
                onPostSuccess={() => props.onEditSuccess()}
                >
                <div style={{marginBottom: "-2em"}}>
                    <UpsertQuoteInputs 
                        quoteData={newData} 
                        onChange={onChange}
                        size="small"/>
                </div>
            </Form>
        </>
    )
}