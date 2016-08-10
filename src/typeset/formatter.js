var linebreak = require('./linebreak.js');

/*!
 * Knuth and Plass line breaking algorithm in JavaScript
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2010, Bram Stein
 * All rights reserved.
 */
module.exports = function(measureText, hyphenate, options) {
    var spaceWidth = measureText(' '),
        o = {
            space: {
                width: options && options.space.width || 3,
                stretch: options && options.space.stretch || 6,
                shrink: options && options.space.shrink || 9,
            },
			// https://en.wikipedia.org/wiki/Optical_margin_alignment
			hangingPunctuation: options && options.hangingPunctuation || true,
        },
        hyphenWidth = o.hangingPunctuation ? measureText('-') * 0.25 : measureText('-'),
        hyphenPenalty = 100;

    return {
        center: function (text) {
            var nodes = [],
            words = text.split(/\s/),
            spaceStretch = (spaceWidth * o.space.width) / o.space.stretch,
            spaceShrink = (spaceWidth * o.space.width) / o.space.shrink;

            // Although not specified in the Knuth and Plass whitepaper, this box is necessary
            // to keep the glue from disappearing.
            nodes.push(linebreak.box(0, ''));
            nodes.push(linebreak.glue(0, 12, 0));

            words.forEach(function (word, index, array) {
                var hyphenated = hyphenate(word);
                if (hyphenated.length > 1 && word.length > 4) {
                    hyphenated.forEach(function (part, partIndex, partArray) {
                        nodes.push(linebreak.box(measureText(part), part));
                        if (partIndex !== partArray.length - 1) {
                            nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
                        }
                    });
                } else {
                    nodes.push(linebreak.box(measureText(word), word));
                }

                if (index === array.length - 1) {
                    nodes.push(linebreak.glue(0, 12, 0));
                    nodes.push(linebreak.penalty(0, -linebreak.infinity, 0));
                } else {
                    nodes.push(linebreak.glue(0, 12, 0));
                    nodes.push(linebreak.penalty(0, 0, 0));
                    nodes.push(linebreak.glue(spaceWidth, -24, 0));
                    nodes.push(linebreak.box(0, ''));
                    nodes.push(linebreak.penalty(0, linebreak.infinity, 0));
                    nodes.push(linebreak.glue(0, 12, 0));
                }
            });
            return nodes;
        },
        justify: function (text) {
            var nodes = [],
            words = text.split(/\s/),
            spaceStretch = (spaceWidth * o.space.width) / o.space.stretch,
            spaceShrink = (spaceWidth * o.space.width) / o.space.shrink;

            words.forEach(function (word, index, array) {
				var symbol;
				if (word.match(/["“”'‘’,.]$/)) {
					symbol = word[word.length - 1];
					word = word.slice(0, word.length - 1);
				}

                hyphenate(word).forEach(function (part, partIndex, partArray) {
                    nodes.push(linebreak.box(measureText(part), part));
                    if (partIndex !== partArray.length - 1) {
                        nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
                    }
                });

				if (symbol) {
					nodes.push(linebreak.box(measureText(word), word));
					nodes.push(linebreak.box(0, symbol));
					nodes.push(linebreak.glue(measureText(symbol), 1, 0));
				}
				// if (word.match(/["“”'‘’,\.]$/)) {
				// 	var symbol = word[word.length - 1]
				// 	word = word.slice(0, word.length - 1);
				// 	console.log(word);
				// 	nodes.push(linebreak.box(measureText(word), word));
				// 	nodes.push(linebreak.box(0, symbol));
				// 	nodes.push(linebreak.glue(measureText(symbol), 1, 0));
				// } else {
				// 	nodes.push(linebreak.box(measureText(word), word));
				// }

                if (index === array.length - 1) {
                    nodes.push(linebreak.glue(0, linebreak.infinity, 0));
                    nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
                } else {
                    nodes.push(linebreak.glue(spaceWidth, spaceStretch, spaceShrink));
                }
            });
            return nodes;
        },
        left: function (text) {
            var nodes = [],
            words = text.split(/\s/),
            spaceStretch = (spaceWidth * o.space.width) / o.space.stretch,
            spaceShrink = (spaceWidth * o.space.width) / o.space.shrink;

            words.forEach(function (word, index, array) {
                var hyphenated = hyphenate(word);
                if (hyphenated.length > 1 && word.length > 4) {
                    hyphenated.forEach(function (part, partIndex, partArray) {
                        nodes.push(linebreak.box(measureText(part), part));
                        if (partIndex !== partArray.length - 1) {
                            nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
                        }
                    });
                } else {
                    nodes.push(linebreak.box(measureText(word), word));
                }

                if (index === array.length - 1) {
                    nodes.push(linebreak.glue(0, linebreak.infinity, 0));
                    nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
                } else {
                    nodes.push(linebreak.glue(0, 12, 0));
                    nodes.push(linebreak.penalty(0, 0, 0));
                    nodes.push(linebreak.glue(spaceWidth, -12, 0));
                }
            });
            return nodes;
        }
    };
};
