import router, { cleanRoutes } from '@/router'
import api from '@/utils/api'
import http from '@/utils/http'

const FARM_USER_INFO = 'FARM_USER_INFO'

export function checkIsLogin () {
    return localStorage.hasOwnProperty(FARM_USER_INFO)
}

export default {
    namespaced: true,
    state: {
        // 直接存储服务端所有数据，使用时再加一层
        info: (function () {
            /* function getLocaleInfo */
            let info = null
            try {
                info = JSON.parse(localStorage.getItem(FARM_USER_INFO))
            } catch (e) {
                info = {}
            }
            return Object.freeze(info)
        })(),
    },
    mutations: {
        saveUserInfo (state, info) {
            state.info = Object.freeze(info)
            localStorage.setItem(FARM_USER_INFO, JSON.stringify(info))
        },
    },
    actions: {
        async updateUserInfo ({ commit, state }, payload) {
            const res = await http.get(api.person.personInfo, {}, true)
            if (res && res.code === 200) {
                const userInfo = res.data.obj
                userInfo.perms = !userInfo.perms ? {} : userInfo.perms.reduce((acc, item) => (acc[item] = 1, acc), {})

                /* 提取PC端权限 */
                // const userMenus = await http.get(api.system.menu.listByLoginName, { loginName: userInfo.loginName }, true).then(res => {
                //     if (res.code === 200) {
                //         return res.menus
                //     }
                //     return []
                // })
                // userMenus.forEach(item => {
                //     if (item.useRange === 'APP') {
                //         if (userInfo.perms.hasOwnProperty(item.perms)) {
                //             delete userInfo.perms[item.perms]
                //         }
                //     }
                // })

                commit('saveUserInfo', userInfo)
                return state.info
            }

            return Promise.reject(null)
        },
        async logout (store, payload = false) {
            /**
             * @param {boolean} payload - 是否需要记录，默认不记录
             * */

            if (payload) {
                store.dispatch('log', ['退出', '退出'], { root: true })
            }

            // cookie
            window.$cookies.remove('userName')
            window.$removeToken()

            // storage
            localStorage.removeItem(FARM_USER_INFO)
            sessionStorage.removeItem('permissions')
            sessionStorage.removeItem('aside')

            // 清除路由
            cleanRoutes()
            router.replace('/login')
        },
    },
}
