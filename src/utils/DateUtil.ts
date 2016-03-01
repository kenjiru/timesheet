import moment from "moment";

class DateUtil {
    static getDate(date:string):moment.Moment {
        return moment(date, "DD/MM/YYYY HH:mm");
    }

    static extractDate(date:string):string {
        return moment(date, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY");
    }

    static extractTime(date:string):string {
        return moment(date, "DD/MM/YYYY HH:mm").format("HH:mm");
    }
}

export default DateUtil;