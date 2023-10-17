import { useQuery } from "@tanstack/react-query"
import { SimpleText } from "common/interfaces"
import { fetchAsync } from "src/utils/fetchAsync"
import { MarkDownRenderer } from "./MarkDownEditor"

export function SimpleTextFetcher({
    queryKeyModifier,
    textKey,
    skeleton,
}: {
    textKey: string
    queryKeyModifier?: any[]
    skeleton?: React.ReactNode
}) {
    const queryKey = buildQueryKey(textKey, queryKeyModifier)

    const { isLoading, isError, data, error } = useQuery<SimpleText>(queryKey, () => fetchAsync<SimpleText>(`/api/simple-text/${textKey}`))

    if(isLoading)
        return skeleton ? <>{skeleton}</> : <></>

    if(isError)
        return <span>{`${error}`}</span>

    return (
        <MarkDownRenderer value={data.text} />
    )
}

function buildQueryKey(textKey: string, otherKeys?: any[]): any[] {
    const queryKey = ["get", "/api/simple-text/:key", textKey ]
    if(otherKeys)
        queryKey.push(...otherKeys)
    return queryKey
}