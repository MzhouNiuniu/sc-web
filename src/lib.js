// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// lib s
import $ from 'jquery'
import _ from 'lodash'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCropper from 'vue-cropper'
import VueCookies from 'vue-cookies'

Vue.use(_)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(VueCropper)
Vue.use(VueCookies)
Vue.config.productionTip = false

import api from './utils/api'
import http from './utils/http'
import { isAuth, debounce } from '@/utils'
import packageJson from '../package.json'

Vue.prototype.debounce = debounce
Vue.prototype.api = api
Vue.prototype.http = http
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.packageJson = packageJson //package配置文件

Vue.prototype.$alertTable = function (columns = [], data = [], msgBoxOptions) {
    const h = this.$createElement

    msgBoxOptions = Object.assign({
        center: true,
        title: '操作提示',
    }, msgBoxOptions)

    msgBoxOptions.message = (
        <el-table
            data={data}
            max-height="300"
        >
            {
                columns.map(column => (
                    // {...column} vue版本太低，不支持（所以el-table也不做扩展了）
                    <el-table-column
                        headerAlign="center"
                        align="center"
                        showOverflowTooltip={true}

                        width={column.width}
                        label={column.label}
                        prop={column.prop}
                    />
                ))
            }
        </el-table>
    )

    this.$msgbox(msgBoxOptions)
}

// const $message = Vue.prototype.$message;
// Vue.prototype.$message = (option) => {
//     if(!option.duration) {
//         option.duration = 5000;
//     }
//     $message(option);
// }

/* cookie版本 */
// window.$getToken = function () {
//     return window.$cookies.get('token_back')
// }
// window.$setToken = function (token) {
//     window.$cookies.set('token_back', token, 30 * 24 * 60 * 60)
// }
// window.$removeToken = function () {
//     window.$cookies.remove('token_back')
// }

/* storage版本 */
window.$getToken = function () {
    return localStorage.getItem('TOKEN')
}
window.$setToken = function (token) {
    localStorage.setItem('TOKEN', token)
}
window.$removeToken = function () {
    localStorage.removeItem('TOKEN')
}

