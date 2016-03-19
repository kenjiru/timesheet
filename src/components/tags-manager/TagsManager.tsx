import * as React from "react";
import { Row, Col, Modal, Button, Input, ListGroup, ListGroupItem, Glyphicon } from "react-bootstrap";

import IdUtil from "../../utils/IdUtil";
import { ITag } from "../../model/store";
import { IAction, addTag, removeTag, updateTag } from "../../model/actions";

import "./TagsManager.less";

class TagsManager extends React.Component<ITagsManagerProps, ITagsManagerState> {
    constructor(props: ITagsManagerProps) {
        super(props);

        this.state = {
            showCreateTag: false,
            tagName: null,
            editTagId: null
        };
    }

    public render(): React.ReactElement<any> {
        return (
            <Modal show={true} onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Tags</Modal.Title>
                </Modal.Header>

                <Modal.Body className="tags-manager">
                    <h4>Tags</h4>

                    {this.renderTags()}

                    <div className="add-button-container text-right">
                        <Button bsStyle="primary" className="add" bsSize="xsmall"
                                onClick={this.handleShowCreateTag.bind(this)}>
                            <Glyphicon glyph="plus"/>
                        </Button>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose.bind(this)}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    private renderTags(): React.ReactElement<any> {
        if (this.props.tags.length === 0) {
            return <div>No tags defined!</div>;
        }

        return (
            <ListGroup className="tags-list">
                {this.renderDefinedTags()}
                {this.renderNewTag()}
            </ListGroup>
        );
    }

    private renderDefinedTags(): React.ReactElement<any>[] {
        return _.map(this.props.tags, (tag: ITag) => {
            if (this.state.editTagId === tag.tagId) {
                return this.renderUpdateTag(tag);
            } else {
                return this.renderTag(tag);
            }
        });
    }

    private renderTag(tag: ITag): React.ReactElement<any> {
        return (
            <ListGroupItem key={tag.tagId} className="tag-item">
                <Row>
                    <Col xs={1}>
                        <Glyphicon glyph="tag"/>
                    </Col>
                    <Col xs={10}>
                        <div onClick={this.handleShowEditTag.bind(this, tag.tagId, tag.name)}>{tag.name}</div>
                    </Col>
                    <Col xs={1} className="remove-button-container text-right">
                        <Button bsStyle="danger" bsSize="xsmall" className="remove"
                                onClick={this.handleDeleteTag.bind(this, tag.tagId)}>
                            <Glyphicon glyph="remove"/>
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }

    private renderUpdateTag(tag: ITag): React.ReactElement<any> {
        return (
            <ListGroupItem key={"edit-" + tag.tagId} className="tag-item edit-tag">
                <Row>
                    <Col xs={1}>
                        <Glyphicon glyph="tag"/>
                    </Col>
                    <Col xs={10}>
                        <Input type="text" bsSize="small" placeholder="Tag name" value={this.state.tagName}
                               onChange={this.handleTagNameChange.bind(this)}/>
                    </Col>
                    <Col xs={1} className="save-button-container text-right">
                        <Button bsStyle="success" bsSize="xsmall" className="update"
                                onClick={this.handleUpdateTag.bind(this)}>
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }

    private renderNewTag(): React.ReactElement<any> {
        if (!this.state.showCreateTag) {
            return;
        }

        return (
            <ListGroupItem key="new-tag" className="tag-item new-tag">
                <Row>
                    <Col xs={1}>
                        <Glyphicon glyph="tag"/>
                    </Col>
                    <Col xs={10}>
                        <Input type="text" bsSize="small" placeholder="Tag name" value={this.state.tagName}
                               onChange={this.handleTagNameChange.bind(this)}/>
                    </Col>
                    <Col xs={1} className="save-button-container text-right">
                        <Button bsStyle="success" bsSize="xsmall" className="save"
                                onClick={this.handleCreateTag.bind(this)}>
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }

    private handleCreateTag(): void {
        let newTag: ITag = {
            tagId: IdUtil.newId(),
            name: this.state.tagName,
            color: null,
            deleted: false,
            lastUpdate: null
        };

        this.props.dispatch(addTag(newTag));

        this.setState({
            showCreateTag: false,
            tagName: ""
        });
    }

    private handleUpdateTag(): void {
        let updatedTag: ITag = {
            tagId: this.state.editTagId,
            name: this.state.tagName,
            color: null,
            deleted: false,
            lastUpdate: null
        };

        this.props.dispatch(updateTag(updatedTag));

        this.setState({
            editTagId: null,
            tagName: null
        });
    }

    private handleDeleteTag(tagId: string): void {
        this.props.dispatch(removeTag(tagId));
    }

    private handleShowCreateTag(): void {
        this.setState({
            showCreateTag: !this.state.showCreateTag
        });
    }

    private handleShowEditTag(tagId: string, tagName: string): void {
        if (this.state.showCreateTag) {
            return;
        }

        this.setState({
            editTagId: tagId,
            tagName: tagName
        });
    }

    private handleTagNameChange(ev: any): void {
        this.setState({
            tagName: ev.target.value
        });
    }

    private handleClose(): void {
        this.props.onClose();
    }
}

interface ITagsManagerProps extends React.Props<TagsManager> {
    tags: ITag[];
    onClose: () => void;
    dispatch: (action: IAction) => void;
}

interface ITagsManagerState {
    showCreateTag?: boolean;
    tagName?: string;
    editTagId?: string;
}

export default TagsManager;
