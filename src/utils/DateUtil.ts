import moment from "moment";
import { ITask, IBreak } from "../model/store";

class DateUtil {
    public static computeTotalDuration(entities: ITask[]|IBreak[]): moment.Duration {
        let totalDuration: moment.Duration = moment.duration();

        _.each(entities, (entity: ITask|IBreak) => {
            let duration: moment.Duration = DateUtil.computeDuration(entity);
            totalDuration.add(duration);
        });

        return totalDuration;
    }

    public static computeDuration(entity: ITask|IBreak): moment.Duration {
        let start: moment.Moment = DateUtil.getDate(entity.startDate);
        let end: moment.Moment = DateUtil.getDate(entity.endDate);

        return moment.duration(end.diff(start));
    }

    public static computeTimeInterval(interval: string): ITimeInterval {
        let periods: string[] = interval.split("-");

        return {
            startTime: periods[0].trim(),
            endTime: periods[1].trim()
        };
    }

    public static formatDuration(duration: moment.Duration): string {
        return duration.format("HH:mm");
    }

    public static getDate(date: string): moment.Moment {
        return moment(date, "DD/MM/YYYY HH:mm");
    }

    public static extractDate(date: string): string {
        return moment(date, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY");
    }

    public static extractTime(date: string): string {
        return moment(date, "DD/MM/YYYY HH:mm").format("HH:mm");
    }
}

export interface ITimeInterval {
    startTime: string;
    endTime: string;
}

export interface IDateInterval {
    startDate: string;
    endDate: string;
}

export default DateUtil;
