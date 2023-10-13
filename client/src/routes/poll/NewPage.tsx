import { NewPollWithOption } from "common/interfaces";
import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { UpsertPollForm } from "./components/UpsertPollForm";
import { useQueryClient } from "@tanstack/react-query";
import { pollListQueryKey } from "./Context";

const emptyPoll: NewPollWithOption = {
    title: "",
    type: "single",
    options: [
        { text: "" },
        { text: "" },
        { text: "" },
    ],
}

export default function NewPollPage() {
    useTitle("Ny avstemning");
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const onAbort = () => navigate("/avstemninger");

    const onSuccess = () => {
        queryClient.invalidateQueries(pollListQueryKey)
        navigate("/avstemninger");
    };

    return (
        <>
            <h1>Ny avstemning</h1>
            <UpsertPollForm
                initialValue={emptyPoll}
                postUrl="/api/polls/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess} />
        </>
    );
}
