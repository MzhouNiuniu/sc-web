import Vue from 'vue'
import Router from 'vue-router'
import component from './component'
// import { checkIsLogin } from '@/store/modules/user'
// import { hasPerms } from '@/directives/vAllow'

Vue.use(Router)

let routers = new Router({
    routes: [
        {
            path:'/',redirect:'/home/course'
        },
        {
            path: '/login',
            name: 'login',
            component: component.login
        },
        {
            path: '/home',
            name: 'home',
            component: component.home,
            children:[
                { path: '/home/index', component: component.homePage},
                { path: '/home/certificate', component: component.certificate},
                { path: '/home/editCertificate', component: component.editCertificate},
                { path: '/home/course', component: component.course},
                { path: '/home/editCourse', component: component.editCourse},
                { path: '/home/questionBank', component: component.questionBank},
                { path: '/home/editQuestionBank', component: component.editQuestionBank},
                { path: '/home/knowledge', component: component.knowledge},
                { path: '/home/editKnowledge', component: component.editKnowledge},
                { path: '/home/headline', component: component.headline},
                { path: '/home/editHeadline', component: component.editHeadline},
                { path: '/home/user', component: component.user},
                { path: '/home/editUser', component: component.editUser},
            ]
        },
    ]
})
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
routers.beforeEach((to, from, next) => {
    if (getCookie('userInfo')) {//如果没有token信息则调到登录页
        next()

} else {
    if (to.path === '/login') {
        next()
        return false
    } else {
        next('/login')
        return false
    }
}
})

export default routers
