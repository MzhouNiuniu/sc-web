'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const domain = 'https://112.124.4.177'

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',

    // 无需处理，修改domain即可
    SC: `"${domain}"`,
})
