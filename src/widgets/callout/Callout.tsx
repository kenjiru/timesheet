import * as React from "react";

import "./Callout.less";

class Callout extends React.Component<ICalloutProps, ICalloutState> {
    public render(): React.ReactElement<any> {
        return (
            <div className={this.getClassName()}>
                {this.props.children}
            </div>
        );
    }

    private getClassName(): string {
        let className: string = "bs-callout";

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
    className?: string;
    bsStyle?: string;
}

interface ICalloutState {}

export default Callout;
