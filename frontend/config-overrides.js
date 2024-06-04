const path = require('path')

module.exports = function override(config) {
    config.resolve.alias = {
        '@@components': path.resolve(__dirname, './src/components'),
        '@@store': path.resolve(__dirname, './src/store'),
        '@@configs': path.resolve(__dirname, './src/configs'),
        '@@utils': path.resolve(__dirname, './src/utils'),
        '@@api': path.resolve(__dirname, './src/api'),
        '@@context': path.resolve(__dirname, './src/context'),
        '@@views': path.resolve(__dirname, './src/views'),
        '@@images': path.resolve(__dirname, './src/assets/images'),
        '@@styles': path.resolve(__dirname, './src/assets/styles'),
        '@@lang': path.resolve(__dirname, './src/lang/useTranslate'),
        '@@socket': path.resolve(__dirname, './src/socket/useSocket')
    }
    
    return config
}