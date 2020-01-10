import fileDownload from 'js-file-download'

let params = {
    "token" : "123456",
    "id" : "12345678901234567",
    "filename":"123.rar",
    "pckid":"5",
    "dty":"tbox",
    "cml":"300",
    "version":"102",
};
let that = this;
API.test2(params).then(function (result) {
    if (result) {
        // console.log(result);
        /*console.log(result.headers['Content-Disposition']);
        let filename = result.headers['Content-Disposition'].substring(result.headers['Content-Disposition'].indexOf("=")+1 );
        console.log("filename",filename);*/
        fileDownload(result,"123.rar");
        /*let blob = new Blob([result], {type: "application/octet-stream"});
　　　　　　 let objectUrl = URL.createObjectURL(blob);
　　　　　　 window.location.href = objectUrl;*/
    }
}).catch(function (error) {
    that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
});

test2:params => {
    return API.POST2(`apitbox/download`,params,{responseType: 'blob'})//{responseType: 'blob'}一定要加，否则文件出错
}

export const POST2 = (url, params,config) => {
    return axios.post(`${base}${url}`, params,config).then(res => res.data).catch(function (error) {
        alert("请求出现异常");
        console.log(error);
        // window.location.reload();
    });
}


