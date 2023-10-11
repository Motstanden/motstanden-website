import { Form } from "src/components/form/Form"
import { UpsertPollForm } from "./components/UpsertPollForm"
import { useTitle } from "src/hooks/useTitle"
import { useNavigate } from "react-router-dom";
import { useContextInvalidator } from "src/routes/poll/Context";
import { NewPollWithOption } from "common/interfaces";

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
    useTitle("Ny avstemming");
    const navigate = useNavigate();
    const contextInvalidator = useContextInvalidator();

    const onAbort = () => navigate("/avstemminger");

    const onSuccess = () => {
        contextInvalidator();
        navigate("/avstemminger");
    };

    return (
        <>
            <h1>Ny avstemming</h1>
            <UpsertPollForm
                initialValue={emptyPoll}
                postUrl="/api/polls/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess} />
        </>
    );
}
