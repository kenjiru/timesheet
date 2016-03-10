import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import * as storage from "store";
import { Grid, Row, Col, ButtonGroup, Button } from "react-bootstrap";

import store, { IStore } from "./model/store";
import { updateStore } from "./model/actions";
import TaskManager from "./components/task-manager/TaskManager";
import CreateTask from "./components/create-task/CreateTask";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "react-select/dist/react-select.css";

import './App.less';

class App extends React.Component<IAppProps, IAppState> {
    constructor(props:IAppProps) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <div className="app">
                    <Grid className="app" fluid={true}>
                        <Row>
                            <Col xs={6}>
                                <h1>Timesheet</h1>
                            </Col>

                            <Col xs={6} className="text-right">
                                <h1> </h1>
                                <ButtonGroup>
                                    <Button onClick={this.saveStore.bind(this)}>Save Store</Button>
                                    <Button onClick={this.loadStore.bind(this)}>Load Store</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Grid>

                    <TaskManager/>
                </div>
            </Provider>
        )
    }

    saveStore() {
        let state:IStore = store.getState();

        storage.set("store", state);
        console.log("Save Store: ", state);
    }

    loadStore() {
        let state: IStore = storage.get("store");

        store.dispatch(updateStore(state));
        console.log("Load Store: ", state);
    }
}

interface IAppProps {}

interface IAppState {}

ReactDOM.render(<App/>, document.body);