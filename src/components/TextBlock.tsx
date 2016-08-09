import * as React from 'react';

declare function require(path: string) : any;
const formatter: Formatter = require('../typeset/formatter.js');
const linebreak: Linebreak = require('../typeset/linebreak.js');

export interface TextBlockProps {
	text: string,
	containerWidth?: number
}

interface Node {
	type: string,
	penalty: number,
	value: string,
	width: number,
	shrink: number,
	stretch: number
}

interface Break {
	position: number,
	ratio: number,
}

interface Line {
	ratio: number,
	nodes: Node[],
}

interface Formatter {
	(f:(str: string) => number): {
		justify(text: string): Node[],
		center(text: string): Node[],
		left(text: string): Node[],
	}
}

interface Linebreak {
	(nodes: Node[], widths: number[], options: any): Break[],
	infinity: number
}

const font = 'normal normal 300 16px/1.3 "Lato", sans-serif';

export default class TextBlock extends React.Component<TextBlockProps, {}> {
	render() {
		var c: HTMLCanvasElement = document.createElement('canvas');
		var context = c.getContext('2d');
		context.font = font;
		let format = formatter((str: string) => {
			return context.measureText(str).width;
		});
		let nodes = format.justify(this.props.text);
		let breaks = linebreak(nodes, [this.props.containerWidth], {tolerance: 10});
		let lines: Line[] = [];
		let lineStart = 0;
		let y = 16; // font-size
		var tspans: JSX.Element[] = [];

		for (let i = 1; i < breaks.length; i++) {
			for (var j = lineStart; j < nodes.length; j++) {
				if (nodes[j].type === 'box' || (nodes[j].type === 'penalty' && nodes[j].penalty === -linebreak.infinity)) {
					lineStart = j;
					break;
				}
			}
			lines.push({
				ratio: breaks[i].ratio,
				nodes: nodes.slice(lineStart, breaks[i].position + 1)
			});
			lineStart = breaks[i].position;
		}

		for (let i = 0; i < lines.length; i++) {
		    let line = lines[i];
			var x = 0;

			for (let j = 0; j < line.nodes.length; j++) {
			    let node = line.nodes[j];
				if (node.type === 'box') {
					tspans.push(
						<tspan key={`${i}-${j}`} x={x} y={y}>{node.value}</tspan>
					);
					x += node.width;
				} else if (node.type === 'glue') {
					x += node.width + line.ratio * (line.ratio < 0 ? node.shrink : node.stretch);
				} else if (node.type === 'penalty' && node.penalty === 100 && j === line.nodes.length - 1) {
					tspans.push(
						<tspan key={`${i}-${j}`} x={x} y={y}>-</tspan>
					);
				}
			}

			y += 20.8; // font-size * line-height
		}

		return (
			<text style={{font: font, cursor: 'default'}}>
				{tspans}
			</text>
		);
	}
}
