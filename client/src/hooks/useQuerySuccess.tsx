import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export function useQuerySuccess(
    query: Pick<UseQueryResult, "isSuccess">, 
    cb?: VoidFunction
) {
    const { isSuccess } = query;
    const callbackRef = useRef(cb);
    let cancel = false
    useEffect(() => {
        if (isSuccess && !cancel) {
            callbackRef.current?.();
        }
        return () => {
            cancel = true
        }

    }, [isSuccess]);
}