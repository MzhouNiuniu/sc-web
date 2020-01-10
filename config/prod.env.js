const domain = '//route-farm.ns1010.com'
module.exports = {
    NODE_ENV: '"production"',
    ENV_CONFIG: '"prod"',

    // 无需处理，修改domain即可
    API_ORARO: `"${domain}/farm-manage-service"`,
    AUTH_PERMISSION: `"${domain}/auth-permission"`,
}
