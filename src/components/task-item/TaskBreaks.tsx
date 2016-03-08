import * as React from "react";
import { Grid, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";

import EditableText from "../../widgets/editable-text/EditableText";
import store, { IBreak } from "../../model/store";
import { updateBreak } from "../../model/actions";
import DateUtil, { ITimeInterval } from "../../utils/DateUtil";

import "./TaskBreaks.less";

class TaskBreaks extends React.Component<ITaskBreaksProps, ITaskBreaksState> {
    render() {
        return (
            <ListGroup className="task-breaks">
                {this.renderBreaks()}
            </ListGroup>
        )
    }

    renderBreaks() {
        return _.map(this.props.breaks, (breakItem:IBreak, index:number) => {
            return this.renderBreak(breakItem, index);
        });
    }

    renderBreak(breakItem:IBreak, index:number) {
        let bsStyle = index%2 == 1 ? "warning" : null;
        let breakDuration = DateUtil.computeDuration(breakItem);

        let breakInterval = DateUtil.extractTime(breakItem.startDate) + " - " + DateUtil.extractTime(breakItem.endDate);

        return (
            <ListGroupItem key={index} bsStyle={bsStyle}>
                <Row>
                    <Col md={2}>
                        <EditableText value={breakInterval}
                                      onChange={this.handleBreakIntervalChange.bind(this, breakItem.breakId)}/>
                    </Col>
                    <Col md={8}>
                        <div>breakDescription</div>
                    </Col>
                    <Col md={2} className="text-right">
                        <div>{DateUtil.formatDuration(breakDuration)}</div>
                    </Col>
                </Row>
            </ListGroupItem>
        )
    }

    handleBreakIntervalChange(breakId: string, intervalStr:string) {
        let breakItem: IBreak = _.find(this.props.breaks, breakItem => breakItem.breakId = breakId);
        breakItem = _.cloneDeep(breakItem);

        let breakInterval:ITimeInterval = DateUtil.computeTimeInterval(intervalStr);

        breakItem.startDate = DateUtil.extractDate(breakItem.startDate) + " " + breakInterval.startTime;
        breakItem.endDate = DateUtil.extractDate(breakItem.endDate) + " " + breakInterval.endTime;

        store.dispatch(updateBreak(breakItem));
    }
}

interface ITaskBreaksProps extends React.Props<TaskBreaks> {
    breaks: IBreak[]
}

interface ITaskBreaksState {
}

export default TaskBreaks;