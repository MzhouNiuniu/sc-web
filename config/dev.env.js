'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const domain = '//localhost:8090'

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',

    // 无需处理，修改domain即可
    SC: `"${domain}"`,
})
