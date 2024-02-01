import { Skeleton } from "@mui/material";
import { EventItemContentSkeleton } from "./ItemPage";

export {
    EditPageSkeleton as EventEditPageSkeleton
}

function EditPageSkeleton() {
    return (
        <>
            <h1>
                <span>Redigerer </span>
                <span style={{ whiteSpace: "nowrap"}}>
                    <em><q>
                        <Skeleton 
                            variant="text" 
                            style={{
                                display: "inline-block",
                                marginLeft: "6px",
                                width: "200px"
                            }} 
                            />
                    </q></em>
                </span>
            </h1>
            <EventItemContentSkeleton/>
        </>
    );
}