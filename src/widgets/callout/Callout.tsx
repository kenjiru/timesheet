import * as React from "react";
import * as ReactDOM from "react-dom";

import "./Callout.less";

class Callout extends React.Component<ICalloutProps, ICalloutState> {
    render() {
        return (
            <div className={this.getClassName()}>
                {this.props.children}
            </div>
        )
    }

    getClassName() {
        let className = "bs-callout";

        if (this.props.className) {
            className += " " + this.props.className;
        }

        if (this.props.bsStyle) {
            className += " bs-callout-" + this.props.bsStyle;
        }

        return className;
    }
}

interface ICalloutProps extends React.Props<Callout> {
    className?: string,
    bsStyle?: string
}

interface ICalloutState {}

export default Callout;