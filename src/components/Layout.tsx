import * as React from "react";

declare function require(path: string) : any;
const AutoLayout = require('autolayout');

export interface LayoutProps {
	views: {[key: string]: JSX.Element},
	evfl: string[],
	width: number,
	height: number,
}

export class Layout extends React.Component<LayoutProps, {}> {
	view: any

	constructor(props: LayoutProps) {
		super(props);

        try {
			var constraints = AutoLayout.VisualFormat.parse(props.evfl, {extended: true});
        } catch (err) {
            console.error('parse error: ' + err.toString());
        }

        this.view = new AutoLayout.View({
            constraints: constraints,
            width: props.width,
            height: props.height
        });
    }

	componentWillUpdate(nextProps: LayoutProps) {
		this.view.setSize(nextProps.width, nextProps.height);
	}

	render() {
		let gs: JSX.Element[] = [];
		const keys = Object.keys(this.props.views);
		for (let i = 0; i < keys.length; i++) {
			const element = this.props.views[keys[i]];
			const subview = this.view.subViews[keys[i]];

			const additionalProps = {
				containerWidth: Math.round(subview.width),
				containerHeight: Math.round(subview.height),
				containerLeft: Math.round(subview.left),
				containerTop: Math.round(subview.top),
				// TODO: Add all? left, top, center...
				// TODO: Round values or not to round values?
			}

			gs.push(
				<g key={keys[i]} transform={`translate(${additionalProps.containerLeft},${additionalProps.containerTop})`}>
				   {React.cloneElement(element, additionalProps)}
				</g>
			)
		}

		// TODO: insert in z-order
		return <g>{gs}</g>
	}
}
