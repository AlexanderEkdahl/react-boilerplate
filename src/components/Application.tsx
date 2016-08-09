import * as React from 'react';
import {randomLogNormal} from 'd3-random';
import {range} from 'd3-array';
import {Stylesheet} from '../interfaces.ts';
import {Layout} from './layout.tsx';
import Histogram from './Histogram.tsx';
import TextBlock from './TextBlock.tsx';
import TextSpan from './TextSpan.tsx';

var data = range(500).map(randomLogNormal())
var text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.";

const layout = [
	'H:|-10%-[chart]-30-[summary]-10%-|',
	'H:|-10%-[header]-10%-|',
	'V:|-15%-[header(55)]-[chart]-25%-|',
	'V:|-15%-[header]-[summary(chart)]-25%-|',
	'H:[summary(300)]',
	'H:[chart(>=summary)]'
]

export class Application extends React.Component<{}, {}> {
	rqf: number

	onResize() {
		if (this.rqf) {
			return;
		}

		this.rqf = window.requestAnimationFrame(() => {
			this.rqf = null
			this.forceUpdate();
		});
	}

	componentDidMount() {
		window.addEventListener('resize', this.onResize.bind(this), false);
	}

    render() {
		const chart = (
			<Histogram padding={2}
				       targetBarWidth={25}
				       data={data}
				       domain={[0, 4]} />
	    )

		const summary = (
			<TextBlock text={text} />
	    )

		const header = (
			<TextSpan>
				This is fucking awesome
			</TextSpan>
	    )

		return (
			<svg width={window.innerWidth} height={window.innerHeight} style={styles['root']}>
				<Layout evfl={layout}
				        width={window.innerWidth}
						height={window.innerHeight}
						views={{chart: chart, summary: summary, header: header, }}/>
			</svg>
		);
    }
}

const styles: Stylesheet  = {
	root: {
		display: 'block',
		WebkitUserSelect: 'none',
		cursor: 'default',
	},
}
