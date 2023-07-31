const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const USE_LINTER = false; // Uses the .eslintrc.json file if set to true

console.log("[" + String(new Date().getHours()).padStart(2, '0') + 
                ":" + String(new Date().getMinutes()).padStart(2, '0') + 
                ":" + String(new Date().getSeconds()).padStart(2, '0') + "] " + 
                "Creating files for dist folder...\n");

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
            emitError: USE_LINTER,
            emitWarning: USE_LINTER,
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
            umdNamedDefine: false,
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
            umdNamedDefine: false,
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
                                            stage: 2,
                                            // Feature list: https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
                                            features: { 
                                                "cascade-layers": false,
                                                "text-decoration-shorthand": false,
                                                "unset-value": false
                                            },
                                        }
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
                            autoprefixer: false,
                            cssDeclarationSorter: false,
                            calc: false,
                            colormin: false,
                            convertValues: false,
                            discardComments: true, // Remove comments from CSS files
                            discardDuplicates: false,
                            discardEmpty: false,
                            discardOverridden: false,
                            discardUnused: false,
                            mergeIdents: false,
                            mergeLonghand: false,
                            mergeRules: false,
                            minifyFontValues: false,
                            minifyGradients: false,
                            minifyParams: false,
                            minifySelectors: false,
                            normalizeCharset: false,
                            normalizeDisplayValues: false,
                            normalizePositions: false,
                            normalizeRepeatStyle: false,
                            normalizeString: false,
                            normalizeTimingFunctions: false,
                            normalizeUnicode: false,
                            normalizeUrl: false,
                            normalizeWhitespace: false,
                            orderedValues: false,
                            reduceIdents: false,
                            reduceInitial: false,
                            reduceTransforms: false,
                            svgo: false,
                            uniqueSelectors: false,
                            zindex: false
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
                                            stage: 2,
                                            // Feature list: https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
                                            features: { 
                                                "cascade-layers": false,
                                                "text-decoration-shorthand": false,
                                                "unset-value": false
                                            },
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