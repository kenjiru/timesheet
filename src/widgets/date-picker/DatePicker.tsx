import * as React from "react";
import * as ReactDOM from "react-dom";

import "bootstrap-datepicker";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.css";

class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
    static defaultProps:IDatePickerProps = {
        options: {
            autoclose: true
        }
    };

    componentDidMount() {
        let domElement = ReactDOM.findDOMNode(this);

        $(domElement).find("input").datepicker(this.props.options);
    }

    render() {
        return (
            <div className="date-picker">{this.props.children}</div>
        )
    }
}

interface IDatePickerProps extends React.Props<DatePicker> {
    options?: any
}
interface IDatePickerState {}

export default DatePicker;