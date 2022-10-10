import { useEffect } from "react";

export function useTitle(title: string | undefined): void {
    useEffect(() => {
        if (title) {
            document.title = `Motstanden | ${title}`
        }
        else {
            document.title = "Motstanden"
        }
    }, [title])
}