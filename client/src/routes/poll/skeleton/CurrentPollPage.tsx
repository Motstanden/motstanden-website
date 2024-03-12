import { Divider } from "@mui/material";
import { PollCardSkeleton } from "./PollCard";
import { CommentSectionSkeleton } from "src/components/CommentSection";

export { 
    CurrentPollPage as CurrentPollPageSkeleton,
    CommentsSkeleton as PollCommentSectionSkeleton
};

function CurrentPollPage() {
    return (
        <div>
            <h1>Avstemning</h1>
            <div style={{
                minWidth: "MIN(100%, 500px)",
                maxWidth: "800px"
            }}>
                <PollCardSkeleton />
                <CommentsSkeleton/>
            </div>
        </div>
    );
}

function CommentsSkeleton(){
    return (
        <div style={{maxWidth: "700px"}}>
            <Divider sx={{ my: 6 }} />
            <CommentSectionSkeleton variant="normal" />
        </div>
    )
}