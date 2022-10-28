import dayjs from 'dayjs';
import "dayjs/locale/nb";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.locale("nb")
dayjs.extend(utc)
dayjs.extend(CustomParseFormat)

export default dayjs