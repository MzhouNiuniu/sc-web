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
                                    v-for="item in seedlingNameOpt"
                                    :key="item.sfKey"
                                    :label="item.sfValue"
                                    :value="item.sfKey">
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
                        <el-col :span="12">
                            <el-form-item label="权益人：">
                                <el-input v-model="seedling.v1" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" class="hidden">
                            <el-form-item label="展示状态">
                                <el-radio-group>
                                    <el-radio-button label="0">隐藏</el-radio-button>
                                    <el-radio-button label="1">展示</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="展示状态">
                                <el-radio-group v-model="nurseryConfig.equityPersonShow">
                                    <el-radio-button label="0">隐藏</el-radio-button>
                                    <el-radio-button label="1">展示</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="林权证号：">
                                <el-input v-model="seedling.v2" maxlength="30" placeholder="请输入内容"/>

                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="守护人：">
                                <el-input v-model="seedling.v3" maxlength="30" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="展示状态">
                                <el-radio-group v-model="nurseryConfig.forestOwnershipCertifiShow">
                                    <el-radio-button label="0">隐藏</el-radio-button>
                                    <el-radio-button label="1">展示</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="展示状态">
                                <el-radio-group v-model="nurseryConfig.keeperShow">
                                    <el-radio-button label="0">隐藏</el-radio-button>
                                    <el-radio-button label="1">展示</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="守护时间：">
                                <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="seedling.v4"
                                    type="daterange"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions"
                                />
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="展示状态">
                                <el-radio-group v-model="nurseryConfig.keepTimeShow">
                                    <el-radio-button label="0">隐藏</el-radio-button>
                                    <el-radio-button label="1">展示</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="16">
                        <el-form-item label="传记：" prop="biography">
                            <el-input v-model="seedling.biography" maxlength="10000" type="textarea"
                                      :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="展示状态">
                            <el-radio-group v-model="nurseryConfig.biographyShow">
                                <el-radio-button label="0">隐藏</el-radio-button>
                                <el-radio-button label="1">展示</el-radio-button>
                            </el-radio-group>
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
            <el-button type="primary" @click="submit">保存修改</el-button>
        </div>
    </div>
</template>
<script>
    import { debounce } from '@/utils'
    import BaseLandSelect from '@/components/service/BaseLandSelect'
    import locatMap from '@/components/service/LocatMap'

    export default {
        components: {
            locatMap,
            BaseLandSelect,
        },
        name: 'addSeedling',
        data () {
            return {
                nurseryConfig: {
                    biographyShow: 1,
                    equityPersonShow: 1,
                    forestOwnershipCertifiShow: 1,
                    id: '23',
                    keepTimeShow: 1,
                    keeperShow: 1,
                    orgId: '61304177121067151',
                },
                seedlingDetail: {
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
                    landOptions: [],

                    // mock field
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: [],
                },
                seedlingArrays: [
                    {
                        baseNumber: '',
                        nurseryStockName: '',
                        massifId: '',
                        unitKey: '',
                        nameKey: '',
                        age: 0,
                        num: 0,
                        plantTime: '',
                        position: '',
                        coordinate: '',
                        biography: '',
                        landOptions: []
                    }
                ],
                landOptions: [],
                unitOption: [],
                seedlingNameOpt: [],
                rules: {
                    baseNumber: [{ message: '请选择基地', trigger: 'change' }],
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
                currentSeedingEdit: {
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
                    landOptions: []
                },
                CoordinateType: { controller: false, massif: false, nursery: true, },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() >= Date.now()
                    }
                }

            }
        },
        methods: {
            addSeedling: debounce(function () {
                if (this.seedlingArrays.length === 5) {
                    this.$message({
                        type: 'warning',
                        message: '最多五组'
                    })
                    return
                }
                const seedling = Object.assign({}, this.seedlingDetail)
                this.$set(this.seedlingArrays, this.seedlingArrays.length, seedling)
            }),
            deleteSeedling (seedling) {
                const index = this.seedlingArrays.indexOf(seedling)
                if (index !== -1) {
                    this.seedlingArrays.splice(index, 1)
                }
            },
            async AddNurseryStockList (params) {
                const res = await this.http.postJson(this.api.seedling.AddNurseryStockList, params)
                if (res && res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    })
                    // 新增成功过之后，进行清除数据
                    this.seedlingArrays = [{
                        baseNumber: '',
                        nurseryStockName: '',
                        massifId: '',
                        unitKey: '',
                        nameKey: '',
                        age: 0,
                        num: 0,
                        plantTime: '',
                        position: '',
                        coordinate: '',
                        biography: '',
                        landOptions: []
                    }]
                    this.$refs['seedlingDetail'].forEach(formItem => {
                        formItem.resetFields()
                    })
                    this.$router.go(-1)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            saveSeedling (formName) {
                let allValid = true // 默认都是 通过的，若有不通过的 就置为fasle
                this.$refs[formName].forEach(formItem => {
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
                    })
                    this.AddNurseryStockList(params)
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
            async changeBase (seedling) {
                seedling.landOptions = await this.getlandOptionByBaseId(seedling.baseNumber)
                seedling.land = ''
            },
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.currentSeedingEdit.coordinate = coordinate.toString()
                this.currentSeedingEdit.position = address
            },
            // 获取苗木下拉
            async nurseryStockDropDown () {
                const res = await this.http.get(this.api.seedling.nurseryStockDropDown, {})
                if (res && res.code == 200) {
                    this.unitOption = res.data.unit
                    this.seedlingNameOpt = res.data.seedling

                } else {
                    this.$message({
                        type: 'error',
                        message: '系统错误，请联系管理员！'
                    })
                }
            },
            openSetMapAddress (item) {
                this.currentSeedingEdit = item
                this.showLocalDialog = true
            },
            setSeedlingName (seedling) {
                for (const iterator of this.seedlingNameOpt) {
                    if (iterator.sfKey === seedling.nameKey) {
                        seedling.nurseryStockName = iterator.sfValue
                    }
                }
            },
            back () {
                this.$router.go(-1)
            },

            //以上方法为页面原始方法均为用到 暂做保留

            async getNurseryConfigByOrganizationId () {
                const res = await this.http.get(this.api.system.getNurseryConfigByOrganizationId)
                console.log(res.nurseryConfig)
                this.nurseryConfig = res.nurseryConfig

            },
            async submit () {
                const res = await this.http.postJson(this.api.system.editNurseryConfig, this.nurseryConfig)
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '修改失败'
                    })
                }

            }

        },
        created () {
            this.getNurseryConfigByOrganizationId()

        },

    }
</script>
<style lang="scss" scoped>
    .hidden {
        visibility: hidden;
    }

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

