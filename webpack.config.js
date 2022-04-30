const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
    console.log('@@@', env, argv);
    const config = {
        entry: './src/index.js',
        devtool: (argv.mode === 'development') ? 'cheap-module-source-map' : undefined, //'nosources-source-map', // 'source-map',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'bundle.js',
        },
        experiments: {
            outputModule: true,
        },
        plugins: [
            //empty pluggins array
            new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
        ],
        module: {
            // https://webpack.js.org/loaders/babel-loader/#root
            rules: [
                {
                    test: /.m?js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                }
            ],
        },
        resolve: {
            fallback: {
                "fs": false,
                "path": false,
                "os": false,
                assert: require.resolve('assert'),
                path: require.resolve('path-browserify'),
                util: require.resolve('util'),
            },
        },
    };

    console.log('@@@', config);
    return config;
}
