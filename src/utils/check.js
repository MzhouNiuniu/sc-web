
    const checkSubsidy = (rule, value, callback) => {
        const reg = /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/;
        if (reg.test(value) && value.toString().length < 13 || value.toString().length == 0) {
            callback();
        }
        else {
            callback(new Error('长度最长12，支持2位小数'));
        }
    };
    const check100 = (rule, value, callback) => {
        const reg = /^(?:1|[1-9][0-9]?|99)$/;
        if (reg.test(value)) {
            callback();
        }
        else {
            callback(new Error('请输入1-99的正整数'));
        }
    };
    const check9 = (rule, value, callback) => {
        //验证9位支持2位小数
        const reg = /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/;
        if (reg.test(value) && value.toString().length < 10 || value.toString().length == 0) {
            callback();
        }
        else {
            callback(new Error('长度最长9，支持2位小数'));
        }
    };
    var checkSZH = (rule, value, callback) => {
        //验证数字字母汉字
        const reg=/^[\u4e00-\u9fa5_a-zA-Z0-9]{2,}$/;
        if (reg.test(value)||value.length==0) {
            callback();
        }
        else {
            callback(new Error('请输入汉字字母数字且最少两个字符'));
        }
    };
    var checkName = (rule, value, callback) => {
        //验证数字字母汉字
        const reg = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
        if (reg.test(value)) {
            callback();
        }
        else {
            callback(new Error('请输入汉字或字母'));
        }
    };
    var checkPhone = (rule, value, callback) => {
        //验证手机号
        const reg = /^1\d{10}$/;
        if (reg.test(value)) {
            callback();
        }
        else {
            callback(new Error('请输入合法的手机号'));
        }
    }
    var checkArea = (rule, value, callback) => {
        //验证小于1000000亩  最多保留2位小数
        const reg = /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/;
        if (reg.test(value) && value < 1000000) {
            callback();
        }
        else {
            callback(new Error('请输入小于1000000亩  最多保留2位小数'));
        }

    }
    var checkMoney = (rule, value, callback) => {
        //验证小于1000000亩  最多保留2位小数
        const reg = /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/;
        if (reg.test(value) && value.toString().length < 10) {
            callback();
        }
        else {
            callback(new Error('长度最长10，支持2位小数'));
        }

    }
    var checkLandMoney = (rule, value, callback) => {
        //验证小于1000000亩  最多保留2位小数
        const reg = /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/;
        if (reg.test(value) && value.toString().length < 11 || value=='') {
            callback();
        }
        else {
            callback(new Error('长度最长10，支持2位小数'));
        }
    }
    var checkSubsidy70 = (rule, value, callback) => {
        //验证正整数 && value <= 70
        const reg = /^[1-9]\d*$/;
        if (reg.test(value) && value <= 70) {
            callback();
        }
        else {
            callback(new Error('请输入正整数,最多70'));
        }
    };
    var checkPosNmuberSize7 = (rule, value, callback) => {
        //验证正整数
        const reg = /^[1-9]\d*$/;
        if (reg.test(value) && value.toString().length <= 7 || value == '') {
            callback();
        }
        else {
            callback(new Error('请输入正整数,最多7位'));
        }
    };
    var checkSZH20 = (rule, value, callback) => {
        console.log(value)
        //验证数字字母汉字
        const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{0,20}$/;
        if (reg.test(value)) {
            callback();
        }
        else {
            callback(new Error('请输入20位以内汉字字母数字'));
        }
    };
    //身份证
    var checkIdCard = (rule, value, callback) => {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(value))
        {
            console.log("合法")
            callback();
        }else {
            console.log("不合法")

            callback(new Error('身份证不合法'));
        }
    };
    var noCheckIdCard = (rule, value, callback) => {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        console.log(value)
        if(reg.test(value) || value == null || value == "")
        {
            callback();
        }else {
            callback(new Error('身份证不合法'));
        }
    };
    //正整数
    var checkNum = (rule, value, callback) => {
        const reg = /^([1-9]\d*|[0]{1,1})$/;
        console.log(value)
        if(reg.test(value))
        {
            callback();
        }else {
            callback(new Error('请输入正整数'));
        }
    };
    //不是必填项的正整数
    var noCheckNum = (rule, value, callback) => {
        const reg = /^([1-9]\d*|[0]{1,1})$/;
        if(reg.test(value) || value == null || value == "")
        {
            console.log("1")
            callback();
        }else {
            console.log("2")

            callback(new Error('请输入大于0的整数'));
        }
    };

    //大于0的正整数
    var checkNum0 = (rule, value, callback) => {
        const reg = /^\+?[1-9]\d*$/;
        if(reg.test(value))
        {
            callback();
        }else {

            callback(new Error('请输入大于0的整数'));
        }
    };
    //邮箱
    var checkEmail = (rule, value, callback) => {
        const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if(reg.test(value))
        {
            callback();
        }else {

            callback(new Error('请输入正确的邮箱'));
        }
    };


    //详情
    var checkDetail = (rule, value, callback) => {


        if(value.replace(/<[^>]+>/g,"").length == 0){

            if(value.length > 20 && value.length <= 2000){

                callback();
            }else{

                callback(new Error('长度在1 到 2000以内'));
            }
        }else if(value.replace(/<[^>]+>/g,"").length <= 2000){

            callback();
        }else if(value.replace(/<[^>]+>/g,"").length > 2000){

            callback(new Error('长度在1 到 2000以内'));

        }
    };
    var checkDetail2 = (rule, value, callback) => {
        if(value.replace(/<[^>]+>/g,"").length == 0){
            console.log("1")
            if(value.length > 20 && value.length <= 10000){
                console.log("2")
                callback();
            }else{
                console.log("3")
                callback(new Error('长度在1 到 10000以内'));
            }
        }else if(value.replace(/<[^>]+>/g,"").length <= 10000){
            console.log("4")
            callback();
        }else if(value.replace(/<[^>]+>/g,"").length > 10000){
            console.log("5")
            callback(new Error('长度在1 到 10000以内'));

        }
    };

export default{noCheckNum,checkEmail,noCheckIdCard,checkDetail,checkNum,checkNum0,check100,checkSubsidy,check9,checkSZH,checkName,checkDetail2,checkPhone,checkArea,checkMoney,checkSubsidy70,checkSZH20,checkPosNmuberSize7,checkLandMoney,checkIdCard}
