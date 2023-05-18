export const parseDate = (fullDate: Date) => {
    const year = String(fullDate.getFullYear())
    const month = String(fullDate.getMonth()).padStart(2, '0')
    const date = String(fullDate.getDate()).padStart(2, '0')

    return `${year}.${month}.${date}`
}
