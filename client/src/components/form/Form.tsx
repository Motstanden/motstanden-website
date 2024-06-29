import { Divider } from "@mui/material"
import { useState } from "react"
import { httpSendJson } from "src/utils/postJson"
import SubmitFormButtons from "./SubmitButtons"

export function Form({
    value,
    children,
    disabled,
    url,
    preventSubmit,
    onSuccess,
    onFailure,
    onAbortClick,
    noDivider,
    noPadding,
    httpVerb = "POST"
}: {
    value: object | (() => object)    // Either any object, or a callback function that returns the object
    children: React.ReactNode
    url: string
    disabled?: boolean
    preventSubmit?: () => boolean
    onSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
    onFailure?: () => void
    onAbortClick?: React.MouseEventHandler<HTMLButtonElement>
    noDivider?: boolean
    noPadding?: boolean
    httpVerb?: "POST" | "PATCH" | "PUT"
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (preventSubmit && preventSubmit())
            return;
        setIsSubmitting(true)

        const newValue = typeof value === "function" ? value() : value

        const response = await httpSendJson(httpVerb, url, newValue, { alertOnFailure: true })

        if (response && response.ok) {
            onSuccess && await onSuccess(response)
        }

        if (response && !response.ok) {
            onFailure && onFailure()
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
