import { Divider, Skeleton } from "@mui/material";
import { CommentSectionSkeleton } from "src/components/CommentSection";
import { TitleCardSkeleton } from "src/components/TitleCard";
import { UserListSkeleton } from "src/components/UserList";

export {
    ItemContent as EventItemContentSkeleton,
    ItemPageSkeleton as EventItemPageSkeleton,
    ParticipationContent as EventParticipationSkeleton
};

function ItemPageSkeleton() {
    return (
        <div style={{maxWidth: "1000px"}}>
            <ItemContent/>
            <Divider sx={{my: 4}}/>
            <ParticipationContent/>
            <Divider sx={{my: 4}} />
            <CommentSectionSkeleton variant="normal"/>
        </div>
    );
}

function ItemContent() {
    return (
        <Skeleton
            variant="rounded"
            sx={{mt: 4}}
            height="800px"
        />
    )
}

function ParticipationContent() {
    return (
        <>
            <Skeleton
                variant="rounded"
                height="143px"
                sx={{
                    maxWidth: "450px"
                }}
            />
            <TitleCardSkeleton sx={{p: 2, my: 6}}>
                <UserListSkeleton/>
            </TitleCardSkeleton>
        </>
    )
}