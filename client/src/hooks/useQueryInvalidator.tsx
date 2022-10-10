import { useQueryClient } from "@tanstack/react-query"

export function useQueryInvalidator(queryKey: any[]) {
    const queryClient = useQueryClient()

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey)
    }

    return invalidateQuery
}