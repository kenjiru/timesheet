import * as React from "react";
import * as ReactDOM from "react-dom";

import "bootstrap-datepicker";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.css";

class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
    /* tslint:disable:no-unused-variable */
    private static defaultProps: IDatePickerProps = {
        options: {
            autoclose: true,
            format: "dd/mm/yyyy"
        }
    };
    /* tslint:enable:no-unused-variable */

    public componentDidMount(): void {
        let domElement: any = ReactDOM.findDOMNode(this);

        let $datePicker: any = $(domElement).find("input").datepicker(this.props.options);

        $datePicker.on("changeDate", (ev: any) => {
            if (typeof this.props.onChange === "function") {
                this.props.onChange(ev.date);
            }
        });
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="date-picker">{this.props.children}</div>
        );
    }
}

interface IDatePickerProps extends React.Props<DatePicker> {
    options?: any;
    onChange?: (date: Date) => void;
}

interface IDatePickerState {}

export default DatePicker;
