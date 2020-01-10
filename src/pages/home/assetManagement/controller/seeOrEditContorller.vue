<template>
    <div>
        <el-form ref="seedlingDetail" :rules="rules" :model="seedlingDetail" label-width="140px">
            <p class="wrapper-title"><span>控制器信息编辑</span></p>
            <div class="content-wrapper">
                <div class="QRCode" :style="{'backgroundImage': 'url('+seedlingDetail.qrCode1Url + ')' }">
                    <span class="saveQRImg" @click="saveQRcode">保存图片 </span>
                </div>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="基地名称：">
                            {{seedlingDetail.baseName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="地块名称：">
                            {{seedlingDetail.massifName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="控制器编号：">
                            {{seedlingDetail.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="控制器名称：" prop="name">
                            <el-input v-model="seedlingDetail.name" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="滴头数：" prop="waterNum">
                            <el-input-number v-model="seedlingDetail.waterNum" size="medium" step-strictly
                                             :precision="0" :min="1" :max="99999" label="描述文字"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="控制面积：" prop="area">
                            <el-input v-model="seedlingDetail.area" placeholder="请输入内容"></el-input>
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
                            {{ seedlingDetail.createTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="MAC地址：" prop="macAddress">
                                    <!-- mac地址 -->
                                    <el-select v-model="seedlingDetail.macAddress" placeholder="请选择">
                                        <el-option
                                            v-for="item in macSelectOpt"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" class="updataButton">
                                <el-button type="primary" size="medium" @click="setTimeClick" :disabled="times > 0">
                                    {{times > 0? times:'更新'}}
                                </el-button>
                            </el-col>
                        </el-row>

                    </el-col>


                    <el-col :span="10">
                        <el-form-item label="位置：" prop="position">
                            <el-input v-model="seedlingDetail.position" placeholder="请输入内容">
                                <el-button slot="append" @click="showLocalDialog = true"
                                           icon="el-icon-location-outline"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <el-dialog title="控制器变更" :visible.sync="changeSeedlingVisible" width="30%" :close-on-click-modal="false"
                   v-if="changeSeedlingVisible">
            <change-control :isControl="true" :controllerIds="[seedlingId]" @saveClose="back"
                            @closeDialog="changeSeedlingVisible = false"></change-control>
        </el-dialog>

        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" v-if="showLocalDialog"
                   :close-on-click-modal="false">
            <locat-map @closeAndSave="saveAddress" :coordinate="coordinate"
                       :CoordinateType="CoordinateType"></locat-map>
        </el-dialog>
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <el-button v-allow="'controller-update'" :disabled="isDisabled" type="primary"
                       @click="saveSeedling('seedlingDetail')">保存
            </el-button>
            <el-button v-allow="'controller-change'" :disabled="isDisabled" type="primary" @click="changeControlWay">
                变更
            </el-button>
        </div>
    </div>
</template>
<script>
    // 当前页面的Seedling 对象吗，从苗木那边复制过来，暂时没有更改，不影响功能，可将Seedling默认相当于控制器。
    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import changeControl from './component/changeControl'
    import locatMap from '../SeedlingManagement/component/map'
    import { singleImgByName } from '@/utils/downImgsZip.js'
    import { setOptionLog } from '../util/index'

    export default {
        components: { MultipleUploadImgs, changeControl, locatMap },
        name: 'seeOrEditContorller',
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
                macSelectOpt: [],
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
                                if (!res.test(value) || value >= 1000000) {
                                    callback(new Error('最多保留3位小数，0-999999.999'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
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
                isDisabled: false,
                changeSeedlingVisible: false,
                showLocalDialog: false,
                coordinate: '',
                address: '',
                seedlingId: '',
                timer: null, // 计时器的引用
                clickStartTime: '', // 点击开始时间
                times: 0, // 倒计时的秒数
                CoordinateType: { controller: true, massif: false, nursery: false, }
            }
        },
        methods: {
            saveQRcode () {
                const data = {
                    url: this.seedlingDetail.qrCode1Url,
                    name: this.seedlingDetail.qrCode1Name
                }
                singleImgByName(data)
                setOptionLog('控制器管理', '保存二维码')

            },
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.seedlingDetail.coordinate = coordinate && coordinate.toString()
                this.coordinate = coordinate && coordinate.toString()
                this.seedlingDetail.position = address
            },
            saveSeedling (name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        const params = JSON.parse(JSON.stringify(this.seedlingDetail))
                        this.updateController(params)
                    } else {

                    }
                })
            },
            async getMacInfo () {
                const res = await this.http.get(this.api.controller.getMacInfo, {})
                if (res && res.code === 200) {
                    this.macSelectOpt = res.data.list
                }
            },
            setTimeClick () {
                if (this.times === 0) {
                    // 点击获取数值
                    this.times = 60
                    this.clickStartTime = localStorage.setItem('clickStartTime', new Date().valueOf())
                    console.log(this.times)
                    this.getMacInfo()
                    this.timer = setInterval(() => {
                        if (this.times === 0) {
                            clearInterval(this.timer)
                            return
                        }
                        this.times--
                    }, 1000)
                    console.log(this.times)
                } else {
                    // 无法点击
                }
            },
            getTimes () {
                const clickStartTime = localStorage.getItem('clickStartTime')
                this.clickStartTime = clickStartTime
                let times = null
                if (!clickStartTime || new Date().valueOf() - this.clickStartTime > 60000) {
                    times = 0
                } else {
                    times = 60 - Math.round((new Date().valueOf() - this.clickStartTime) / 1000)
                }
                return times
            },
            // 获取详情
            async getControllerInfo (id) {
                const res = await this.http.get(this.api.controller.getControllerInfo, {
                    id
                })
                if (res && res.code === 200) {
                    this.seedlingDetail = res.data.obj
                    this.coordinate = this.seedlingDetail.coordinate
                } else if (res && res.code === 1001) {
                    this.$alert('该控制器不存在，请返回列表，重新选择', '提示', {
                        confirmButtonText: '返回',
                        callback: action => {
                            this.$router.go(-1)
                        },
                        showClose: false
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res && res.message
                    })
                }
            },
            async updateController (params) {
                const res = await this.http.postJson(this.api.controller.updateController, params)
                if (res && res.code === 200) {
                    if (res.bizCode && res.bizCode === 401) {
                        this.$message({
                            type: 'error',
                            message: res.bizMsg
                        })
                        return
                    }
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    })
                    this.$router.go(-1)
                } else if (res && res.code === 1001) {
                    this.$alert('该控制器不存在，请返回列表，重新选择', '提示', {
                        confirmButtonText: '返回',
                        callback: action => {
                            this.$router.go(-1)
                        },
                        showClose: false
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            back () {
                this.changeSeedlingVisible = false
                this.$router.go(-1)
            },
            init () {
                this.seedlingId = this.$route.query.id
                this.getControllerInfo(this.seedlingId)
            },
            changeControlWay () {
                if (this.seedlingDetail.stateKey === 0) {
                    this.changeSeedlingVisible = true
                } else {
                    this.$message({
                        type: 'warning',
                        message: '控制器状态必须为未设定'
                    })
                }
            }
        },
        computed: {},
        created () {
            // this.times = this.getTimes()
            this.init()
            this.times = 0
            this.timer = setInterval(() => {
                if (this.times === 0) {
                    clearInterval(this.timer)
                    return
                }
                this.times--
            }, 1000)
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
        activated () {
            this.init()
        }
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
        background: #303133;
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
