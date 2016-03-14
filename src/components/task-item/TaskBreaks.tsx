import * as React from "react";
import { Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";

import EditableText from "../../widgets/editable-text/EditableText";
import store, { IBreak } from "../../model/store";
import { updateBreak } from "../../model/actions";
import DateUtil, { ITimeInterval } from "../../utils/DateUtil";

import "./TaskBreaks.less";

class TaskBreaks extends React.Component<ITaskBreaksProps, ITaskBreaksState> {
    public render(): React.ReactElement<any> {
        return (
            <ListGroup className="task-breaks">
                {this.renderBreaks()}
            </ListGroup>
        );
    }

    private renderBreaks(): React.ReactElement<any>|React.ReactElement<any>[] {
        if (this.props.breaks.length === 0) {
            return <ListGroupItem key="no-breaks" bsStyle="warning">No breaks for this task</ListGroupItem>;
        }

        return _.map(this.props.breaks, (breakItem: IBreak, index: number) => {
            return this.renderBreak(breakItem, index);
        });
    }

    private renderBreak(breakItem: IBreak, index: number): React.ReactElement<any> {
        let bsStyle: string = index % 2 === 1 ? "warning" : null;
        let breakDuration: moment.Duration = DateUtil.computeDuration(breakItem);

        let breakInterval: string = DateUtil.extractTime(breakItem.startDate) + " - " +
                DateUtil.extractTime(breakItem.endDate);

        return (
            <ListGroupItem key={index} bsStyle={bsStyle}>
                <Row>
                    <Col xs={3} md={2}>
                        <EditableText value={breakInterval}
                                      onChange={this.handleBreakIntervalChange.bind(this, breakItem.breakId)}/>
                    </Col>
                    <Col xs={6} md={8}>
                        <EditableText value={breakItem.description}
                                      onChange={this.handleDescriptionChange.bind(this, breakItem.breakId)}/>
                    </Col>
                    <Col xs={3} md={2} className="text-right">
                        <div>{DateUtil.formatDuration(breakDuration)}</div>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }

    private handleBreakIntervalChange(breakId: string, intervalStr: string): void {
        let breakItem: IBreak = _.find(this.props.breaks, (item: IBreak) => item.breakId = breakId);
        breakItem = _.cloneDeep(breakItem);

        let breakInterval: ITimeInterval = DateUtil.computeTimeInterval(intervalStr);

        breakItem.startDate = DateUtil.extractDate(breakItem.startDate) + " " + breakInterval.startTime;
        breakItem.endDate = DateUtil.extractDate(breakItem.endDate) + " " + breakInterval.endTime;

        this.updateStore(breakItem);
    }

    private handleDescriptionChange(breakId: string, newDescription: string): void {
        let breakItem: IBreak = _.find(this.props.breaks, (item: IBreak) => item.breakId = breakId);
        breakItem = _.cloneDeep(breakItem);

        breakItem.description = newDescription;

        this.updateStore(breakItem);
    }

    private updateStore(newBreak: IBreak): void {
        store.dispatch(updateBreak(newBreak));
    }
}

interface ITaskBreaksProps extends React.Props<TaskBreaks> {
    breaks: IBreak[];
}

interface ITaskBreaksState {}

export default TaskBreaks;
