import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as storage from "store";
import { Grid, Row, Col, ButtonGroup, Button } from "react-bootstrap";

import store, { IStore } from "./model/store";
import { updateStore } from "./model/actions";
import TaskManager from "./components/task-manager/TaskManager";

import XmlUtil from "./utils/XmlUtil";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "react-select/dist/react-select.css";

import "./App.less";

class App extends React.Component<IAppProps, IAppState> {
    public render(): React.ReactElement<any> {
        return (
            <Provider store={store}>
                <div className="app">
                    <Grid className="app" fluid={true}>
                        <Row>
                            <Col xs={6}>
                                <h1>Timesheet</h1>
                            </Col>

                            <Col xs={6} className="text-right">
                                <h1></h1>
                                <ButtonGroup>
                                    <Button onClick={this.loadFromXml}>Load from XML</Button>
                                    <Button onClick={this.saveToXml}>Save to XML</Button>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button onClick={this.saveStore}>Save Store</Button>
                                    <Button onClick={this.loadStore}>Load Store</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Grid>

                    <TaskManager/>
                </div>
            </Provider>
        );
    }

    private saveStore(): void {
        let state: IStore = store.getState();

        storage.set("store", state);
        console.log("Save Store: ", state);
    }

    private loadStore(): void {
        let state: IStore = storage.get("store");

        store.dispatch(updateStore(state));
        console.log("Load Store: ", state);
    }

    private loadFromXml(): void {
        XmlUtil.loadMockXml().then((state: IStore) => {
            console.log(state);

            store.dispatch(updateStore(state));
        });
    }

    private saveToXml(): void {
        let state: IStore = store.getState();
        let xmlStr: string = XmlUtil.convertStoreToXml(state);

        console.log(state);
        console.log(xmlStr);
    }
}

interface IAppProps {}

interface IAppState {}

ReactDOM.render(<App/>, document.body);
