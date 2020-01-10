import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import api from '@/utils/api'
import http from '@/utils/http'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        id: 0,
        name: '',
    },
    mutations: {
        updateId (state, id) {
            state.id = id
        },
        updateName (state, name) {
            state.name = name
        },
    },
    actions: {
        log (store, payload) {
            if (!Array.isArray(payload) || payload.length < 2) {
                return
            }
            /**
             * payload
             *
             * this.$store.dispatch('log', ['角色权限', '保存'])
             *                              operateObj   operateType
             * */
            http.postJson(api.system.savelog, {
                module: 'PC',
                operateObj: payload[0],
                operateType: payload[1],
            })
            console.info(`操作日志：${new Date().toLocaleString()}，模块 - ${payload[0]},行为 - ${payload[1]}`)
        }
    },
    modules: {
        common,
        user
    },
    strict: process.env.NODE_ENV !== 'production'
})
