import { Divider, Skeleton, Stack, TextField } from "@mui/material";
import { NewRumour, Rumour } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Form } from "src/components/form/Form";
import { useTitle } from "src/hooks/useTitle";
import { EditList, RenderEditFormProps } from "../quotes/components/EditList";
import { NewlineText } from "../quotes/components/NewlineText";
import { useContextInvalidator } from "./Context";

export function RumourPage() {
    useTitle("Ryktebørsen")

    const data = useOutletContext<Rumour[]>()
    const contextInvalidator = useContextInvalidator()
    const onItemChanged = () => contextInvalidator()
    return (
        <>
            <h1>Ryktebørsen</h1>
            <h3>Har du hørt at...</h3>
            <div style={{ marginLeft: "10px" }}>
                <RumourList rumours={data} onItemChanged={onItemChanged} />
            </div>
        </>
    )
}

export function PageSkeleton() {
    return (
        <>
            <h1>Ryktebørsen</h1>
            <h3>Har du hørt at...</h3>
            <div style={{ marginLeft: "10px" }}>
                <ListSkeleton length={20} />
            </div>
        </>
    )
}

export function ListSkeleton({ length }: { length: number }) {
    return (
        <ul style={{
            paddingLeft: "5px",
            listStyleType: "none",
        }}>
            {Array(length).fill(1).map((_, i) => <ItemSkeleton key={i} />)}
        </ul>
    )
}


function ItemSkeleton() {
    return (
        <li style={{ marginBottom: "30px" }}>
            <Skeleton style={{ maxWidth: "700px", height: "2.5em" }} />
            <Skeleton style={{ maxWidth: "95px", height: "1em", marginLeft: "25px" }} />
        </li>
    )
}

export function RumourList({ rumours, onItemChanged }: { rumours: Rumour[], onItemChanged: VoidFunction }) {
    const renderItem = (rumour: Rumour) => <ReadOnlyItem rumour={rumour} />
    const renderEditForm = (props: RenderEditFormProps<Rumour>) => <EditItem {...props} />
    const isEqual = (a: Rumour, b: Rumour) => a.rumour === b.rumour

    return (
        <EditList
            items={rumours}
            onItemChanged={() => onItemChanged && onItemChanged()}
            renderItem={renderItem}
            renderEditForm={renderEditForm}
            itemComparer={isEqual}
            renderItemSkeleton={<ItemSkeleton />}
            deleteItemUrl="/api/rumours/delete"
            confirmDeleteItemText="Vil du permanent slette dette ryktet?"
            itemSpacing="15px"
        />
    )
}

function ReadOnlyItem({ rumour }: { rumour: Rumour }) {
    return (
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <Stack direction="row" columnGap="5px">
                {"- "}
                <NewlineText text={rumour.rumour} />
            </Stack>
            <div style={{
                marginLeft: "30px",
                marginTop: "2px",
                opacity: 0.6,
                fontSize: "xx-small"
            }}>
                {`${dayjs(rumour.createdAt).utc(true).local().format("D MMMM YYYY")}`}
            </div>
        </div>
    )
}

function EditItem(props: RenderEditFormProps<Rumour>) {
    return (
        <div style={{ marginRight: "10px" }}>
            <Divider sx={{ mb: 4 }} />
            <UpsertRumourForm
                initialValue={props.data}
                onAbortClick={props.onEditAbort}
                onPostSuccess={props.onEditSuccess}
                postUrl="/api/rumours/update"
            />
        </div>
    )
}

export function NewRumourPage() {
    useTitle("Nytt rykte")
    const navigate = useNavigate()
    const contextInvalidator = useContextInvalidator()

    const onAbort = () => navigate("/rykter")

    const onSuccess = () => {
        contextInvalidator()
        navigate("/rykter")
    }

    return (
        <>
            <h1>Nytt rykte</h1>
            <UpsertRumourForm
                initialValue={{ rumour: "" }}
                postUrl="/api/rumours/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess}
            />
        </>
    )
}

function UpsertRumourForm({
    initialValue,
    postUrl,
    onAbortClick,
    onPostSuccess,
}: {
    initialValue: NewRumour | Rumour,
    postUrl: string,
    onAbortClick: VoidFunction
    onPostSuccess: VoidFunction
}) {
    const [newValue, setNewValue] = useState<NewRumour | Rumour>(initialValue)

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.rumour)
        const isEqual = newValue.rumour.trim() === initialValue.rumour.trim()
        return !isEmpty && !isEqual
    }

    const getSubmitData = () => {
        return { ...newValue, rumour: newValue.rumour.trim() }
    }

    const disabled = !validateData()

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={_ => onAbortClick()}
                onPostSuccess={_ => onPostSuccess()}
            >
                <div style={{ marginBottom: "-1em" }}>
                    <TextField
                        label="Har du hørt at...?"
                        name="rumour"
                        type="text"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.rumour}
                        onChange={(e) => setNewValue({ ...newValue, rumour: e.target.value })}
                        multiline
                        minRows={2}
                    />
                </div>
            </Form>
        </div>
    )
}