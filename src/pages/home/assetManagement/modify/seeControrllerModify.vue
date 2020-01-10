<template>
    <div>
        <el-form ref="seedlingDetail" :rules="rules" :model="seedlingDetail" label-width="140px">
            <p class="wrapper-title"><span>控制器信息</span></p>
            <div class="content-wrapper">
                <div class="QRCode" :style="{'backgroundImage': 'url('+seedlingDetail.qrCode1Url + ')' }">
                    <span class="saveQRImg" @click="saveQRcode">保存图片 </span>
                </div>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="基地名称：">
                            <span>{{seedlingDetail.baseName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="地块名称：">
                            <span>{{seedlingDetail.massifName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="控制器编号：">
                            <span>{{seedlingDetail.number}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="控制器名称：">
                            <span>{{seedlingDetail.name}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="滴头数：">
                            <span>{{seedlingDetail.waterNum}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="控制面积：">
                            <span>{{seedlingDetail.area}}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="坐标：">
                            {{seedlingDetail.coordinate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="添加时间：">
                            <span>{{ seedlingDetail.createTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="MAC地址：">
                            <span>{{seedlingDetail.macAddress}}</span>
                        </el-form-item>
                    </el-col>


                    <el-col :span="10">
                        <el-form-item label="位置：">
                           <span>{{seedlingDetail.position}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <br>
            <p class="wrapper-title"><span>变更信息</span></p>
            <div class="content-wrapper">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="变更方式：">
                            <span>{{ changeInfo.change}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="原基地：">
                            <span>{{ changeInfo.oldBase}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="变更前地块：">
                            <span>{{ changeInfo.oldMassif}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="变更后地块：">
                            <span>{{ changeInfo.nowMassif}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="流失原因：">
                            <span>{{ changeInfo.reasons}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="详细：">
                            <span>{{ changeInfo.description}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <el-button v-allow="'change-update'" type="primary" :disabled="isEdit" @click="saveSeedling('seedlingDetail')">保存</el-button>
        </div>
    </div>
</template>
<script>
    // 当前页面的Seedling 对象吗，从苗木那边复制过来，暂时没有更改，不影响功能，可将Seedling默认相当于控制器。
    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import { singleImgByName } from '@/utils/downImgsZip.js'

    export default {
        components: { MultipleUploadImgs },
        name: 'seeControrllerModify',
        data () {
            return {
                seedlingDetail: {
                    id: null,
                    area: '',
                    baseId: '',
                    coordinate: '',
                    macAddress: '',
                    massifId: null,
                    name: '',
                    waterNum: null,
                    position: '',
                },
                rules: {
                    macAddress: [{ required: true, message: '请选择MAC地址', trigger: 'change' }],
                    name: [{ required: true, message: '请输入名称', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value && value.length > 10) {
                                    callback(new Error('最长10个汉字/字母/数字'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    waterNum: [{ required: true, message: '请输入滴头数', trigger: 'change' }],
                    area: [{ required: true, message: '请输入数值', trigger: 'change' },
                        {
                            validator: (rules, value, callback) => {
                                const res = /^(([1-9]\d+)|[0-9])(\.\d{1,3})?$/
                                if (!res.test(value) || value.length > 11) {
                                    callback(new Error('最多保留3位小数，最多10位'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    coordinate: [{ required: true, message: '请输入坐标', trigger: 'change' }],
                    position: [{ required: true, message: '请输入位置', trigger: 'change' }
                        , {
                            required: true, validator: (rules, value, callback) => {
                                if (value && value.length > 50) {
                                    callback(new Error('最长50个汉字/字母/数字'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }],
                },
                showLocalDialog: false,
                coordinate: '',
                address: '',
                seedlingId: '',
                changeNumber: '',
                changeInfo: '',
                CoordinateType: { controller: true, massif: false, nursery: false, },
                isEdit: false

            }
        },
        methods: {
            saveQRcode () {
                const data = {
                    url: this.seedlingDetail.qrCode1Url,
                    name: this.seedlingDetail.qrCode1Name
                }
                singleImgByName(data)
            },
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.seedlingDetail.coordinate = coordinate.toString()
                this.coordinate = coordinate.toString()
                this.seedlingDetail.position = address
            },
            async lookControllerChange () {
                const res = await this.http.get(this.api.change.lookControllerChange, {
                    id: this.seedlingId
                })
                if (res && res.code === 200) {
                    this.seedlingDetail = res.data.fmpController
                    this.changeInfo = res.data.changeInfo
                    this.coordinate = this.seedlingDetail.coordinate
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            async editControllerChange (params) {
                const res = await this.http.get(this.api.change.editControllerChange, params)
                if (res && res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    })
                    this.$router.go(-1)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            saveSeedling (name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        const params = {
                            coordinate: this.seedlingDetail.coordinate,
                            number: this.seedlingDetail.number,
                            position: this.seedlingDetail.position
                        }
                        this.editControllerChange(params)
                    } else {

                    }
                })
            },
            back () {
                this.$router.go(-1)
            },
            init () {
                this.seedlingId = this.$route.query.id
                this.changeNumber = this.$route.query.number
                this.lookControllerChange()
            }
        },
        watch: {
            $route: {
                handler: function (val, oldVal) {
                    if (val.path == oldVal.path) {
                        this.init()
                    }
                }
            }
        },
        computed: {},
        created () {
            this.init()
        },
    }
</script>
<style lang="scss" scoped>
    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

    .content-wrapper {
        position: relative;
    }

    .QRCode {
        width: 100px;
        height: 100px;
        position: absolute;
        right: 20px;
        z-index: 10;
        cursor: pointer;
        display: flex;
        flex-direction: column-reverse;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .saveQRImg {
        width: 100px;
        height: 30px;
        display: inline-block;
        text-align: center;
        padding: 5px;
        box-sizing: border-box;
        background: #303133a1;
        color: white;
        display: none;
    }

    .QRCode:hover {
        .saveQRImg {
            display: inline-block;
        }
    }

    .updataButton {
        line-height: 42px;
        margin-left: 10px;
    }
</style>
