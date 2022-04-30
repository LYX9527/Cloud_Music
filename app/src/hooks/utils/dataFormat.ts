import dayjs from 'dayjs'

function dataFormat(date: Date, format: string): string {
    return dayjs(date).format(format);
}

export {
    dataFormat
}