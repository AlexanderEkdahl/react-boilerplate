import * as React from 'react';
import {max} from 'd3-array';
import {scaleLinear} from 'd3-scale';

export interface BarChartCanvasProps {
	width: number,
	height: number,
	barWidth: number,
	padding: number,
	data : number[],
}

export default class BarChartCanvas extends React.Component<BarChartCanvasProps, {}> {
	canvas: HTMLCanvasElement

	draw(canvas : HTMLCanvasElement, props : BarChartCanvasProps) {
		const {
			data,
			width,
			height,
			barWidth,
			padding,
		} = props;
		const ctx = canvas.getContext('2d');

		const y = scaleLinear<number>().domain([0, max(data, (d) : number => d.length)]).rangeRound([0, height]);

		ctx.fillStyle = styles.bar.backgroundColor;
		for (let i = 0; i < data.length; i++) {
			ctx.fillRect((barWidth + padding) * i, 0, barWidth, height);
		}

		ctx.fillStyle = styles.bar.color;
		for (let i = 0; i < data.length; i++) {
			ctx.fillRect((barWidth + padding) * i, height - y(data[i]), barWidth, y(data[i]));
		}
	}

	componentDidMount() {
		this.draw(this.canvas, this.props);
	}

	componentDidUpdate() {
		this.draw(this.canvas, this.props);
	}

	render() {
		return (
			<canvas style={styles.canvas} width={this.props.width} height={this.props.height} ref={(ref) => this.canvas = ref} />
		);
	}
}

const styles = {
	canvas: {
		display: 'block',
	},

	bar: {
		color: "steelblue",
		backgroundColor: '#F6F9FB',
	}
}
