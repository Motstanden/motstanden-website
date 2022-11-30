import dayjs from 'dayjs';
import "dayjs/locale/nb";
import CustomParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";

dayjs.locale("nb")
dayjs.extend(utc)
dayjs.extend(CustomParseFormat)

export default dayjs