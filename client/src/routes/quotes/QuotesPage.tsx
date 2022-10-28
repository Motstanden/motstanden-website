import { Skeleton, TextField } from "@mui/material"
import Divider from "@mui/material/Divider"
import { NewQuote, Quote, Quote as QuoteData } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import dayjs from "dayjs"
import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Form } from "src/components/form/Form"
import { useTitle } from "../../hooks/useTitle"
import { EditList, RenderEditFormProps } from "./components/EditList"
import { NewlineText } from "./components/NewlineText"
import { useContextInvalidator } from "./Context"

export function QuotesPage() {
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

export function PageSkeleton() {
    return (
        <>
            <h1>Sitater</h1>
            <ListSkeleton length={20} />
        </>
    )
}

export function ListSkeleton({ length }: { length: number }) {
    return (
        <ul style={{
            paddingLeft: "5px",
            listStyleType: "none"
        }}>
            {Array(length).fill(1).map((_, i) => <ItemSkeleton key={i} />)}
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
                    }} />
            </div>
            <div style={{ marginBottom: "25px" }}>
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

export function NewQuotePage() {
    useTitle("Nytt sitat")
    const navigate = useNavigate()
    const contextInvalidator = useContextInvalidator()

    const onAbort = () => navigate("/sitater")

    const onSuccess = () => {
        contextInvalidator()
        navigate("/sitater")
    }

    return (
        <>
            <h1>Nytt sitat</h1>
            <UpsertQuoteForm
                initialValue={{ quote: "", utterer: "" }}
                postUrl="/api/quotes/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess}
            />
        </>
    )
}

function UpsertQuoteForm({
    initialValue,
    postUrl,
    onAbortClick,
    onPostSuccess,
}: {
    initialValue: NewQuote | QuoteData,
    postUrl: string,
    onAbortClick: VoidFunction
    onPostSuccess: VoidFunction
}) {
    const [newValue, setNewValue] = useState<NewQuote | Quote>(initialValue)

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.quote) || isNullOrWhitespace(newValue.utterer)
        const isEqual = newValue.quote.trim() === initialValue.quote.trim() && newValue.utterer.trim() === initialValue.utterer.trim()
        return !isEmpty && !isEqual
    }

    const getSubmitData = () => {
        return { ...newValue, quote: newValue.quote.trim(), utterer: newValue.utterer.trim() }
    }

    const disabled = !validateData()

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={(e) => onAbortClick()}
                onPostSuccess={(e) => onPostSuccess()}

            >
                <div style={{ marginBottom: "-1em" }}>
                    <div>
                        <TextField
                            label="Sitat"
                            name="quote"
                            type="text"
                            required
                            fullWidth
                            autoComplete="off"
                            value={newValue.quote}
                            onChange={(e) => setNewValue({ ...newValue, quote: e.target.value })}
                            multiline
                            minRows={4}
                            sx={{ mb: 4 }}
                        />
                    </div>
                    <div>
                        <TextField
                            label="Sitatytrer"
                            name="utterer"
                            type="text"
                            required
                            fullWidth
                            autoComplete="off"
                            value={newValue.utterer}
                            onChange={(e) => setNewValue({ ...newValue, utterer: e.target.value })}
                            sx={{ maxWidth: "450px" }} />
                    </div>
                </div>
            </Form>
        </div>
    )
}