import * as React from "react";

const logo = require<string>('./logo.png');

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return (
            <div>
                <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
                <img src={logo} />
            </div>
        );
    }
}
