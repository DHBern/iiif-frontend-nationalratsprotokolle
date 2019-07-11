const TerserPlugin = require('terser-webpack-plugin');

module.exports = function override(config) {
    config.output.library = 'ArchivalIIIFViewer';
    if (process.env.NODE_ENV === 'production') {
        config.output.filename = 'archivalIIIFViewer.min.js';
    }
    config.output.libraryExport = 'default';
    config.output.libraryTarget = 'umd';
    config.optimization = {
        minimizer: [
            new TerserPlugin({
                extractComments: true,
            }),
        ],
    };

    return config;
};
