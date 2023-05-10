import {useMatches} from "react-router-dom"
import {useMemo} from "react"

export const useCurrentHandle = ({handleKey}) => {
    const findMatchWithHandleKey = (matches, key) => {
        for (let i = matches.length - 1; i >= 0; i--) {
            const match = matches[i]
            if (match.handle && key in match.handle) {
                return match.handle[key]
            }
        }
        return null
    }
    const match = useMatches()
    return useMemo(() => findMatchWithHandleKey(match, handleKey), [match])
}