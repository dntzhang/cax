var path = require('path');
var webpack = require('webpack');
var packageJSON = require('./package.json');
/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;

var config  = {
    entry: './example/todo/main.js',
    output: {
        // path: __dirname,
        path: './example/todo/',
        filename: 'bundler.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                query: {
                    presets: 'es2015'
                }
            }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    // devtool: 'source-map',
};

if(ENV === 'build'||ENV === 'build_min'){
    config = {
        entry: {
            'alloy-render': './src/index.js'
        },
        output: {
            // path: __dirname,
            path: 'dist/',
            library:'AlloyRender',
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
                        presets: 'es2015',
                        plugins : [
                            "transform-es3-property-literals",
                            "transform-es3-member-expression-literals"
                        ]
                    },
                }
            ]
        },
        plugins: [
            // Avoid publishing files when compilation fails
            new webpack.BannerPlugin(" AlloyRender v"+packageJSON.version+" By dntzhang \r\n Github: https://github.com/AlloyTeam/AlloyRender\r\n MIT Licensed."),
            new webpack.NoErrorsPlugin()
        ],
        stats: {
            // Nice colored output
            colors: true
        },
        // Create Sourcemaps for the bundle
       // devtool: 'source-map',
    };

     if(ENV === 'build_min'){
        config.plugins.push(new webpack.optimize.UglifyJsPlugin());
        config.entry = {
            'alloy-render.min': './src/index.js'
        };
    }
}else if(ENV === 'website') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.entry ={
        bundler: './website/js/docs_main.js',
        bundler_en: './website/js/docs_main_en.js'
    }
    config.output.path = './website/dist/';
    config.output.filename =  '[name].js';
    config.module.loaders.push(  { test: /\.md$/, loader: "md-text" });
}else{
    config.entry = './example/' + ENV + '/main.js';
    config.output.path = './example/' + ENV + '/';
}


//console.log(ENV);

module.exports = config;
