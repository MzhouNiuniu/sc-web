<template>
    <div>
        <p class="wrapper-title"><span>苗木信息编辑</span></p>
        <div class="content-wrapper" v-for="(seedling, index) in seedlingArrays" :key="index">
            <i class="el-icon-delete seedlingDele" @click="deleteSeedling(seedling)" v-show="index !== 0"></i>
            <el-form ref="seedlingDetail" :rules="rules" :model="seedling" label-width="140px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="基地名称：" prop="baseNumber">
                            <BaseLandSelect
                                value-key="number"
                                :id.sync="seedling.baseId"
                                v-model="seedling.baseNumber"
                                @change="changeBase(seedling)"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地块名称：" prop="massifId">
                            <el-select v-model="seedling.massifId" placeholder="请选择">
                                <el-option
                                    v-for="item in seedling.landOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="单位：" prop="unitKey">
                            <el-select v-model="seedling.unitKey" placeholder="请选择">
                                <el-option
                                    v-for="item in unitOption"
                                    :key="item.sfKey"
                                    :label="item.sfValue"
                                    :value="item.sfKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="苗木名称：" prop="nameKey">
                            <el-select v-model="seedling.nameKey" placeholder="请选择" @change="setSeedlingName(seedling)">
                                <el-option
                                    v-for="(item,index) in seedlingNameOpt"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.number">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="株龄：" prop="age">
                            <el-input-number v-model="seedling.age" step-strictly :precision="0" :min="1"
                                             :max="99999999" class="seedling-input-number"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="数量：" prop="num">
                            <el-input-number v-model="seedling.num" step-strictly :precision="0" :min="1" :max="100"
                                             class="seedling-input-number"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="栽种时间：" prop="plantTime">
                            <el-date-picker
                                value-format="yyyy-MM-dd"
                                v-model="seedling.plantTime"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="位置：" prop="position">
                            <el-input v-model="seedling.position" placeholder="请输入内容">
                                <el-button slot="append" @click="openSetMapAddress(seedling)"
                                           icon="el-icon-location-outline"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="16">
                        <el-col :span="12">
                            <el-form-item label="坐标：">
                                <el-input :value="seedling.coordinate" placeholder="请选择位置" disabled/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('equityPerson')">
                            <el-form-item label="权益人：">
                                <el-input v-model="seedling.equityPerson" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('forestOwnershipCertifi')">
                            <el-form-item label="林权证号：">
                                <el-input v-model="seedling.forestOwnershipCertifi" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('keeper')">
                            <el-form-item label="守护人：">
                                <el-input v-model="seedling.keeper" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="getFieldIsEnable('keepTime')">
                            <el-form-item label="守护时间：">
                                <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="seedling.keepTime"
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                />
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="16" v-if="getFieldIsEnable('biography')">
                        <el-form-item label="传记：" prop="biography">
                            <el-input v-model="seedling.biography" maxlength="10000" type="textarea"
                                      :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" :close-on-click-modal="false"
                   v-if="showLocalDialog">
            <locat-map @closeAndSave="saveAddress" :CoordinateType="CoordinateType"
                       :coordinate="currentSeedingEdit.coordinate"></locat-map>
        </el-dialog>
        <div class="updata-button">
            <el-button type="primary" @click="addSeedling">添加苗木</el-button>
            <el-button type="primary" @click="saveSeedling">保存</el-button>
            <el-button type="primary" @click="back">返回</el-button>
        </div>
    </div>
