import { QueryKey, useQueryClient } from "@tanstack/react-query"

export function useQueryInvalidator(queryKey: QueryKey) {  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryClient = useQueryClient()

    const invalidateQuery = () => {
        queryClient.invalidateQueries({queryKey: queryKey})
    }

    return invalidateQuery
}