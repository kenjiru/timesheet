import * as moment from "moment";
import { ITask, IBreak } from "../model/store";

class DateUtil {
    public static DATE_TIME_FORMAT: string = "DD/MM/YYYY HH:mm";

    public static computeWorkBreakDuration(tasks: ITask[], breaks: IBreak[]): IWorkBreakDuration {
        let workDuration: moment.Duration = DateUtil.computeTotalDuration(tasks);
        let breakDuration: moment.Duration = DateUtil.computeBreakDuration(tasks, breaks);

        return {
            workDuration: workDuration.subtract(breakDuration),
            breakDuration: breakDuration
        };
    }

    public static computeBreakDuration(tasks: ITask[], breaks: IBreak[]): moment.Duration {
        let totalBreakDuration: moment.Duration = moment.duration();

        _.each(tasks, (task: ITask) => {
            let taskBreaks: IBreak[] = _.filter(breaks, (breakItem: IBreak) => breakItem.taskId === task.taskId);
            let breakDuration: moment.Duration = DateUtil.computeTotalDuration(taskBreaks);

            totalBreakDuration.add(breakDuration);
        });

        return totalBreakDuration;
    }

    public static computeTotalDuration(entities: ITask[]|IBreak[]): moment.Duration {
        let totalDuration: moment.Duration = moment.duration();

        _.each(entities, (entity: ITask|IBreak) => {
            let duration: moment.Duration = DateUtil.computeDuration(entity);
            totalDuration.add(duration);
        });

        return totalDuration;
    }

    public static computeDuration(entity: ITask|IBreak): moment.Duration {
        let start: moment.Moment = moment(entity.startDate);
        let end: moment.Moment = moment(entity.endDate);

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

    public static getDateTime(date: string): string {
        return moment(date, DateUtil.DATE_TIME_FORMAT).format();
    }

    public static extractDate(date: string|Date): string {
        return moment(date).format("DD/MM/YYYY");
    }

    public static extractTime(date: string|Date): string {
        return moment(date).format("HH:mm");
    }
}

export interface IWorkBreakDuration {
    workDuration: moment.Duration;
    breakDuration: moment.Duration;
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
