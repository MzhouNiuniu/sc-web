const RouterView = {
    template: '<router-view/>',
}
const component = {
    // 异常页
    // public
    login: () => import('pages/login/login'),
    home: () => import('pages/home/home'),
    HomeNotAllow: () => import('pages/home/NotAllow'),
    homePage: () => import('pages/home/index'),
    course:() => import('pages/home/course/index'),
    editCourse:() => import('pages/home/course/editCourse'),
    certificate:() => import('pages/home/certificate/index'),
    editCertificate:() => import('pages/home/certificate/editCertificate'),
    questionBank:() => import('pages/home/questionBank/index'),
    editQuestionBank:() => import('pages/home/questionBank/editQuestionBank'),
    knowledge:() => import('pages/home/knowledge/index'),
    editKnowledge:() => import('pages/home/knowledge/editKnowledge'),
    headline:() => import('pages/home/headline/index'),
    editHeadline:() => import('pages/home/headline/editHeadline'),
    user:() => import('pages/home/user/index'),
    editUser:() => import('pages/home/user/editUser'),
}

export default component
