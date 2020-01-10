<template>
    <section class="login-body">
        <div class="login-left-body">
            <div class="left-content">
                <span class="logo">LOGO</span>
                <span class="splite-line"></span>
                <span class="title-name">南京向智科技有限公司</span>
            </div>
            <div class="left-foot"></div>
        </div>
        <div class="login-right-body">
            <div style="width: 65%;">
                <div class="right-title">书辰后台管理系统</div>
                <div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                        <div class="login_input">
                            <el-form-item prop="userName">
                                <el-input
                                    type="text"
                                    placeholder="请输入账号"
                                    v-model="ruleForm.userName"
                                    @focus="focusUser"
                                    @blur="blurUser"
                                >
                                    <template slot="prepend">
                                        <i class="userIocn"></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item prop="passWord">
                                <el-input
                                    type="password"
                                    placeholder="密码"
                                    v-model="ruleForm.passWord"
                                    auto-complete="off"
                                    @focus="focusInput"
                                    @blur="blurInput"
                                    @keyup.enter.native="login('ruleForm')"
                                >
                                    <template slot="prepend">
                                        <i class="passIcon"></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div class="login_button_box">
                    <div class="login-button blue_button" @click="login('ruleForm')">登录</div>
                    <div class="login-button white_button" @click="resetForm('ruleForm')">重置</div>
                </div>
            </div>
            <!-- <div class="rigth_foot">
                       <div class="footer">杭州金恪云数据技术有限公司 版权所有©(2018-2019） <br>版本号：{{version}}</div>
            </div>-->
        </div>
    </section>
</template>

<script>
    export default {
        data () {
            return {
                version: this.packageJson['agri-version'],
                focusInputPass: false,
                focusInputUser: false,
                checked: false,
                hasPass: '',
                BBth: false,
                ruleForm: {
                    userName: '',
                    passWord: ''
                },
                rules: {
                    userName: [
                        {
                            required: true,
                            message: '请输入账号',
                            trigger: 'blur'
                        }
                    ],
                    passWord: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        mounted () {
            this.getUserName()
        },
        methods: {
            focusInput () {
                this.focusInputPass = true
            },
            blurInput () {
                this.focusInputPass = false
            },
            focusUser () {
                this.focusInputUser = true
            },
            blurUser () {
                this.focusInputUser = false
            },
            getUserName: function () {
                if (window.$cookies.get('userName')) {
                    this.ruleForm.userName = window.$cookies.get('userName')
                }
            },
            login: async function (formName) {
                if (this.BBth) {
                    return
                }
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        this.BBth = true
                        const params = {
                            userName: this.ruleForm.userName,
                            password: this.ruleForm.passWord
                        }
                        const res = await
                        this.http.post(this.api.user.login, params)
                        this.BBth = false
                        if (res.code !== 200) {
                            this.$message.error(res.message)
                            return
                        }
                        console.log(res.data)
                        this.$cookies.set('userInfo',JSON.stringify(res.data))
                        this.$message.success(res.message)
                        this.$router.push('/home/course')
                    }


                })
            },
            resetForm (name) {
                this.$refs[name].resetFields()
            },
            async companyInfo () {
                const res = await this.http.get(this.api.system.companyInfo)
                if (res && res.code === 200) {
                    this.$store.commit('common/updateAbbrname', res.data.obj.abbrname || '')
                    this.$store.commit('common/updateAbbrImgUrl', res.data.obj.log || '')
                    this.$store.commit('common/updateName', res.data.obj.name || '')
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .title-wrapper {
        height: 130px;

        .title {
            margin-top: 70px;

            img {
                width: 220px;
                vertical-align: middle;
            }

            .line {
                margin: 0 5px;
            }

            span {
                vertical-align: middle;
                color: #409eff;
            }
        }
    }

    .el-main {
        padding: 0;
        /*background: url('login.png') no-repeat center;*/
        /*background: url('./bg2.png') no-repeat center;*/
        /*-webkit-background-size: cover;*/
        /*background-size: cover;*/
        background: #fff;
    }

    .el-container.is-vertical {
        min-width: 1150px;
        min-height: 900px;
        position: relative;
        overflow: hidden;
    }

    .bgBox {
        width: 1920px;
        position: absolute;
        left: 50%;
        top: 0;
        margin-left: -960px;
        overflow: hidden;

        img {
            display: block;
        }
    }

    .el-form-item {
        margin-bottom: 30px;
    }

    .login-wrapper {
        width: 461px;
        height: 356px;
        background: rgba(255, 255, 255, 0.9);
        /*padding: 30px 25px;*/
        /*padding:40px 60px 44px 60px;*/
        padding: 40px 40px 0 40px;
        margin: 0 auto;
        margin-top: 206px;

        p {
            margin-bottom: 35px;
            font-size: 24px;
            line-height: 28px;
            color: #3788f0;
            text-align: center;
        }

        .el-checkbox {
            display: block;
        }

        .passWord {
            margin-bottom: 50px;
        }

        .login-btn {
            display: block;
            width: 172px;
            height: 42px;
            /*margin-top: 20px;*/
            background: linear-gradient(
                    180deg,
                    rgba(55, 136, 240, 1),
                    rgba(85, 154, 243, 1)
            );
            border-radius: 22px;
            font-size: 16px;
            box-shadow: 0px 1px 3px 2px RGBA(55, 136, 240, 0.5);
            margin: 0 auto;
        }
    }

    .footer {
        text-align: center;
        line-height: 60px;
        padding-top: 190px;
    }

    .loginInput {
        border-bottom: 1px solid #e7e7e7;

        img {
            display: inline-block;
            vertical-align: middle;
        }
    }

    .savePassWord .el-checkbox {
        display: inline-block;

        margin-right: 12px;
    }

    /deep/ .loginInput .el-input {
        margin: 10px 0;
        background: none;
        outline: none;
        border: 0px;
        display: inline-block;
        width: 93%;
        font-size: 16px;

        .el-input__inner {
            background: none;
            outline: none;
            border: 0;
            -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
        }
    }

    /deep/ .savePassWord .el-form-item__content {
        margin-top: 32px;
        font-size: 16px;
        color: #666666;
    }

    /deep/ .el-input-group__prepend {
        padding: 0 15px;
        border-radius: 0;
    }

    /deep/ .el-input {
        height: 3.2rem;
    }

    /deep/ .el-input__inner {
        height: 3.2rem;
        border-radius: 0;
    }

    .loginFocus {
        border-color: #3678eb;
    }

    .login-body {
        display: flex;
        height: 100%;
    }

    .login-left-body {
        width: 65%;
        height: 100%;
        background-image: url("./img/left_bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        // justify-content: space-between;
        // display: flex;
    }

    .login-right-body {
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logo {
        width: 12.5rem;
        // width: 16.2%;
        height: 3.2rem;
        display: inline-block;
        background-image: url("");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #fff;
        font-size: 30px;
    }

    .left-content {
        display: flex;
        width: 100%;
        margin-top: 6%;
        margin-left: 8%;
    }

    .splite-line {
        width: 2px;
        // height: 50px;
        height: 3.2rem;
        display: inline-block;
        background: #fff;
        margin-left: 30px;
        margin-right: 30px;
    }

    .title-name {
        // font-size:28px;
        font-size: 1.75rem;
        font-family: SourceHanSansSC-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 2.8rem;
    }

    .left-foot {
        /* border: 1px red solid; */
        font-size: 1.75rem;
        font-family: SourceHanSansSC-Medium;
        font-weight: 500;
        color: white;
        line-height: 40px;
        /* text-align: right; */
        position: absolute;
        right: 3rem;
        bottom: 1.5rem;
    }

    .right-title {
        height: 46px;
        font-size: 30px;
        font-family: SourceHanSansSC-Bold;
        font-weight: bold;
        color: rgba(60, 78, 114, 1);
        line-height: 46px;
        padding-bottom: 15px;
        border-bottom: 3px solid #3078ff;
        margin-bottom: 86px;
        display: inline-block;
    }

    .userIocn {
        background-image: url("./img/user_icon.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 15px;
        display: inline-block;
    }

    .passIcon {
        background-image: url("./img/pass_icon.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 18px;
        display: inline-block;
    }

    .login-button {
        width: 100%;
        height: 70px;
        height: 4.35rem;
        text-align: center;
        line-height: 4.35rem;
        // font-size:20px;
        font-size: 1.25rem;
        font-family: SourceHanSansSC-Medium;
        font-weight: 500;
        color: rgba(223, 227, 234, 1);
        cursor: pointer;
    }

    .blue_button {
        background: rgba(48, 120, 255, 1);
        margin-bottom: 1rem;
    }

    .white_button {
        background: 0;
        border: 2px solid rgba(48, 120, 255, 1);
        font-size: 1.25rem;
        font-family: SourceHanSansSC-Medium;
        font-weight: 500;
        color: rgba(48, 120, 255, 1);
        box-sizing: border-box;
    }

    .login_input {
        margin-bottom: 2.4rem;
    }

    .login_button_box {
        margin-top: 4rem;
    }

    .rigth_foot {
        position: absolute;
        bottom: 0;
    }
</style>
<style>
    @media screen and (max-width: 1440px) {
        html {
            font-size: 12px;
        }
    }
</style>

