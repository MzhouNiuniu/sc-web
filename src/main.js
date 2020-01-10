import './lib'

import Vue from 'vue'
import router from './router'
import store from './store'
import  DBth from  '@/components/bth/deleteBth'
import  ABth from  '@/components/bth/auditBth'
import  SBth from  '@/components/bth/showBth'
import  EBth from  '@/components/bth/editBth'
import  STBth from  '@/components/bth/stick'

import '@/directives/vAllow'

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
*/
Vue.component('DBth',DBth)
Vue.component('ABth',ABth)
Vue.component('SBth',SBth)
Vue.component('EBth',EBth)
Vue.component('STBth',STBth)
Vue.prototype.$optionList=[{
        name:'web前端',
        value:0
    },{
        name:'运维',
        value:1,

    }]
Vue.prototype.$optionList1=[{
    name:'单选',
    value:0
},{
    name:'多选',
    value:1,
},{
    name:'判断',
    value:2,
}]
Vue.prototype.$optionList2=[{
    name:'原创',
    value:0
},{
    name:'转载',
    value:1,
}]

Vue.prototype.$roleList=[{
    name:'管理员',
    value:0,
},{
    name:'操作员',
    value:1,
}]

Vue.prototype.$status=['待审核','审核通过','审核未通过']

Vue.prototype.formatDate = (date) => {
    var year = new Date(date).getFullYear()
    var month = new Date(date).getMonth() + 1
    var day = new Date(date).getDate()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    return `${year}-${month}-${day}`
}
Vue.prototype.formatDateTime = (date) => {
    var year = new Date(date).getFullYear()
    var month = new Date(date).getMonth() + 1
    var day = new Date(date).getDate()
    var hour = new Date(date).getHours()
    var minute = new Date(date).getMinutes()
    var seconds = new Date(date).getSeconds()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute
    seconds = seconds < 10 ? '0' + seconds : seconds
    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
}
Vue.prototype.randomWord = (randomFlag, min, max) => {
    var str = '',
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min
    }
    for (var i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
    }
    return str
}
Vue.prototype.randomEng = (randomFlag, min, max) => {
    var str = '',
        range = min,
        arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min
    }
    for (var i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
    }
    return str
}
Vue.component('remote-script', {   //pageOffice用
    render: function (createElement) {
        var self = this
        return createElement('script', {
            attrs: {
                type: 'text/javascript',
                src: this.src,
                id: this.id
            },
            on: {
                load: function (event) {
                    self.$emit('load', event)
                },
                error: function (event) {
                    self.$emit('error', event)
                },
                readystatechange: function (event) {
                    if (this.readyState == 'complete') {
                        self.$emit('load', event)
                    }
                }
            }
        })
    },
    props: {
        src: {
            type: String,
            required: true
        },
        id: {
            type: String
        }
    }
})

/* 常量 */
Vue.prototype.$G_ORARO_COORDINATE = '118.76398,31.9815' // 橙红的坐标。。

import App from './App'

const app = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

export default app
