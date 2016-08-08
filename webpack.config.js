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

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" },
			{ test: require.resolve('react'), loader: 'expose?React' }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Lines',
            cache: true,
            template: 'index.ejs',
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
