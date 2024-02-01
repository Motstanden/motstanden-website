import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { useContextInvalidator } from "./Context";
import { UpsertRumourForm } from "./components/UpsertRumourForm";

export function NewRumourPage() {
    useTitle("Nytt rykte");
    const navigate = useNavigate();
    const contextInvalidator = useContextInvalidator();

    const onAbort = () => navigate("/rykter");

    const onSuccess = () => {
        contextInvalidator();
        navigate("/rykter");
    };

    return (
        <>
            <h1>Nytt rykte</h1>
            <UpsertRumourForm
                initialValue={{ rumour: "" }}
                postUrl="/api/rumours/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess} />
        </>
    );
}


