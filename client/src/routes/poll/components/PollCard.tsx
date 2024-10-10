import { Poll } from "common/interfaces"
import React from "react"
import { TitleCard } from "src/components/TitleCard"
import { PollCardSkeleton } from "../skeleton/PollCard"
import { PollContent } from './PollContent'
import { PollMenu } from './PollMenu'
import { useDeletePollFunction } from "./useDeletePollFunction"

export function PollCard({ 
    poll, style, elevation = 6, variant = "elevation" 
}: { 
    poll: Poll, 
    style?: React.CSSProperties, 
    elevation?: number,
    variant?: "outlined" | "elevation"
}) {

    const { isDeleting, deletePoll } = useDeletePollFunction(poll);


    if (isDeleting)
        return <PollCardSkeleton />;

    return (
        <TitleCard 
            title={poll.title}
            menu={<PollMenu onDeleteClick={deletePoll} poll={poll}/>}
            showMenu={true}
            paddingTop={0}
            elevation={elevation}
            variant={variant}
        >
            <PollContent poll={poll} />
        </TitleCard>
    );     
}

