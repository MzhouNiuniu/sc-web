<template>
    <div>
        <el-form ref="seedlingDetail" :rules="rules" :model="seedlingDetail" label-width="140px">
            <p class="wrapper-title"><span>苗木信息编辑</span></p>
            <div class="content-wrapper">
                <div class="QRCode" :style="{'backgroundImage': 'url('+seedlingDetail.qrCode1Url + ')' }">
                    <span class="saveQRImg" @click="saveQRcode">保存图片 </span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="苗木编号：">
                            <span>{{seedlingDetail.number}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="苗木名称：" prop="nurseryStockName">
                            <!--
                                二期改为不可修改，没有移除相关代码；
                                如需修改，直接取消注释即刻
                                 -->
                            {{seedlingDetail.nurseryStockName}}
                            <!--                            <el-select v-model="seedlingDetail.nameKey" placeholder="请选择">-->
                            <!--                                <el-option-->
                            <!--                                    v-for="item in seedlingNameOpt"-->
                            <!--                                    :key="item.sfKey"-->
                            <!--                                    :label="item.sfValue"-->
                            <!--                                    :value="item.sfKey">-->
                            <!--                                </el-option>-->
                            <!--                            </el-select>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="基地名称：">
                            <span>{{seedlingDetail.baseName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地块名称：">
                            <span>{{seedlingDetail.massifName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="株龄：" prop="age">
                            <el-input-number v-model="seedlingDetail.age" step-strictly :precision="0" :min="1"
                                             size="medium" :max="99999999" label="描述文字"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位：">
                            <span> {{seedlingDetail.unitKey}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="责任人：">
                            {{seedlingDetail.responsible}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="添加时间：">
                            <span>{{ seedlingDetail.createTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="栽种时间：" prop="plantTime">
                            <el-date-picker
                                v-model="seedlingDetail.plantTime"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="位置：" prop="position">
                            <el-input v-model="seedlingDetail.position" placeholder="请输入内容">
                                <el-button slot="append" @click="showLocalDialog = true"
                                           icon="el-icon-location-outline"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="坐标：">
                            {{seedlingDetail.coordinate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-col :span="12" v-if="getFieldIsEnable('equityPerson')">
                            <el-form-item label="权益人：">
                                <el-input v-model="seedlingDetail.equityPerson" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('forestOwnershipCertifi')">
                            <el-form-item label="林权证号：">
                                <el-input v-model="seedlingDetail.forestOwnershipCertifi" maxlength="30"
                                          placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('keeper')">
                            <el-form-item label="守护人：">
                                <el-input v-model="seedlingDetail.keeper" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('keepTime')">
                            <el-form-item label="守护时间：">
                                <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="seedlingDetail.keepTime"
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                />
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <br>
            <p class="wrapper-title"><span>详细信息</span></p>
            <div class="content-wrapper">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="图片：" prop="picture">
                            <Multiple-upload-imgs :fileLimit="9" v-model="seedlingDetail.picture"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" v-if="getFieldIsEnable('biography')">
                        <el-form-item label="传记：" prop="biography">
                            <el-input v-model="seedlingDetail.biography" type="textarea"
                                      :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <el-dialog title="苗木变更" :visible.sync="changeSeedlingVisible" width="30%" v-if="changeSeedlingVisible"
                   :close-on-click-modal="false">
            <change-seedling :seedlingIds="[seedlingDetail.id]" @saveClose="back"
                             @closeDialog="changeSeedlingVisible = false"></change-seedling>
        </el-dialog>

        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" v-if="showLocalDialog"
                   :close-on-click-modal="false">
            <locat-map @closeAndSave="saveAddress" :coordinate="coordinate"
                       :CoordinateType="CoordinateType"></locat-map>
        </el-dialog>
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <el-button v-allow="'nursery-update'" :disabled="isDisabled" type="primary"
                       @click="saveSeedling('seedlingDetail')">保存
            </el-button>
            <el-button v-allow="'nursery-change'"
                       :disabled="isDisabled" type="primary" @click="changeSeedlingVisible = true">
                变更
            </el-button>
        </div>
    </div>
</template>
<script>
    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import changeSeedling from './component/changeSeedling'
    import locatMap from './component/map'
    import { singleImgByName } from '@/utils/downImgsZip.js'
    import { setOptionLog } from '../util/index'
    import mixinFieldsConfig from './mixinFieldsConfig'

    export default {
        name: 'seeOrEditSeedling',
        components: { MultipleUploadImgs, changeSeedling, locatMap },
        mixins: [mixinFieldsConfig],
        data () {
            this.seedlingId = this.$route.query.id

            return {
                usersList: [],
                seedlingDetail: {},
                seedlingNameOpt: [],
                unitOption: [],
                rules: {
                    nameKey: [{ required: true, message: '请选择苗木', trigger: 'change' }],
                    age: [{ required: true, message: '请输入株龄', trigger: 'change' }],
                    plantTime: [{ required: true, message: '请输入时间', trigger: 'change' }],
                    position: [{ required: true, message: '请输入位置', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value.length > 50) {
                                    callback(new Error('最长50个汉字/字母/数字'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }],
                    picture: [{
                        required: true, validator: (rules, value, callback) => {
                            if (!Array.isArray(value) || value.length === 0) {
                                callback(new Error('请上传图片！'))
                            } else {
                                callback()
                            }
                        }, trigger: 'change'
                    }],
                    biography: [{
                        validator: (rules, value, callback) => {
                            if (value && value.length > 1000) {
                                callback(new Error('最长1000个汉字/字母/数字'))
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
                CoordinateType: { controller: false, massif: false, nursery: true, },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() >= Date.now()
                    }
                }
            }
        },
        methods: {
            saveQRcode () {
                const data = {
                    url: this.seedlingDetail.qrCode1Url,
                    name: this.seedlingDetail.qrCode1Name
                }
                singleImgByName(data)
                setOptionLog('苗木管理', '保存二维码')
            },
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.seedlingDetail.coordinate = coordinate.toString()
                this.coordinate = coordinate.toString()
                this.seedlingDetail.position = address
            },
            // 获取苗木下拉
            async nurseryStockDropDown () {
                const res = await this.http.get(this.api.seedling.nurseryStockDropDown, {})
                if (res && res.code == 200) {
                    this.unitOption = res.data.unit
                    this.seedlingNameOpt = res.data.seedling
                    return true
                } else {
                    this.$message.error(res.message)
                }
            },
            async lookNurseryStock () {
                const res = await this.http.get(this.api.seedling.lookNurseryStock, {
                    id: this.seedlingId
                })
                if (res && res.code === 200) {
                    const detail = res.data.obj

                    detail.picture = JSON.parse(detail.picture)
                    detail.picture = detail.picture && detail.picture.map(url => ({ url })) || []
                    if (detail.keepStartTime && detail.keepEndTime) {
                        detail.keepTime = [
                            detail.keepStartTime,
                            detail.keepEndTime,
                        ]
                    } else {
                        detail.keepTime = []
                    }

                    this.seedlingDetail = detail
                    this.coordinate = detail.coordinate
                } else if (res && res.code === 1001) {
                    this.$alert('该苗木不存在，请返回列表，重新选择', '提示', {
                        confirmButtonText: '返回',
                        callback: this.back,
                        showClose: false
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message,
                        duration: 5000
                    })
                }
            },
            async updateNurseryStock (params) {
                const array = params.picture.map(ele => {
                    return ele.url
                })
                params.picture = JSON.stringify(array)

                delete params.baseName
                delete params.baseName
                delete params.massifName
                delete params.createTime
                delete params.unitKey
                params.nurseryName = params.nurseryStockName
                delete params.nurseryStockName

                // 删除责任人的信息
                delete params.responsible
                delete params.memberCode

                // 对守护时间进行分割
                if (params.keepTime && params.keepTime[0] && params.keepTime[1]) {
                    params.keepStartTime = params.keepTime[0]
                    params.keepEndTime = params.keepTime[1]
                } else {
                    params.keepStartTime = params.keepEndTime = ''
                }
                delete params.keepTime

                const res = await this.http.postJson(this.api.seedling.updateNurseryStock, params)
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
                    this.back()
                } else if (res && res.code === 1001) {
                    this.$alert('该苗木不存在，请返回列表，重新选择', '提示', {
                        confirmButtonText: '返回',
                        callback: this.back,
                        showClose: false
                    })
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
                        const params = JSON.parse(JSON.stringify(this.seedlingDetail))
                        this.updateNurseryStock(params)
                    } else {

                    }
                })
            },
            back () {
                this.$router.replace('/home/SeedlingManagement')
            },
        },
        created () {
            this.nurseryStockDropDown().then(this.lookNurseryStock)
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
        background: #303133;
        color: white;
        display: none;
    }

    .QRCode:hover {
        .saveQRImg {
            display: inline-block;
        }
    }
</style>
