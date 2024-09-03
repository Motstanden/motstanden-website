import dayjs from 'dayjs'
import "dayjs/locale/nb.js"
import timezone from 'dayjs/plugin/timezone.js'
import utc from "dayjs/plugin/utc.js"

dayjs.locale("nb")
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Europe/Oslo")

export { dayjs }
