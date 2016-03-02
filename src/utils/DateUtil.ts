import moment from "moment";
import { ITask, IBreak } from "../model/store";

class DateUtil {
    static computeTotalDuration(entities:ITask[]|IBreak[]):moment.Duration {
        let totalDuration = moment.duration();

        _.each(entities, (entity: ITask|IBreak) => {
            let duration = DateUtil.computeDuration(entity);
            totalDuration.add(duration);
        });

        return totalDuration;
    }

    static computeDuration(entity:ITask|IBreak):moment.Duration {
        let start:moment.Moment = DateUtil.getDate(entity.startDate);
        let end:moment.Moment = DateUtil.getDate(entity.endDate);

        return moment.duration(end.diff(start));
    }

    static formatDuration(duration:moment.Duration) {
        return duration.format("HH:mm");
    }

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