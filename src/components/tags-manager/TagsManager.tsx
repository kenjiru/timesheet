import * as React from "react";
import { Grid, Row, Col, Modal, Panel, Button, Input, ListGroup, ListGroupItem, Glyphicon } from "react-bootstrap";

import { ITag } from "../../model/store";

import "./TagsManager.less";

class TagsManager extends React.Component<ITagsManagerProps, ITagsManagerState> {
    render() {
        return (
            <Modal show={true} onHide={this.handleCloseClicked.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Tags</Modal.Title>
                </Modal.Header>

                <Modal.Body className="tags-manager">
                    <h4>Tags</h4>

                    {this.renderTags()}

                    <div className="add-button-container text-right">
                        <Button bsSize="xsmall" className="remove"><Glyphicon glyph="plus"/></Button>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleCloseClicked.bind(this)}>Close</Button>
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
                        <Button bsSize="xsmall" className="remove"><Glyphicon glyph="remove"/></Button>
                    </Col>
                </Row>
            </ListGroupItem>
        ));
    }

    handleCloseClicked() {
        this.props.onClose();
    }
}

interface ITagsManagerProps extends React.Props<TagsManager> {
    tags: ITag[],
    onClose: () => void
}

interface ITagsManagerState {
}

export default TagsManager;