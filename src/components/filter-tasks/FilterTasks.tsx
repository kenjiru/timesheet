import * as React from "react";
import { Panel, Row, Col, Input, Glyphicon } from "react-bootstrap";
import * as moment from "moment";

import { ITask, IBreak } from "../../model/store";
import DateUtil, { IWorkBreakDuration } from "../../utils/DateUtil";
import { IEntry, IMomentInterval } from "../../utils/CommonInterfaces";

import "./FilterTasks.less";

class FilterTasks extends React.Component<IFilterTasksProps, IFilterTasksState> {
    private availableIntervals: IFilterInterval[] = [
        {
            id: "none",
            label: "None",
            startDate: null,
            endDate: null
        }, {
            id: "today",
            label: "Today",
            startDate: moment().startOf("day"),
            endDate: moment().endOf("day")
        }, {
            id: "yesterday",
            label: "Yesterday",
            startDate: moment().startOf("day").subtract(1, "days"),
            endDate: moment().endOf("day").subtract(1, "days")
        }, {
            id: "this-week",
            label: "This Week",
            startDate: moment().startOf("isoWeek"),
            endDate: moment()
        }, {
            id: "last-week",
            label: "Last Week",
            startDate: moment().startOf("isoWeek").subtract(1, "week"),
            endDate: moment().endOf("isoWeek").subtract(1, "week")
        }, {
            id: "this-month",
            label: "This Month",
            startDate: moment().startOf("month"),
            endDate: moment()
        }, {
            id: "last-month",
            label: "Last Month",
            startDate: moment().startOf("month").subtract(1, "month"),
            endDate: moment().endOf("month").subtract(1, "month")
        }
    ];

    constructor(props: IFilterTasksProps) {
        super(props);

        this.state = {
            selectedIntervalId: "none"
        };
    }

    public render(): React.ReactElement<any> {
        let workBreakDuration: IWorkBreakDuration =
            DateUtil.computeWorkBreakDuration(this.props.tasks, this.props.breaks);

        return (
            <Panel className="filter-tasks">
                <Row>
                    <Col xs={2} md={2}>
                        <Input type="select" label="Filter interval" value={this.state.selectedIntervalId}
                               onChange={this.handleIntervalChange.bind(this)}
                               addonBefore={<Glyphicon glyph="calendar"/>}>
                            {this.renderAvailableIntervals()}
                        </Input>
                    </Col>
                    <Col xs={6} md={6}> </Col>
                    <Col xs={4} md={4} className="text-right">
                        <div>Total work time: {DateUtil.formatDuration(workBreakDuration.workDuration)}</div>
                        <div>Total breaks: {DateUtil.formatDuration(workBreakDuration.breakDuration)}</div>
                    </Col>
                </Row>
            </Panel>
        );
    }

    private renderAvailableIntervals(): React.ReactElement<any>[] {
        return _.map(this.availableIntervals, (interval: IFilterInterval) => (
            <option key={interval.id} value={interval.id}>{interval.label}</option>
        ));
    }

    private handleIntervalChange(ev: any): void {
        let selectedIntervalId: string = ev.target.value;

        this.setState({
            selectedIntervalId
        });

        let selectedInterval: IFilterInterval =
            _.find(this.availableIntervals, (interval: IFilterInterval) => interval.id === selectedIntervalId);

        if (_.isFunction(this.props.onIntervalChange)) {
            let interval: IMomentInterval = null;

            if (selectedInterval.startDate !== null && selectedInterval.endDate !== null) {
                interval = {
                    startDate: selectedInterval.startDate,
                    endDate: selectedInterval.endDate
                };
            }

            this.props.onIntervalChange(interval);
        }
    }
}

interface IFilterTasksProps extends React.Props<FilterTasks> {
    tasks: ITask[];
    breaks: IBreak[];
    onIntervalChange: (selectedInterval: IMomentInterval) => void;
}

interface IFilterTasksState {
    selectedIntervalId: string;
}

interface IFilterInterval extends IEntry, IMomentInterval {}

export default FilterTasks;
