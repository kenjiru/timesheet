import moment from "moment";

class DateUtil {
    static extractDate(date:string):string {
        return moment(date, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY");
    }

    static extractTime(date:string):string {
        return moment(date, "DD/MM/YYYY HH:mm").format("HH:mm");
    }
}

export default DateUtil;