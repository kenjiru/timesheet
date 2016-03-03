import * as React from "react";
import { Grid, Row, Col, Modal, Panel, Button, Input, ListGroup, ListGroupItem, Glyphicon } from "react-bootstrap";

import IdUtil from "../../utils/IdUtil";
import { ITag } from "../../model/store";
import { IAction, addTag, removeTag } from "../../model/actions";

import "./TagsManager.less";

class TagsManager extends React.Component<ITagsManagerProps, ITagsManagerState> {
    constructor(props:ITagsManagerProps) {
        super(props);

        this.state = {
            showCreateTag: false,
            tagName: null
        }
    }

    render() {
        return (
            <Modal show={true} onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Tags</Modal.Title>
                </Modal.Header>

                <Modal.Body className="tags-manager">
                    <h4>Tags</h4>

                    {this.renderTags()}

                    <div className="add-button-container text-right">
                        <Button className="remove" bsSize="xsmall" onClick={this.handleShowCreateTag.bind(this)}>
                            <Glyphicon glyph="plus"/>
                        </Button>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose.bind(this)}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderTags() {
        if (this.props.tags.length == 0) {
            return <div>No tags defined!</div>
        }

        return (
            <ListGroup className="tags-list">
                {this.renderDefinedTags()}
                {this.renderNewTag()}
            </ListGroup>
        )
    }

    renderDefinedTags() {
        return _.map(this.props.tags, (tag:ITag) => (
            <ListGroupItem key={tag.tagId} className="tag-item">
                <Row>
                    <Col xs={1}><Glyphicon glyph="tag"/></Col>
                    <Col xs={10}>{tag.name}</Col>
                    <Col xs={1} className="remove-button-container text-right">
                        <Button bsSize="xsmall" className="remove" onClick={this.handleDeleteTag.bind(this, tag.tagId)}>
                            <Glyphicon glyph="remove"/>
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        ));
    }

    renderNewTag() {
        if (!this.state.showCreateTag) {
            return;
        }

        return (
            <ListGroupItem key="new-tag" className="tag-item new-tag">
                <Row>
                    <Col xs={1}><Glyphicon glyph="tag"/></Col>
                    <Col xs={10}>
                        <Input type="text" bsSize="small" placeholder="Tag name" value={this.state.tagName}
                               onChange={this.handleTagNameChange.bind(this)}/>
                    </Col>
                    <Col xs={1} className="save-button-container text-right">
                        <Button bsSize="xsmall" className="save" onClick={this.handleCreateTag.bind(this)}>
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        )
    }

    handleCreateTag() {
        let newTag:ITag = {
            tagId: IdUtil.newId(),
            name: this.state.tagName
        };

        this.props.dispatch(addTag(newTag));

        this.setState({
            showCreateTag: false,
            tagName: ""
        });
    }

    handleDeleteTag(tagId:string) {
        this.props.dispatch(removeTag(tagId));
    }

    handleShowCreateTag() {
        this.setState({
            showCreateTag: !this.state.showCreateTag
        });
    }

    handleTagNameChange(ev) {
        this.setState({
            tagName: ev.target.value
        });
    }

    handleClose() {
        this.props.onClose();
    }
}

interface ITagsManagerProps extends React.Props<TagsManager> {
    tags: ITag[],
    onClose: () => void,
    dispatch: (action) => void
}

interface ITagsManagerState {
    showCreateTag?: boolean,
    tagName?: string
}

export default TagsManager;