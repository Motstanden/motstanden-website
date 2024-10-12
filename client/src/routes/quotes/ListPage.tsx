import { Divider } from "@mui/material"
import { Quote as QuoteData } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"
import { useTitle } from "src/hooks/useTitle"
import { useContextInvalidator } from "./Context"
import { EditList, RenderEditFormProps } from "./components/EditList"
import { NewlineText } from "./components/NewlineText"
import { UpsertQuoteForm } from "./components/UpsertQuoteForm"
import { QuotesItemSkeleton } from "./skeleton/ListPage"

export default function ListPage() {
    useTitle("Sitater")

    const data = useOutletContext<QuoteData[]>()
    const contextInvalidator = useContextInvalidator()
    const onItemChanged = () => contextInvalidator()

    return (
        <>
            <QuoteList quotes={data} onItemChanged={onItemChanged} />
        </>
    )
}

export function QuoteList({ 
    quotes, 
    onItemChanged,
    itemSpacing = "25px"
}: { 
    quotes: QuoteData[], 
    onItemChanged?: VoidFunction,
    itemSpacing?: string
}) {

    const renderItem = (quote: QuoteData) => <ReadOnlyItem quote={quote} />
    const renderEditForm = (props: RenderEditFormProps<QuoteData>) => <EditItem {...props} />
    const isEqual = (a: QuoteData, b: QuoteData) => a.utterer === b.utterer && a.quote === b.quote

    return (
        <EditList
            items={quotes}
            onItemChanged={() => onItemChanged && onItemChanged()}
            renderItem={renderItem}
            renderEditForm={renderEditForm}
            itemComparer={isEqual}
            renderItemSkeleton={<QuotesItemSkeleton />}
            deleteItemUrl={(quote) => `/api/quotes/${quote.id}`}
            confirmDeleteItemText="Vil du permanent slette dette sitatet?"
            itemSpacing={itemSpacing}
        />
    )
}

function ReadOnlyItem({ quote }: { quote: QuoteData }) {
    return (
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <NewlineText text={quote.quote} />
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
                    {`${quote.utterer}, ${dayjs.utc(quote.createdAt).tz().format("D MMMM YYYY")}`}
                </div>
            </div>
        </div>
    )
}

function EditItem(props: RenderEditFormProps<QuoteData>) {
    return (
        <div style={{
            marginBlock: "40px",
            marginRight: "10px"
        }}>
            <UpsertQuoteForm
                storageKey={["Quotes", "Edit", props.data.id]}
                initialValue={props.data}
                url={`/api/quotes/${props.data.id}`}
                httpMethod="PATCH"
                onAbortClick={props.onEditAbort}
                onPostSuccess={props.onEditSuccess} />
        </div>
    )
}

