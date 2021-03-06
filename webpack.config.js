var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var argv = require('optimist').argv;

var modules_dir = path.join(__dirname, "/node_modules");
var src_dir = path.join(__dirname, "/src");

var config = {
	// Fast options are: "cheap-module-eval-source-map" "cheap-module-source-map"
	devtool: "cheap-module-eval-source-map",
	context: __dirname,
	entry: {
		app: src_dir + "/App.tsx",
		dropboxAuth: src_dir + "/DropboxAuthPage.tsx",
		vendor: [
			"react", "redux", "react-redux", "rest", "when", "core-js", "jquery", "lodash", "moment",
			"moment-duration-format", "bootstrap", "bootstrap-datepicker", "react-bootstrap", "react-select", "store"
		]
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js?[hash]'
	},
	resolve: {
		extensions: ['', '.ts', '.tsx', '.js']
	},
	module: {
		preLoaders: [
			{
				test:  /\.(tsx|ts)/,
				loader: "tslint"
			}
		],
		loaders: [
			{
				test: /\.(tsx|ts)$/,
				loaders: envDep(
					["react-hot", "ts-loader"],
					["ts-loader"]
				),
				include: src_dir
			}, {
				test: /\.json$/,
				loader: "json-loader"
			},{
				test: /\.less$/,
				loader: envDep(
					"style-loader!css-loader!less-loader",
					ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
				)
			}, {
				test: /\.css/,
				loader: "style-loader!css-loader"
			}, {
				test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
				exclude: /public/,
				loader: 'url-loader?limit=5000&name=[path][name].[ext]?[hash]'
			}, {
				test: /\.xml/,
				loader: "raw-loader"
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
		    title: "React TypeScript demo",
			chunks: [ "app", "vendor" ]
		}),
		new HtmlWebpackPlugin({
			title: "Dropbox Auth",
			chunks: [ "dropboxAuth", "vendor" ],
			filename: "dropbox-auth.html"
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: [ "vendor" ],
			filename: "[name].js[hash]"
		}),
		new webpack.SourceMapDevToolPlugin({
			test: /\.js/,
			exclude: [
				/vendor\.js/
			],
			filename: '[file].map[hash]',
			columns: false
		}),
		new ExtractTextPlugin("[name].css?[hash]"),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
};

module.exports = config;

/**
 * If running development mode, return the 'dev' argument, else return the 'prod' argument.
 */
function envDep(dev, prod) {
	return isDev() ? dev : prod;
}

function isDev() {
	return !!argv.dev;
}
