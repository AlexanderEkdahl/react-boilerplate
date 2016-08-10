import * as React from 'react';
import {max, extent} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {Timer, timer} from 'd3-timer';
import {easeCubic} from 'd3-ease';

interface BarsProps {
	data: number[],
	height: number,
	barWidth: number,
	padding: number,
	duration: number
}

interface BarsState {
	previousValues: number[],
}

class Bars extends React.Component<BarsProps, BarsState> {
	timer: Timer;
	bars: SVGElement[];

	constructor(props : BarsProps) {
		super(props);
		this.state = {
			previousValues: this.props.data.map(() => 0),
		};
	}
	componentDidMount() {
		// this.animate();
	}
	componentWillReceiveProps() {
		this.setState({
			previousValues: this.props.data,
		});
	}
	componentDidUpdate() {
		// this.animate();
	}
	componentWillUnmount() {
		if (this.timer) {
			this.timer.stop();
		}
	}
	previousValue(i: number) {
		return this.props.data[i];
		// return this.state.previousValues[i] === undefined ? 0 : this.state.previousValues[i];
	}
	animate() {
		if (this.timer) {
			this.timer.stop();
		}

		this.timer = timer((elapsed) => {
			const delta = easeCubic(Math.min(elapsed / this.props.duration, 1.0));

			for (let i = 0; i < this.props.data.length; i++) {
				const newValue = this.previousValue(i) + (this.props.data[i] - this.previousValue(i)) * delta;
				this.bars[i].setAttribute("height", newValue.toString());
				this.bars[i].setAttribute("y", (this.props.height - newValue).toString());
			}

			if (elapsed > this.props.duration) {
				this.timer.stop();
				// If an update happens that is never seen, the state is not properly updated
				// because timer never triggers
				// this.setState({
				// 	previousValues: this.props.data,
				// })
			}
		});
	}
	render() {
		let {
			data,
			height,
			barWidth,
			padding
		} = this.props;
		this.bars = [];

		return (
			<g>
				{data.map((_, i) => {
					return (
						<rect ref={(ref) => this.bars[i] = ref}
						      key={i}
						      x={(barWidth + padding) * i}
						      y={height - this.previousValue(i)}
						      width={barWidth}
						      height={this.previousValue(i)}
						      fill={styles.bar.color} />
					);
				})}
			</g>
		);
	}
}

export interface BarChartProps {
	width: number,
	height: number,
	barWidth: number,
	padding: number,
	data : number[],
}

export default class BarChart extends React.Component<BarChartProps, {}> {
	render() {
		let {
		  data,
		  width,
		  height,
		  barWidth,
		  padding,
		} = this.props;

		const backgroundBars = data.map((_, i) => {
	      return (
	        <rect key={i}
	              x={(barWidth + padding) * i}
	              y={0}
	              width={barWidth}
	              height={height}
	              fill={styles.bar.backgroundColor} />
	      );
	    });

		const y = scaleLinear<number>().domain(extent(data)).rangeRound([0, height]);

		return (
			<g width={width} height={height}>
			  <g>
				{backgroundBars}
			  </g>
			  <Bars data={data.map((d) => y(d))}
	                height={height}
	                barWidth={barWidth}
	                padding={padding}
	                duration={600} />
			</g>
		);
	}
}

const styles = {
	bar: {
		color: "steelblue",
		backgroundColor: '#F6F9FB',
	}
}
