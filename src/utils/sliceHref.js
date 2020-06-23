export function sliceHref () {
    let query = window.location.href.split('?')[1]
    let queryParam = query.split('&')
    let queryObj = {}
    for (let item of queryParam) {
        let i = item.indexOf('=')
        let key = item.slice(0, i)
        let value = item.slice(i + 1)
        queryObj[key] = value
    }
    return queryObj
}