</template>
<script>
    import { debounce } from '@/utils'
    import BaseLandSelect from '@/components/service/BaseLandSelect'
    import locatMap from '@/components/service/LocatMap'
    import mixinFieldsConfig from './mixinFieldsConfig'

    export default {
        name: 'addSeedling',
        components: {
            locatMap,
            BaseLandSelect,
        },
        mixins: [mixinFieldsConfig],
        data () {
            return {
                landOptions: [],
                unitOption: [],
                seedlingNameOpt: [],

                seedlingArrays: [],
                rules: {
                    baseNumber: [{ required: true, message: '请选择基地', trigger: 'change' }],
                    massifId: [{ required: true, message: '请选择地块', trigger: 'change' }],
                    unitKey: [{ required: true, message: '请选择单位', trigger: 'change' }],
                    nameKey: [{ required: true, message: '请选择苗木', trigger: 'change' }],
                    age: [{ required: true, message: '请输入树龄', trigger: 'change' }],
                    num: [{ required: true, message: '请输入数量', trigger: 'change' }],
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
                    biography: [{
                        validator: (rules, value, callback) => {

                            if (value.length > 1000) {
                                callback(new Error('最长1000个汉字/字母/数字'))
                            } else {
                                callback()
                            }
                        }, trigger: 'change'
                    }]
                },
                showLocalDialog: false,
                coordinate: '',
                address: '',
                currentSeedingEdit: null,
                CoordinateType: { controller: false, massif: false, nursery: true, },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() >= Date.now()
                    }
                },
            }
        },
        methods: {
            getSeedlingDetailTpl () {
                return {
                    baseId: '', // 保存时需要删除此字段
                    landOptions: [], // 保存时需要删除此字段

                    baseNumber: '',
                    massifId: '',
                    unitKey: '',
                    nameKey: '',
                    nurseryStockName: '',
                    age: 0,
                    num: 0,
                    plantTime: '',
                    position: '',
                    coordinate: '',
                    biography: '',

                    forestOwnershipCertifi: '', // 林权证号
                    equityPerson: '', // 权益人
                    keeper: '', // 守护人
                    keepTime: [], // 守护时间（keepStartTime + keepEndTime）
                }
            },
            addSeedling: debounce(function () {
                if (this.seedlingArrays.length === 5) {
                    this.$message({
                        type: 'warning',
                        message: '最多五组'
                    })
                    return
                }
                this.$set(this.seedlingArrays, this.seedlingArrays.length, this.getSeedlingDetailTpl())
            }),
            deleteSeedling (seedling) {
                const index = this.seedlingArrays.indexOf(seedling)
                if (index !== -1) {
                    this.seedlingArrays.splice(index, 1)
                }
            },
            // 获取当前页面的下拉框选项
            loadSelectOptions () {
                this.http.get(this.api.seedling.selectOptionsOfForm).then(res => {
                    if (res.code !== 200) {
                        return
                    }
                    res = res.data
                    console.log(res.fmpBaseList)

                    this.unitOption = res.unit
                    this.seedlingNameOpt = res.nurseryNameList

                    // 测试，地块应该是联动的
                    this.landOptions = res.massifList
                })
            },
            async addNurseryStockList (params) {
                const res = await this.http.postJson(this.api.seedling.addNurseryStockList, params)
                if (res && res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    })
                    this.back()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            saveSeedling () {
                let allValid = true // 默认都是 通过的，若有不通过的 就置为fasle
                this.$refs.seedlingDetail.forEach(formItem => {
                    formItem.validate((valid) => {
                        if (!valid) {
                            allValid = false
                        }
                    })
                })
                if (allValid) {
                    const params = JSON.parse(JSON.stringify(this.seedlingArrays))
                    params.forEach(ele => {
                        delete ele.landOptions
                        delete ele.land
                        delete ele.baseId

                        // 对守护时间进行分割
                        if (ele.keepTime && ele.keepTime[0] && ele.keepTime[1]) {
                            ele.keepStartTime = ele.keepTime[0]
                            ele.keepEndTime = ele.keepTime[1]
                        } else {
                            ele.keepStartTime = ele.keepEndTime = ''
                        }
                        delete ele.keepTime
                    })

                    this.addNurseryStockList(params)
                } else {
                    // this.$message({
                    //     type: 'warning',
                    //     message: '完善参数'
                    // })
                }
            },
            async getlandOptionByBaseId (id) {
                const res = await this.http.get(this.api.seedling.massifInfoByBaseId, {
                    id
                }, true)
                if (res && res.code == 200) {
                    return res.data.list
                } else {
                    return []
                }
            },
            changeBase (seedling) {
                this.$nextTick(async () => {
                    seedling.landOptions = await this.getlandOptionByBaseId(seedling.baseId)
                    seedling.land = ''

                    // 清空地块
                    seedling.massifId && (seedling.massifId = '')
                })
            },
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.currentSeedingEdit.coordinate = coordinate.toString()
                this.currentSeedingEdit.position = address
            },

            openSetMapAddress (item) {
                this.currentSeedingEdit = item
                this.showLocalDialog = true
            },
            setSeedlingName (seedling) {
                const temp = this.seedlingNameOpt.find(item => item.number === seedling.nameKey)
                if (temp) {
                    seedling.nurseryStockName = temp.name
                }
            },
            back () {
                this.$router.replace('/home/SeedlingManagement')
            }

        },
        created () {
            this.addSeedling()
            this.loadSelectOptions()
        },

    }
</script>
<style lang="scss" scoped>
    .seedlingDele {
        cursor: pointer;
        float: right;
        position: absolute;
        right: 10px;
    }

    .content-wrapper {
        position: relative;
    }

    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

</style>
<style>
    .seedling-input-number .el-input-number__increase, .seedling-input-number .el-input-number__decrease {
        top: 2px;
    }
</style>

