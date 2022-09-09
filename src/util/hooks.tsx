import { useCallback, Dispatch, SetStateAction } from "react"
import { useHistory, useLocation } from "react-router-dom"

import qs from "qs"

export function useQueryState(name: string, initialValue: string | null = null): [string, Dispatch<SetStateAction<string|null>>] {
    const location = useLocation()
    const history = useHistory()

    const setQuery = useCallback(
        value => {
            const existingQueries = qs.parse(location.search, {
                ignoreQueryPrefix: true,
            })

            const queryString = qs.stringify(
                { ...existingQueries, [name]: value },
                { skipNulls: true }
            )
            history.push(`${location.pathname}?${queryString}`)
        },
        [history, location, name]
    )

    return [
        String(qs.parse(location.search, { ignoreQueryPrefix: true })[name] || initialValue),
        setQuery,
    ]
};