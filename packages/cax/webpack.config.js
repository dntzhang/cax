var path = require('path');
var webpack = require('webpack');
var packageJSON = require('./package.json');
/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;

var config  = {
    entry: './examples/todo/main.js',
    output: {
        // path: __dirname,
        path: './examples/todo/',
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
                        "transform-class-properties",
                        ["transform-react-jsx", {
                          "pragma": "Cax.h" 
                        }]
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
            'cax': './src/index.js'
        },
        output: {
            // path: __dirname,
            path: path.resolve(__dirname,'./dist/'),
            library:'cax',
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
            new webpack.BannerPlugin(" cax v"+packageJSON.version+" By dntzhang \r\n Github: https://github.com/dntzhang/cax\r\n MIT Licensed."),
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
            'cax.min': './src/index.js'
        };
    }
}else if(ENV==='todomvc'){
    config.entry = './' + ENV + '/js/main.js';
    config.output.path = './' + ENV + '/';
}else{
    config.entry = path.resolve(__dirname,'./examples/' + ENV + '/main.js');
    config.output.path = path.resolve(__dirname,'./examples/' + ENV + '/');
}


//console.log(ENV);

module.exports = config;
