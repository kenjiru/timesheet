import * as React from "react";
import * as ReactDOM from "react-dom";

import "bootstrap-datepicker";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.css";

class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
    static defaultProps:IDatePickerProps = {
        options: {
            autoclose: true,
            format: "dd/mm/yyyy"
        }
    };

    componentDidMount() {
        let domElement = ReactDOM.findDOMNode(this);

        let $datePicker = $(domElement).find("input").datepicker(this.props.options);

        $datePicker.on("changeDate", (ev) => {
            if (typeof this.props.onChange == "function") {
                this.props.onChange(ev.date);
            }
        });
    }

    render() {
        return (
            <div className="date-picker">{this.props.children}</div>
        )
    }
}

interface IDatePickerProps extends React.Props<DatePicker> {
    options?: any,
    onChange?: (date:Date) => void
}
interface IDatePickerState {}

export default DatePicker;