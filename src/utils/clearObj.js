export const clearObj = (obj) => {
    for (const key in obj) {
        obj[key] = ''
    }
}