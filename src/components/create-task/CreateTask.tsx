import * as React from "react";
import { Grid, Row, Col, Button, Input, ButtonInput, Glyphicon } from "react-bootstrap";
import Select from "react-select";

import TagsManager from "../tags-manager/TagsManager";
import DatePicker from "../../widgets/date-picker/DatePicker";

import DateUtil, { IDateInterval, ITimeInterval } from "../../utils/DateUtil";
import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import { IAction, addTask, addTaskTag, addBreak } from "../../model/actions";
import IdUtil from "../../utils/IdUtil";
import { IOption } from "../../utils/CommonInterfaces";

import "./CreateTask.less";

class CreateTask extends React.Component<ICreateTaskProps, ICreateTaskState> {
    constructor(props: ICreateTaskProps) {
        super(props);

        this.state = {
            startDate: "18/02/2016",
            projectId: null,
            workingInterval: "08:30-12:30, 14:00-18:00",
            description: "Setting up the project",
            tagId: "office",
            showManageTags: false
        };
    }

    public render(): React.ReactElement<any> {
        return (
            <Grid className="create-task" fluid={true}>
                <Row>
                    <Col xs={6} md={2}>
                        <DatePicker onChange={this.handleStartDateChanged.bind(this)}>
                            <Input type="text" label="Start date" placeholder="Start date" help="Format: 18/02/2016"
                                   value={this.state.startDate} readOnly addonBefore={<Glyphicon glyph="calendar"/>}/>
                        </DatePicker>
                    </Col>

                    <Col xs={6} md={2}>
                        <Input type="select" label="Project" placeholder="select" value={this.state.projectId}
                               onChange={this.handleProjectChanged.bind(this)}
                               addonBefore={<Glyphicon glyph="folder-open"/>}>
                            <option value="none">none</option>
                            {this.renderProjects()}
                        </Input>
                    </Col>

                    <Col md={2}>
                        <Input type="text" label="Working intervals" placeholder="Enter text here"
                               help="Example 08:30-12:30, 14:00-18:00" addonBefore={<Glyphicon glyph="time"/>}
                               hasFeedback value={this.state.workingInterval}
                               onChange={this.handleWorkingIntervalChange.bind(this)}/>
                    </Col>

                    <Col md={3}>
                        <Input type="text" label="Task description" placeholder="Enter description here" help=""
                               value={this.state.description} addonBefore={<Glyphicon glyph="pencil"/>} hasFeedback
                               onChange={this.handleTaskDescriptionChange.bind(this)}/>
                    </Col>

                    <Col md={2}>
                        <div className="form-group">
                            <label className="control-label">Tags</label>
                            <div className="tags-container input-group">
                                <span className="input-group-addon">
                                    <Glyphicon glyph="tags"/>
                                </span>

                                <Select name="tags-select" value={this.state.tagId} options={this.computeTagOptions()}
                                        onChange={this.handleTagsChange.bind(this)} multi={true}/>
                            </div>
                        </div>

                        <ButtonInput onClick={this.showManageTags.bind(this)}>Manage Tags</ButtonInput>
                    </Col>

                    <Col md={1} className="text-right">
                        <label className="control-label">&nbsp;</label>
                        <div className="form-group">
                            <Button bsStyle="primary" onClick={this.handleAddClicked.bind(this)}>Add Task</Button>
                        </div>
                    </Col>
                </Row>

                {this.renderManageTags()}
            </Grid>
        );
    }

    private renderManageTags(): React.ReactElement<any> {
        if (this.state.showManageTags) {
            return <TagsManager tags={this.props.tags} onClose={this.hideManageTags.bind(this)}
                                dispatch={this.props.dispatch}/>;
        }
    }

    private renderProjects(): React.ReactElement<any>[] {
        return _.map(this.props.projects, (project: IProject) => (
            <option key={project.projectId} value={project.projectId}>{project.name}</option>
        ));
    }

    private showManageTags(): void {
        this.setState({
            showManageTags: true
        });
    }

    private hideManageTags(): void {
        this.setState({
            showManageTags: false
        });
    }

