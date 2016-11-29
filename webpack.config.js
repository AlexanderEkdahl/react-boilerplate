var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');

var TARGET = process.env.npm_lifecycle_event;

var configuration = {
    entry: "./src/index.tsx",
    output: {
        path: 'dist',
        filename: 'bundle-[hash].js',
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            cache: true,
            template: 'index.html',
        }),
    ],
};

if (TARGET === 'dist') {
    configuration.plugins.push(
        new Clean(['dist'])
    );
    configuration.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    );
    configuration.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}


module.exports = configuration;
