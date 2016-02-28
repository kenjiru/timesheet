import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col } from "react-bootstrap";

import { Provider } from "react-redux";

import store from "./model/store";
import CreateTask from "./components/create-task/CreateTask";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import './App.less';

class App extends React.Component<IAppProps, IAppState> {
    constructor(props:IAppProps) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <div className="app">
                    {this.renderHeader()}
                    <CreateTask/>
                </div>
            </Provider>
        )
    }

    renderHeader() {
        return (
            <Grid className="app" fluid={true}>
                <Row>
                    <Col md={12}>
                        <h1>Timesheet</h1>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

interface IAppProps {}

interface IAppState {}

ReactDOM.render(<App/>, document.body);