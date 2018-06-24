var path = require('path');
var webpack = require('webpack');
var packageJSON = require('./package.json');
/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;

var config  = {
    entry: '',
    output: {
        // path: __dirname,
        path: '',
        filename: 'bundler.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                query: {
                    presets: 'env',
                    "plugins": [
                        "transform-class-properties"
                      ]
                },
                
            }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoEmitOnErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    // devtool: 'source-map',
};

if(ENV === 'build'||ENV === 'build-min'){
    config = {
        entry: {
            'to': './src/index.js'
        },
        output: {
            // path: __dirname,
            path: path.resolve(__dirname,'./dist/'),
            library:'To',
            libraryTarget: 'umd',
            filename:  '[name].js'
            //umdNamedDefine: true
        },
        module: {
            loaders: [
                {
                    loader: 'babel-loader',
                    test: path.join(__dirname, 'src'),
                    query: {
                        presets: 'env'
                    },
                }
            ]
        },
        plugins: [
            // Avoid publishing files when compilation fails
            new webpack.BannerPlugin(" to-to v"+packageJSON.version+" \r\n By https://github.com/dntzhang \r\n Github: https://github.com/dntzhang/cax\r\n MIT Licensed."),
            new webpack.NoEmitOnErrorsPlugin()
        ],
        stats: {
            // Nice colored output
            colors: true
        },
        // Create Sourcemaps for the bundle
       // devtool: 'source-map',
    };

     if(ENV === 'build-min'){
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8 : false
            },
            mangle: {
                screw_ie8: false
            },
            output: { screw_ie8: false }
        }));
        config.entry = {
            'to.min': './src/index.js'
        };
    }
}else{
    config.entry = path.resolve(__dirname,'./examples/' + ENV + '/main.js');
    config.output.path = path.resolve(__dirname,'./examples/' + ENV + '/');
}


//console.log(ENV);

module.exports = config;
