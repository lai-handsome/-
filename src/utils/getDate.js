export function startAndEndDate (item, dateSeparator) {
    const start = new Date()
    const end = new Date()
    let range = 0
    if (item.type === 'month') {
        let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let year = end.getFullYear()
        if (year % 4 === 0) {
            monthDays[1] = 29
        } else {
            monthDays[1] = 28
        }
        let reverseMonthDays = []
        for (let i = monthDays.length - 1; i >= 0; i--) {
            reverseMonthDays.push(monthDays[i])
        }
        let month = end.getMonth()
        let daysArr = []
        for (let i = 0; i < item.range; i++) {
            month = month - 1
            daysArr.push(month)
        }
        daysArr.forEach(item => {
            if (item > 0) {
                range = range + monthDays[item]
            } else {
                let index = Math.abs(item)
                range = range + reverseMonthDays[index]
            }
        })
    } else if (item.type === 'date') { //最近一天，最近一周
        range = item.range
    }
    start.setTime(start.getTime() - 3600 * 1000 * 24 * range);

    const startTime = getTime(start, dateSeparator)
    const endTime = getTime(end, dateSeparator)

    return [startTime, endTime]
}

export function getTime (time, dateSeparator) {
    /**
     *  @param time 没有格式化的日期
     *  @param dateSeparator 日期分隔符
     */
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    month = month >= 10 ? month : '0' + month
    let date = time.getDate()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    return [year, month, date].join(dateSeparator) + ' ' + [hours, minutes, seconds].join(':')
}
