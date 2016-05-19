export interface IEntry {
    id: string;
    label: string;
}

export interface IOption {
    value: string|number;
    label: string;
}
export interface IInterval {
    startDate: string;
    endDate: string;
}

export interface IMomentInterval {
    startDate: moment.Moment;
    endDate: moment.Moment;
}
