import * as React from 'react';

const font = 'normal normal 300 32px/1.3 "Lato", sans-serif';

export default class TextSpan extends React.Component<{}, {}> {
	render() {
		return (
			<text style={{font: font}} y={32}>
				{this.props.children}
			</text>
		);
	}
}
