var webpack = require('webpack');
var path = require('path');


var libraryTarget = 'umd';
var filename = 'poorbug-commenter.js'
if (process.env.NODE_ENV === 'script') {
    libraryTarget = 'var';
    filename = 'poorbug-commenter-script.js';
}

module.exports = {
    entry: './src/entry',
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        library: 'PoorbugCommenter',
        libraryTarget: libraryTarget,
        filename: filename
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        }]
    }
}