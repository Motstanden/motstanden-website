import { NewPollWithOption } from "common/interfaces";
import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { useContextInvalidator } from "src/routes/poll/Context";
import { UpsertPollForm } from "./components/UpsertPollForm";

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
    const contextInvalidator = useContextInvalidator();

    const onAbort = () => navigate("/avstemninger");

    const onSuccess = () => {
        contextInvalidator();
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
