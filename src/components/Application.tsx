import * as React from "react";
import Histogram from "./Histogram.tsx";
import {randomLogNormal} from 'd3-random';
import {range} from 'd3-array';

export interface ApplicationState {
	width?: number,
	height?: number,
	barWidth?: number,
	data?: {
		data1: number[],
		data2: number[],
		data3: number[],
	}
}

export class Application extends React.Component<{}, ApplicationState> {
	constructor() {
		super();
		this.state = {
			barWidth: 10,
			data: this.randomizeData(),
		};
	}

	randomizeData() {
		return {
	      data1: range(500).map(randomLogNormal()),
	      data2: range(500).map(randomLogNormal()),
	      data3: range(500).map(randomLogNormal()),
	    }
	}

	componentDidMount() {
		window.onresize = () => {
			this.forceUpdate();
		}

		setInterval(() => {
			this.setState({
				data: this.randomizeData()
			});
		}, 3000);
	}

    render() {
		return (
			<svg width={window.innerWidth} height={window.innerHeight}>
				<Histogram
					padding={1}
					targetBarWidth={this.state.barWidth}
					width={window.innerWidth / 2}
					height={200}
					data={this.state.data.data1}
					domain={[0, 4]} />
			</svg>
		);
    }
}
