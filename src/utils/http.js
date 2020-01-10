'use strict'
//axios 二次封装  其目的 方便 后期改动 添加拦截器  使用promise  解决异步不同步问题
import axios from 'axios'
import Vue from 'vue'
import router from '../router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import merge from 'lodash/merge'
import qs from 'qs'
import store from '../store'

const TIME_OUT = 1800000
let loading = {}
Vue.use(ElementUI)
let load = new Vue()
{
    axios.interceptors.request.use(config => {
        /**
         * 后端使用的是 Authorization: Bearer鉴权，不需要传递token
         * 同时修复请求头过长
         * */
        // config.headers['token'] = window.$getToken() // 请求头带上token
        return config
    }, error => {
        return Promise.reject(error)
    })
}
{
    let debounceTimer = null
    axios.interceptors.response.use(response => {
        return response
    }, error => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            load.$message({
                type: 'error',
                message: '网络阻塞，请查看网络后再试！'
            })
        }, 500)
        return Promise.resolve(error.response)
    })
}

function checkStatus (response) {

    // 如果http状态码正常，则直接返回数 据
    if (response && (response.status === 401 || response.data.code === 201 || response.data.code === 410)) { // 201, token失效（根据最新后端的代码）
        // 防止后续的接口重新进行alert弹出。
        // if (store.state.common.isReLogin) {
        //     return
        // }
        // store.commit('common/SET_IS_RELOGIN', true)
        const code = response.data && response.data.code
        const errorMessage = {
            410: response.data.message,
            210: '令牌失效'
        }
        // ElementUI.MessageBox.alert((code && errorMessage[code]) || '令牌失效', '请重新登录！', {
        //     confirmButtonText: '确定',
        //     callback: action => {
        //         window.$removeToken() // 清除token之后，搭配路由拦截器自动跳转登录
        //         location.reload() // 刷新页面, 清除内存数据
        //
        //         // store.dispatch('user/logout') // 退出系统，但是不会清除内存数据
        //     },
        //     showClose: false
        // })
    } else if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response.data
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: '网络异常'
    }
}

function getHead (url) {
    const arr = ['login'] //不需要header 的接口
    if (url.indexOf(...arr) == -1 && window.$getToken()) {
        const val = window.$getToken()
        let header = {
            'Authorization': 'Bearer ' + val
        }
        return header
    }
    return {}
}

function checkCode (res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        return
        // alert(res.msg)
    }
    if (res && res.code !== 200 && !res.message) {
        res.message = '系统错误'
        return res
    }
    return res
}

function getLoading (flag) {
    if (!flag) {
        const loading = load.$loading({
            lock: true,
            text: '网络请求中，请勿操作。。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        return loading
    } else {
        return {
            close () {
                console.log('不需要loading')
            }
        }
    }
}

export default {
    default: axios,
    exportRate (downUrl, data) {
        return axios({
            url: downUrl,
            method: 'get',
            headers: Object.assign(getHead(downUrl), { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }),
            params: data,
            responseType: 'blob'  //二进制流
        })
    },
    post (url, data, flag) {
        const loading = getLoading(flag)
        return axios({
            method: 'post',
            url,
            data: qs.stringify(data),
            timeout: TIME_OUT,
        }).then(
            (response) => {
                loading.close()
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        ).catch(() => {
            loading.close()
        })
    },
    get (url, params, flag) {
        const loading = getLoading(flag)
        return axios({
            method: 'get',
            url,
            params: params, // get 请求时带的参数
            timeout: TIME_OUT,
            headers:  { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).then(
            (response) => {
                loading.close()
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        ).catch(() => {
            loading.close()
        })
    }
}
