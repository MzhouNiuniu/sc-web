<template>
    <div class="edit-form">
        <div style="flex:1;">
            <el-form ref="userDetail" :rules="rules" :model="userDetail" label-width="100px">
                <div class="formBody">
                    <p class="wrapper-title"><span>登录信息</span></p>
                    <br>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="手机号码:" prop="mobile">
                                {{userDetail.mobile}}
                                <!--               不可修改                 <el-input v-model="userDetail.mobile" placeholder="请输入内容"></el-input>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="登录密码:" prop="password">
                                <el-input v-model.trim="userDetail.password" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电子邮箱:" prop="email">
                                <el-input v-model="userDetail.email" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <br>


                    <p class="wrapper-title"><span>用户信息</span></p>
                    <br>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户姓名:" prop="name">
                                <el-input v-model="userDetail.name" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工号:" prop="jobNumber">
                                <el-input v-model="userDetail.jobNumber" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性 别:" prop="gender">
                                <el-radio-group v-model="userDetail.gender">
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职务:" prop="duty">
                                <el-input v-model="userDetail.duty" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色:" prop="roleCode">
                                <template v-if="isAdmin">
                                    {{userDetail.roleNames}}
                                </template>
                                <el-select v-else v-model="userDetail.roleCode" style="width:160px;">
                                    <el-option label="请选择角色" value=""/>
                                    <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.roleName"
                                               :value="item.roleCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门:" prop="dept">
                                <el-input v-model="userDetail.dept" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="备注:" prop="remark">
                        <el-input v-model="userDetail.remark" type="textarea" placeholder="请输入内容"
                                  :maxlength="200"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div class="updata-button">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="back">取消</el-button>
            </div>
        </div>
        <div style="margin-left: 26px;padding-top: 33px;">
            <img :src="userDetail.image?userDetail.image:defaultImg" @error="img"
                 style="width:160px;height: 160px;border-radius: 6px;">
            <p style="text-align: center;font-size: 20px;margin-top: 6px;color: #409EFF;" v-if="isAdmin">
                （{{userDetail.roleNames}}）
            </p>
        </div>
    </div>
</template>
<script>
    import { checkIsAdmin } from '@/utils'

    export default {
        props: {
            user: {
                type: Object,
                default: () => {
                }
            }
        },
        data () {
            this.roleOptions = []
            return {
                userDetail: {
                    mobile: '',
                    password: '',
                    duty: '',
                    email: '',
                    jobNumber: '',
                    remark: '',
                    gender: '',
                    name: '',
                    roleCode: '',
                    dept: ''
                },
                rules: {
                    roleCode: {
                        required: true,
                        message: '请选择角色',
                    },
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                const res = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/
                                if (!res.test(value)) {
                                    callback(new Error('手机不符合规范！'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    email: [
                        {
                            validator: (rules, value, callback) => {
                                const res = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                                // const res = /^[A-Za-z0-9]+$/
                                if (!value || (res.test(value) && value.length <= 20)) {
                                    callback()
                                } else {
                                    callback(new Error('邮箱格式，限制最长20个字符'))
                                }
                            }, message: '邮箱格式，限制最长20个字符', trigger: 'blur'
                        }

                    ],
                    password: [{
                        validator: (rules, value, callback) => {
                            const res = /^[A-Za-z0-9]{6,18}$/
                            if (!value || res.test(value)) {
                                callback()
                            } else {
                                callback(new Error('6<=长度<=18,只能包含英文字母、数字，字母区分大小写。'))
                            }
                        }, trigger: 'blur'
                    }],
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        {
                            validator: (rules, value, callback) => {
                                if (value.length <= 6) {
                                    callback()
                                } else {
                                    callback(new Error('长度限制6个。'))
                                }
                            }, message: '长度限制6个。', trigger: 'blur'
                        }
                    ],
                    gender: [
                        { required: true, message: '选择性别', trigger: 'change' },
                    ],
                    jobNumber: [
                        { required: true, message: '请输入工号', trigger: 'blur' },
                        {
                            validator: (rules, value, callback) => {
                                const res = /^[A-Za-z0-9]+$/
                                if (res.test(value) && value.length <= 10) {
                                    callback()
                                } else {
                                    callback(new Error('只能输入数字和字母,长度限制10个。'))
                                }
                            }, message: '只能输入数字和字母,长度限制10个。', trigger: 'blur'
                        }
                    ],
                    remark: [
                        {
                            validator: (rules, value, callback) => {
                                if (!value || value.length <= 200) {
                                    callback()
                                } else {
                                    callback(new Error('最长200个汉字/字母/数字'))
                                }
                            }, message: '最长200个汉字/字母/数字', trigger: 'blur'
                        }
                    ],
                    duty: [
                        {
                            validator: (rules, value, callback) => {
                                if (!value || value.length <= 10) {
                                    callback()
                                } else {
                                    callback(new Error('最长10个汉字/字母/数字'))
                                }
                            }, message: '最长10个汉字/字母/数字', trigger: 'blur'
                        }
                    ], dept: [
                        {
                            validator: (rules, value, callback) => {
                                if (!value || value.length <= 20) {
                                    callback()
                                } else {
                                    callback(new Error('最长20个汉字/字母/数字'))
                                }
                            }, message: '最长20个汉字/字母/数字', trigger: 'blur'
                        }
                    ]
                },
                defaultImg: 'http://images.oraro.net/20190724/1563961036054.png'
            }
        },
        computed: {
            isAdmin () {
                return checkIsAdmin(this.userDetail.roleCode)
            },
        },
        methods: {
            loadRoleList () {
                this.http.get(this.api.system.role.list).then(res => {
                    if (res.code !== 200) {
                        this.$message.error(res.message)
                        return
                    }

                    // 不展示管理员
                    if (Array.isArray(res.roles)) {
                        res.roles = res.roles.filter(item => !checkIsAdmin(item.roleCode))
                    }

                    this.roleOptions = res.roles
                    this.$forceUpdate()
                })
            },
            save () {
                this.$refs['userDetail'].validate(async valid => {
                    if (valid) {
                        const params = {
                            mobile: '',
                            password: '',
                            duty: '',
                            email: '',
                            jobNumber: '',
                            remark: '',
                            gender: '',
                            name: '',
                            dept: '',
                            roleCode: '',
                        }
                        for (const key in params) {
                            if (this.userDetail.hasOwnProperty(key)) {
                                params[key] = this.userDetail[key]
                            }
                        }

                        // params.userId = this.userDetail.userId // 1期
                        params.userId = this.userDetail.memberId
                        if (!params.password) {
                            delete params.password
                        }
                        const res = await this.http.postJson(this.api.system.changeUser, params)
                        if (res && res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '成功'
                            })
                            this.$emit('reloadTable')
                            this.back()
                        } else if (res && res.code === 1001) {
                            this.$alert('该用户不存在，请重新选择', '提示', {
                                confirmButtonText: '返回',
                                callback: action => {
                                    this.$emit('reloadTable')
                                    this.back()
                                },
                                showClose: false
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    }
                })
            },
            back () {
                this.$emit('closeDialog')
            },
            img (event) {
                event.target.src = this.defaultImg
            }
        },
        created () {
            this.loadRoleList()
            console.log(this.user.roleCode)
            Object.assign(this.userDetail, this.user)
        },
    }
</script>
<style lang="scss" scoped>
    .formBody {
    }

    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

    .edit-form {
        display: flex;
        justify-content: space-between;
    }
</style>
