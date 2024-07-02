import { Divider, Stack } from "@mui/material"
import { Rumour } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"
import { useTitle } from "src/hooks/useTitle"
import { EditList, RenderEditFormProps } from "../quotes/components/EditList"
import { NewlineText } from "../quotes/components/NewlineText"
import { useContextInvalidator } from "./Context"
import { UpsertRumourForm } from "./components/UpsertRumourForm"
import { RumourItemSkeleton } from "./skeleton/RumourPage"

export function RumourPage() {
    useTitle("Ryktebørsen")

    const data = useOutletContext<Rumour[]>()
    const contextInvalidator = useContextInvalidator()
    const onItemChanged = () => contextInvalidator()
    return (
        <>
            <h3>Har du hørt at...</h3>
            <div style={{ marginLeft: "10px" }}>
                <RumourList rumours={data} onItemChanged={onItemChanged} />
            </div>
        </>
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
            renderItemSkeleton={<RumourItemSkeleton />}
            deleteItemUrl={(rumour) => `/api/rumours/${rumour.id}`}
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
                {`${dayjs.utc(rumour.createdAt).tz().format("D MMMM YYYY")}`}
            </div>
        </div>
    )
}

function EditItem(props: RenderEditFormProps<Rumour>) {
    return (
        <div style={{ marginRight: "10px" }}>
            <Divider sx={{ mb: 4 }} />
            <UpsertRumourForm
                storageKey={["Rumours", "Edit", props.data.id]}
                initialValue={props.data}
                onAbortClick={props.onEditAbort}
                onPostSuccess={props.onEditSuccess}
                postUrl={`/api/rumours/${props.data.id}/update`}
            />
        </div>
    )
}
