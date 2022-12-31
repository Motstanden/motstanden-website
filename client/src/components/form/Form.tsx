import { Divider } from "@mui/material";
import { useState } from "react";
import { postJson } from "src/utils/postJson";
import SubmitFormButtons from "./SubmitButtons";

export function Form({
    value,
    children,
    disabled,
    postUrl,
    preventSubmit,
    onPostSuccess,
    onPostFailure,
    onAbortClick,
    noDivider,
    noPadding
}: {
    value: object | (() => object)    // Either any object, or a callback function that returns the object
    children: React.ReactNode
    postUrl: string
    disabled?: boolean
    preventSubmit?: () => boolean
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
    onPostFailure?: () => void
    onAbortClick?: React.MouseEventHandler<HTMLButtonElement>
    noDivider?: boolean
    noPadding?: boolean
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (preventSubmit && preventSubmit())
            return;
        setIsSubmitting(true)

        const newValue = typeof value === "function" ? value() : value
        const response = await postJson(postUrl, newValue, { alertOnFailure: true })

        if (response && response.ok) {
            onPostSuccess && await onPostSuccess(response)
        }

        if (response && !response.ok) {
            onPostFailure && onPostFailure()
        }

        setIsSubmitting(false)
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                {children}
                <div style={{ marginTop: noPadding ? undefined : "4em" }}>
                    <SubmitFormButtons loading={isSubmitting} onAbort={onAbortClick} disabled={disabled} />
                </div>
            </form>
            { !noDivider && <Divider sx={{ my: 3 }} /> }
        </>
    )
}
