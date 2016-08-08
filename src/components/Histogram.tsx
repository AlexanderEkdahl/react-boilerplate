import * as React from 'react';
import {extent, histogram, range} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import BarChart from './barchart/BarChart.tsx';

export interface HistogramProps {
	padding: number,
	targetBarWidth: number,
	width: number,
	height: number,
	domain: [number, number],
	data: number[]
}

export default class Histogram extends React.Component<HistogramProps, {}> {
	costFunction(width: number, barWidth: number, padding: number) {
		let bars = Math.floor((padding + width) / (padding + barWidth));
		return width - (padding * (bars - 1) + bars * barWidth);
	}

    render() {
		const {
			padding,
			targetBarWidth,
			width,
			height,
		} = this.props;
	    let barWidth: number = targetBarWidth;
	    let cost: number = Infinity;

	    for (let i = Math.ceil(targetBarWidth / 1.1); i <= Math.floor(targetBarWidth * 1.1); i++) {
	      const newCost = this.costFunction(width, i, padding);

	      // if costs are equal, the closest one should be kept
	      // if (newCost == cost && Math.abs(targetBarWidth - i) < Math.abs(targetBarWidth - barWidth)) || newCost < cost
	      if (newCost < cost) {
	        cost = newCost;
	        barWidth = i;
	      }
	    }

	    const bars = Math.floor((padding + width) / (barWidth + padding));

	    // console.log('barWidth: " + barWidth);
	    // console.log("usedWidth: " + (padding * (bars - 1) + bars * barWidth));
	    // console.log("costFunction: " + this.costFunction(width, barWidth, padding));
	    // console.log("bars: " + bars);

	    const domain = this.props.domain ? this.props.domain : extent(this.props.data);
	    const x = scaleLinear<number>().domain([0, bars]).range(domain);
	    const thresholds = range(bars).map((d : number) => x(d));
	    const bins = histogram<number>().domain(domain).thresholds(thresholds)(this.props.data);

	    return (
	      <BarChart data={bins.map(d => d.length)} barWidth={barWidth} width={width} height={height} padding={padding} />
	    );
    }
}
