var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProvidePlugin = webpack.ProvidePlugin;

var argv = require('optimist').argv;

var modules_dir = path.join(__dirname, "/node_modules");
var src_dir = path.join(__dirname, "/src");

var config = {
	context: __dirname,
	entry: {
		app: envDep(
			[
				'webpack-dev-server/client?http://0.0.0.0:8080',
				'webpack/hot/dev-server',
				src_dir + '/App.tsx'
			],
			src_dir + '/App.tsx'
		)
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'App.js?[hash]'
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
				test: /\.js$/,
				loaders: envDep(
					['react-hot', 'babel-loader'],
					['babel-loader']
				),
				include: src_dir
			}, {
				test: /\.(tsx|ts)$/,
				loaders: envDep(
					['react-hot', 'babel-loader', 'ts-loader'],
					['babel-loader', 'ts-loader']
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
		    title: "React TypeScript demo"
		}),
		new ExtractTextPlugin("[name].css?[hash]"),
		new ProvidePlugin({
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
	return !!argv.d;
}
