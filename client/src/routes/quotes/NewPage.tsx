import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { UpsertQuoteForm } from "src/routes/quotes/components/UpsertQuoteForm";
import { useContextInvalidator } from "src/routes/quotes/Context";

export default function NewPage() {
    useTitle("Nytt sitat");
    const navigate = useNavigate();
    const contextInvalidator = useContextInvalidator();

    const onAbort = () => navigate("/sitater");

    const onSuccess = () => {
        contextInvalidator();
        navigate("/sitater");
    };

    return (
        <>
            <h1>Nytt sitat</h1>
            <UpsertQuoteForm
                initialValue={{ quote: "", utterer: "" }}
                postUrl="/api/quotes/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess} />
        </>
    );
}
