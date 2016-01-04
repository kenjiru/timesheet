import React from "react";
import ReactDOM from "react-dom";

import './App.less';

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>App component</h1>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.body);