import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Poll, PollOption, PollWithOption } from "common/interfaces"
import { useState } from "react"
import { AuthorInfo } from 'src/components/AuthorInfo'
import { fetchFn } from "src/utils/fetchAsync"
import { putJson } from 'src/utils/postJson'
import { pollBaseQueryKey } from "../Context"
import { PollOptionsSkeleton } from '../skeleton/PollOptions'
import { PollResult } from './PollResult'
import { VoteForm } from './VoteForm'
import { VoterListModal } from './VoterListModal'

export function PollContent({ poll }: { poll: Poll; }) {
    return (
        <div>
            <div style={{
                marginBottom: "15px",
            }}>
                <AuthorInfo
                    createdAt={poll.createdAt}
                    createdByUserId={poll.createdBy}
                    updatedAt={poll.updatedAt}
                    updatedByUserId={poll.updatedBy} />
            </div>
            <PollOptionsLoader poll={poll} />
        </div>
    );
}

function PollOptionsLoader({ poll }: { poll: Poll; }) {
    const queryKey = [...pollBaseQueryKey, poll.id, "options"];

    const { isPending, isError, data, error } = useQuery<PollOption[]>({
        queryKey: queryKey,
        queryFn: fetchFn<PollOption[]>(`/api/polls/${poll.id}/options`),
    });

    const queryClient = useQueryClient();
    const onSubmitSuccess = async () => await queryClient.invalidateQueries({ queryKey: queryKey });

    if (isPending)
        return <PollOptionsSkeleton />;

    if (isError)
        return <div style={{ minHeight: "300px" }}>{`${error}`}</div>;

    const pollData: PollWithOption = {
        ...poll,
        options: data
    };

    return (
        <>
            <PollOptionsRenderer poll={pollData} onSubmitSuccess={onSubmitSuccess} />
            <VoterListModal poll={pollData} />
        </>

    );
}

function PollOptionsRenderer({
    poll, 
    onSubmitSuccess,
}: {
    poll: PollWithOption;
    onSubmitSuccess: () => Promise<void>;
}) {
    const [showResult, setShowResult] = useState(poll.options.find(option => option.isVotedOnByUser) !== undefined);

    const onShowResultClick = () => setShowResult(true);
    const onExitResultClick = () => setShowResult(false);

    const onSubmit = async (selectedItems: PollOption[]) => {

        const url = `/api/polls/${poll.id}/votes/me`;
        const optionIds: number[] = selectedItems.map(item => item.id);

        const response = await putJson(url, optionIds, { alertOnFailure: true });

        if (response && response.ok) {
            await onSubmitSuccess();
            setShowResult(true);
        }
    };

    if (showResult)
        return <PollResult poll={poll} onChangeVoteClick={onExitResultClick} />;

    return <VoteForm
        poll={poll}
        onShowResultClick={onShowResultClick}
        onSubmit={onSubmit} />;
}
