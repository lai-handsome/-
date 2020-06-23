'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // VUE_APP_BASE_API: 'http://192.168.14.71:8081'
    // VUE_APP_BASE_API: 'http://192.168.14.81:8081'
    VUE_APP_BASE_API: 'http://192.168.14.83:8080'
})
