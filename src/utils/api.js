import baseURL from './baseURL'


export default {
    course:{
        publish:`${baseURL.SC}/course/publish`,
        getList:`${baseURL.SC}/course/getList`,
        deleteById:`${baseURL.SC}/course/deleteById`,
        getDetailsById:`${baseURL.SC}/course/getDetailsById`,
        changeInFo:`${baseURL.SC}/course/changeInFo`,
        changeStatus:`${baseURL.SC}/course/changeStatus`,
        changeStick:`${baseURL.SC}/course/changeStick`,
    },
    certificate:{
        publish:`${baseURL.SC}/certificate/publish`,
        getList:`${baseURL.SC}/certificate/getList`,
        deleteById:`${baseURL.SC}/certificate/deleteById`,
        getDetailsById:`${baseURL.SC}/certificate/getDetailsById`,
        changeInFo:`${baseURL.SC}/certificate/changeInFo`,
        changeStatus:`${baseURL.SC}/certificate/changeStatus`,
        changeStick:`${baseURL.SC}/certificate/changeStick`,
    },
    questionBank:{
        publish:`${baseURL.SC}/questionBank/publish`,
        getList:`${baseURL.SC}/questionBank/getList`,
        deleteById:`${baseURL.SC}/questionBank/deleteById`,
        getDetailsById:`${baseURL.SC}/questionBank/getDetailsById`,
        changeInFo:`${baseURL.SC}/questionBank/changeInFo`,
        changeStatus:`${baseURL.SC}/questionBank/changeStatus`,
        changeStick:`${baseURL.SC}/questionBank/changeStick`,
    },
    knowledge:{
        publish:`${baseURL.SC}/knowledge/publish`,
        getList:`${baseURL.SC}/knowledge/getList`,
        deleteById:`${baseURL.SC}/knowledge/deleteById`,
        getDetailsById:`${baseURL.SC}/knowledge/getDetailsById`,
        changeInFo:`${baseURL.SC}/knowledge/changeInFo`,
        changeStatus:`${baseURL.SC}/knowledge/changeStatus`,
        changeStick:`${baseURL.SC}/knowledge/changeStick`,
    },
    headline:{
        publish:`${baseURL.SC}/headline/publish`,
        getList:`${baseURL.SC}/headline/getList`,
        deleteById:`${baseURL.SC}/headline/deleteById`,
        getDetailsById:`${baseURL.SC}/headline/getDetailsById`,
        changeInFo:`${baseURL.SC}/headline/changeInFo`,
        changeStatus:`${baseURL.SC}/headline/changeStatus`,
        changeStick:`${baseURL.SC}/headline/changeStick`,
    },
    user:{
        publish:`${baseURL.SC}/administrator/publish`,
        getList:`${baseURL.SC}/administrator/getList`,
        deleteById:`${baseURL.SC}/administrator/deleteById`,
        getDetailsById:`${baseURL.SC}/administrator/getDetailsById`,
        changeInFo:`${baseURL.SC}/administrator/changeInFo`,
        changeStatus:`${baseURL.SC}/administrator/changeStatus`,
        changeStick:`${baseURL.SC}/administrator/changeStick`,
        login:`${baseURL.SC}/administrator/checkInfo`,
    },
    fileServer: {
        uploadwang: `${baseURL.fileServer}/oss/uploadwang`,//富文本图片上传
        uploadFile: `${baseURL.fileServer}/oss/upload`,//图片上传
        downloadFile: `${baseURL.fileServer}/downloadFile`,//富文本图片上传
    },
}
//  简单封装  基本思想 请求配置 和 路径分开 方便后期 上线改动，  home 为单页名字，内为本页方法
