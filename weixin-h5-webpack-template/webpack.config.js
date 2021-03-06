// webpack.config.js

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/assets/js/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/js/[name]-[chunkhash].bundle.js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/images/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|mp3)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/mp3/[name].[ext]'
                        }
                    }
                ]
            },
			{
                test: /\.html$/,
                use: [
                    {
                        // 解决html中直接使用img标签src加载图片不打包的问题 
                        // <%= htmlWebpackPlugin.options.title %> 无法使用
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src'],
                            minimize: true,
                            removeComments: true,       // 去除注释
                            collapseWhitespace: true    // 去除空格
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist'),
        new HtmlWebpackPlugin({
            title: '微信H5开发Webpack4.x打包模板',
            filename: 'index.html',
            template: 'src/index.html',
            inject: 'body',     // true | false | 'head' | 'body'
            //favicon: 'favicon.ico',
            /* minify: {
                removeComments: true,       // 去除注释
                collapseWhitespace: true    // 去除空格
            } */
        })
    ]
}