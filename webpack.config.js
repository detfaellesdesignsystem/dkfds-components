const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

/* 
About the config:

dependencies: ['copyFilesAndCreateJavaScript'], --> copyFilesAndCreateJavaScript cleans the dist directory so all other configs need to run after this
stats: 'minimal' --> only output when errors or new compilation happen, more details: https://webpack.js.org/configuration/stats/
*/

const copyFilesAndCreateJavaScript = {
    name: 'copyFilesAndCreateJavaScript',
    mode: 'production',
    optimization: {
        minimize: false
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/fonts", to: "fonts" },
                { from: "src/img", to: "img" },
                { from: "src/stylesheets", to: "scss" },
                { from: path.resolve(__dirname, 'README.md'), to: path.resolve(__dirname, 'dist') },
                { from: path.resolve(__dirname, 'LICENSE.md'), to: path.resolve(__dirname, 'dist') },
            ],
        }),
        new ESLintPlugin({
            failOnError: false,
            failOnWarning: false,
            fix: false
        }),
    ],
    entry: {
        "dkfds": './src/js/dkfds.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Clean the entire dist directory before emit.
        filename: 'js/[name].js',
        library: {
            name: 'DKFDS',
            type: 'umd',
            umdNamedDefine: true,
        },
    },
    stats: 'minimal',
};

const createMinifiedJavaScript = {
    name: 'createMinifiedJavaScript',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    devtool: "source-map",
    entry: {
        "dkfds": './src/js/dkfds.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].min.js',
        library: {
            name: 'DKFDS',
            type: 'umd',
            umdNamedDefine: true,
        },
    },
    stats: 'minimal',
};

const createCSS = {
    name: 'createCSS',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    entry: {
        "dkfds-borgerdk": './src/stylesheets/dkfds-borgerdk.scss',
        "dkfds-virkdk": './src/stylesheets/dkfds-virkdk.scss',
        "dkfds": './src/stylesheets/dkfds.scss',
    },
    plugins: [
        /* There's a bug in webpack/loaders where empty js files are created for each stylesheet - remove those js files */
        new RemoveEmptyScriptsPlugin(),
        /* Create stylesheets */
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2, // Import postcss-loader and sass-loader
                            url: false        // Prevent parsing of urls
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            browsers: '> 1% and last 2 versions and not dead' // https://github.com/browserslist/browserslist#queries
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                outputStyle: "expanded",
                            },
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        /* File is not minified - this step just remove comments. List of options: https://cssnano.co/docs/what-are-optimisations/ */
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            cssDeclarationSorter: false,
                            convertValues: false,
                            discardComments: true,
                            normalizeWhitespace: false,
                            minifySelectors: false,
                            minifyParams: false,
                            mergeRules: false,
                            minifyFontValues: false,
                            mergeLonghand: false,
                            calc: false,
                            colormin: false,
                            discardDuplicates: false,
                            discardEmpty: false,
                            orderedValues: false,
                            reduceInitial: false,
                            uniqueSelectors: false,
                            normalizePositions: false,
                            normalizeUrl: false
                        },
                    ],
                },
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    stats: 'minimal',
};

const createMinifiedCSS = {
    name: 'createMinifiedCSS',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    devtool: "source-map",
    entry: {
        "dkfds-borgerdk": './src/stylesheets/dkfds-borgerdk.scss',
        "dkfds-virkdk": './src/stylesheets/dkfds-virkdk.scss',
        "dkfds": './src/stylesheets/dkfds.scss',
    },
    plugins: [
        /* There's a bug in webpack/loaders where empty js files are created for each stylesheet - remove those js files */
        new RemoveEmptyScriptsPlugin(),
        /* Create minified stylesheets */
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2, // Import postcss-loader and sass-loader
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            browsers: '> 1% and last 2 versions and not dead' // https://github.com/browserslist/browserslist#queries
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    stats: 'minimal',
};

module.exports = [copyFilesAndCreateJavaScript, createMinifiedJavaScript, createCSS, createMinifiedCSS];