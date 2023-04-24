export const findMatchWithHandleKey = (matches, key) => {
    for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i]
        if (match.handle && key in match.handle) {
            return match.handle[key]
        }
    }
    return null
}