    private handleStartDateChanged(date: Date): void {
        let dateStr: string = DateUtil.extractDate(date);

        this.setState({
            startDate: dateStr
        });
    }

    private handleProjectChanged(ev: any): void {
        this.setState({
            projectId: ev.target.value
        });
    }

    private handleWorkingIntervalChange(ev: any): void {
        this.setState({
            workingInterval: ev.target.value
        });
    }

    private handleTaskDescriptionChange(ev: any): void {
        this.setState({
            description: ev.target.value
        });
    }

    private handleTagsChange(selectedValues: IOption[]): void {
        let value: string = _.map(selectedValues, (selectedValue: IOption) => selectedValue.value).join(",");

        this.setState({
            tagId: value
        });
    }

    private handleAddClicked(): void {
        let taskId: string = this.createTask();
        this.createBreaks(taskId);
        this.createTaskTags(taskId);
    }

    private createTask(): string {
        let taskId: string = IdUtil.newId();
        let taskInterval: IDateInterval = this.computeTaskInterval();

        let task: ITask = {
            taskId,
            projectId: this.state.projectId,
            description: this.state.description,
            startDate: taskInterval.startDate,
            endDate: taskInterval.endDate,
            location: null,
            locationEnd: null,
            phoneNumber: null,
            distance: null,
            feeling: null,
            billable: null,
            paid: null,
            rateId: null,
            user: null,
            deleted: false,
            lastUpdate: null,
            type: null,
            startTime: null,
            endTime: null
        };

        this.props.dispatch(addTask(task));

        return taskId;
    }

    private createBreaks(taskId: string): void {
        let breaks: IBreak[] = this.computeBreaks(taskId);
        _.each(breaks, (breakItem: IBreak) => this.props.dispatch(addBreak(breakItem)));
    }

    private createTaskTags(taskId: string): void {
        let tagIds: string[] = this.state.tagId.split(",");

        _.each(tagIds, (tagId: string) => {
            let taskTag: ITaskTag = {
                id: IdUtil.newId(),
                taskId,
                tagId,
                deleted: false,
                lastUpdate: null
            };
            this.props.dispatch(addTaskTag(taskTag));
        });
    }

    private computeTagOptions(): any[] {
        return _.map(this.props.tags, (tag: ITag) => ({
            value: tag.tagId,
            label: tag.name
        }));
    }

    private computeBreaks(taskId: string): IBreak[] {
        let breaks: IBreak[] = [];

        let workingPeriods: ITimeInterval[] = this.computeWorkingPeriods();

        for (let i: number = 0; i < workingPeriods.length - 1; i++) {
            let startDate: string = this.state.startDate + " " + workingPeriods[i].endTime;
            let endDate: string = this.state.startDate + " " + workingPeriods[i + 1].startTime;

            breaks.push({
                breakId: IdUtil.newId(),
                taskId,
                startDate: DateUtil.getDateTime(startDate),
                endDate: DateUtil.getDateTime(endDate),
                description: null,
                user: null,
                deleted: false,
                lastUpdate: null,
                startTime: null,
                endTime: null
            });
        }

        return breaks;
    }

    private computeTaskInterval(): IDateInterval {
        let workingPeriods: ITimeInterval[] = this.computeWorkingPeriods();
        let startDate: string = this.state.startDate + " " + workingPeriods[0].startTime;
        let endDate: string = this.state.startDate + " " + workingPeriods[workingPeriods.length - 1].endTime;

        return {
            startDate: DateUtil.getDateTime(startDate),
            endDate: DateUtil.getDateTime(endDate)
        };
    }

    private computeWorkingPeriods(): ITimeInterval[] {
        let workingIntervals: string[] = this.state.workingInterval.split(",");

        return _.map(workingIntervals, (interval: string) => DateUtil.computeTimeInterval(interval));
    }
}

interface ICreateTaskProps {
    projects: IProject[];
    tags: ITag[];
    dispatch: (action: IAction) => void;
}

interface ICreateTaskState {
    startDate?: string;
    projectId?: string;
    workingInterval?: string;
    description?: string;
    tagId?: string;
    showManageTags?: boolean;
}

export default CreateTask;
