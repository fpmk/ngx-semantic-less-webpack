/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
// const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
});


// const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}), {

        /**
         * Developer tool to enhance debugging
         *
         * See: http://webpack.github.io/docs/configuration.html#devtool
         * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'cheap-module-source-map',

        /**
         * Options affecting the output of the compilation.
         *
         * See: http://webpack.github.io/docs/configuration.html#output
         */
        output: {

            /**
             * The output directory as absolute path (required).
             *
             * See: http://webpack.github.io/docs/configuration.html#output-path
             */
            path: helpers.root('dist'),

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * See: http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[file].map',

            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].chunk.js',

            library: 'ac_[name]',
            libraryTarget: 'var',
        },

        module: {

            rules: [

                /**
                 * Css loader support for *.css files (styles directory only)
                 * Loads external css styles into the DOM, supports HMR
                 *
                 */
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                    include: [helpers.root('src', 'styles')]
                },

                /**
                 * Sass loader support for *.scss files (styles directory only)
                 * Loads external sass styles into the DOM, supports HMR
                 *
                 */
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    include: [helpers.root('src', 'styles')]
                },

            ]

        },

        plugins: [

            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             *
             * NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
             */
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                }
            }),


            new BundleAnalyzerPlugin({
                // Can be `server`, `static` or `disabled`.
                // In `server` mode analyzer will start HTTP server to show bundle report.
                // In `static` mode single HTML file with bundle report will be generated.
                // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
                analyzerMode: 'server',
                // Host that will be used in `server` mode to start HTTP server.
                analyzerHost: '127.0.0.1',
                // Port that will be used in `server` mode to start HTTP server.
                analyzerPort: 8888,
                // Path to bundle report file that will be generated in `static` mode.
                // Relative to bundles output directory.
                reportFilename: 'report.html',
                // Module sizes to show in report by default.
                // Should be one of `stat`, `parsed` or `gzip`.
                // See "Definitions" section for more information.
                defaultSizes: 'parsed',
                // Automatically open report in default browser
                openAnalyzer: true,
                // If `true`, Webpack Stats JSON file will be generated in bundles output directory
                generateStatsFile: false,
                // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
                // Relative to bundles output directory.
                statsFilename: 'stats.json',
                // Options for `stats.toJson()` method.
                // For example you can exclude sources of your modules from stats file with `source: false` option.
                // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
                statsOptions: null,
                // Log level. Can be 'info', 'warn', 'error' or 'silent'.
                logLevel: 'info'
            }),

            // new DllBundlesPlugin({
            //   bundles: {
            //     polyfills: [
            //       'core-js',
            //       {
            //         name: 'zone.js',
            //         path: 'zone.js/dist/zone.js'
            //       },
            //       {
            //         name: 'zone.js',
            //         path: 'zone.js/dist/long-stack-trace-zone.js'
            //       },
            //     ],
            //     vendor: [
            //       '@angular/platform-browser',
            //       '@angular/platform-browser-dynamic',
            //       '@angular/core',
            //       '@angular/common',
            //       '@angular/forms',
            //       '@angular/http',
            //       '@angular/router',
            //       '@angularclass/hmr',
            //       'rxjs',
            //     ]
            //   },
            //   dllDir: helpers.root('dll'),
            //   webpackConfig: webpackMergeDll(commonConfig({env: ENV}), {
            //     devtool: 'cheap-module-source-map',
            //     plugins: []
            //   })
            // }),

            /**
             * Plugin: AddAssetHtmlPlugin
             * Description: Adds the given JS or CSS file to the files
             * Webpack knows about, and put it into the list of assets
             * html-webpack-plugin injects into the generated html.
             *
             * See: https://github.com/SimenB/add-asset-html-webpack-plugin
             */
            // new AddAssetHtmlPlugin([
            //   { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('polyfills')}`) },
            //   { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('vendor')}`) }
            // ]),

            /**
             * Plugin: NamedModulesPlugin (experimental)
             * Description: Uses file names as module name.
             *
             * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
             */
            // new NamedModulesPlugin(),

            /**
             * Plugin LoaderOptionsPlugin (experimental)
             *
             * See: https://gist.github.com/sokra/27b24881210b56bbaff7
             */
            new LoaderOptionsPlugin({
                debug: true,
                options: {}
            }),

        ],

        /**
         * Webpack Development Server configuration
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client,
         * which reacts to those events.
         *
         * See: https://webpack.github.io/docs/webpack-dev-server.html
         */
        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                // if you're using Docker you may need this
                // aggregateTimeout: 300,
                // poll: 1000,
                ignored: /node_modules/
            },
            clientLogLevel: 'error',
            stats: {
                colors: true,
                hash: false,
                version: false,
                timings: false,
                assets: false,
                chunks: false,
                modules: false,
                reasons: false,
                children: false,
                source: false,
                errors: false,
                errorDetails: false,
                warnings: false,
                publicPath: false
            }
            /**
             * Here you can access the Express app object and add your own custom middleware to it.
             *
             * See: https://webpack.github.io/docs/webpack-dev-server.html
             */
            setup: function (app) {
                // For example, to define custom handlers for some paths:
                // app.get('/some/path', function(req, res) {
                //   res.json({ custom: 'response' });
                // });
            }
        },

        /**
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
};
