import Divider from "@mui/material/Divider"
import { Quote as QuoteData } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"
import { useTitle } from "src/hooks/useTitle"
import { EditList, RenderEditFormProps } from "./components/EditList"
import { NewlineText } from "./components/NewlineText"
import { UpsertQuoteForm } from "./components/UpsertQuoteForm"
import { useContextInvalidator } from "./Context"
import { ItemSkeleton } from "./ListPageSkeleton"

export default function ListPage() {
    useTitle("Sitater")

    const data = useOutletContext<QuoteData[]>()
    const contextInvalidator = useContextInvalidator()
    const onItemChanged = () => contextInvalidator()

    return (
        <>
            <h1>Sitater</h1>
            <QuoteList quotes={data} onItemChanged={onItemChanged} />
        </>
    )
}

export function QuoteList({ quotes, onItemChanged }: { quotes: QuoteData[], onItemChanged?: VoidFunction }) {

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
            renderItemSkeleton={<ItemSkeleton />}
            deleteItemUrl="/api/quotes/delete"
            confirmDeleteItemText="Vil du permanent slette dette sitatet?"
            itemSpacing="25px"
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
                    {`${quote.utterer}, ${dayjs(quote.createdAt).utc(true).local().format("D MMMM YYYY")}`}
                </div>
            </div>
        </div>
    )
}

function EditItem(props: RenderEditFormProps<QuoteData>) {
    return (
        <div>
            <Divider sx={{ mb: 4 }} />
            <UpsertQuoteForm
                initialValue={props.data}
                postUrl="/api/quotes/update"
                onAbortClick={props.onEditAbort}
                onPostSuccess={props.onEditSuccess} />
        </div>
    )
}

