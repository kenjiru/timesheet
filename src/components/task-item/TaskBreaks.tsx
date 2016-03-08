import * as React from "react";
import { Grid, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";

import { IBreak } from "../../model/store";
import DateUtil from "../../utils/DateUtil";

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

        return (
            <ListGroupItem key={index} bsStyle={bsStyle}>
                <Row>
                    <Col md={2}>
                        <div>{DateUtil.extractTime(breakItem.startDate)} - {DateUtil.extractTime(breakItem.endDate)}</div>
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
}

interface ITaskBreaksProps extends React.Props<TaskBreaks> {
    breaks: IBreak[]
}

interface ITaskBreaksState {
}

export default TaskBreaks;