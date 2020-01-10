<template>
    <div>
        <p class="wrapper-title"><span>新增控制器</span></p>
        <div class="content-wrapper" v-for="(seedling, index) in seedlingArrays" :key="index">
            <i class="el-icon-delete seedlingDele" @click="deleteSeedling(seedling)" v-show="index !== 0"></i>
            <el-form ref="seedlingDetail" :rules="rules" :model="seedling" label-width="140px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="基地名称：" prop="baseId">
                            <BaseLandSelect
                                v-model="seedling.baseId"
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
                        <el-form-item label="控制器名称：" prop="name">
                            <el-input v-model="seedling.name" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="控制面积：" prop="area">
                            <el-input v-model="seedling.area" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="滴头数：" prop="waterNum">
                            <el-input-number v-model="seedling.waterNum" step-strictly :precision="0" :min="1"
                                             :max="99999" class="seedling-input-number"></el-input-number>
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
                    <el-col :span="8">
                        <el-form-item label="坐标：">
                            <el-input :value="seedling.coordinate" placeholder="请选择位置" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" v-if="showLocalDialog"
                   :close-on-click-modal="false">
        </el-dialog>
        <div class="updata-button">
            <el-button type="primary" @click="addSeedling">添加控制器</el-button>
            <el-button type="primary" @click="saveSeedling('seedlingDetail')">保存</el-button>
            <el-button type="primary" @click="back">返回</el-button>
        </div>


    </div>
</template>
<script>
    import Editor from '@/components/ueditor/Edi'
    import { debounce } from '@/utils'

    export default {
        name: 'addController',
        components: {
            Editor,
        },
        data () {
            return {
                seedlingDetail: {
                    id: null,
                    area: '',
                    baseId: '',
                    coordinate: '',
                    macAddress: null,
                    massifId: null,
                    name: null,
                    waterNum: null,
                    position: null,
                    landOptions: []
                },
                seedlingArrays: [],
                rules: {
                    baseId: [{ required: true, message: '请选择基地', trigger: 'change' }],
                    massifId: [{ required: true, message: '请选择地块', trigger: 'change' }],
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
                    name: [{ required: true, message: '请输入控制器名称', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value.length > 10) {
                                    callback(new Error('最长10个汉字/字母/数字'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }],
                    waterNum: [{ required: true, message: '请输入滴头数', trigger: 'change' }],
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
                },
                showLocalDialog: false,
                coordinate: '',
                address: '',
                currentSeedingEdit: {
                    id: null,
                    area: '',
                    baseId: '',
                    coordinate: '',
                    macAddress: null,
                    massifId: null,
                    name: '',
                    waterNum: null,
                    position: '',
                    landOptions: []
                },
                CoordinateType: { controller: true, massif: false, nursery: false, }

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
                const res = await this.http.postJson(this.api.controller.saveController, params)
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
                        message: '新增成功!'
                    })
                    this.seedlingArrays = [{
                        id: null,
                        area: '',
                        baseId: '',
                        coordinate: '',
                        macAddress: null,
                        massifId: null,
                        name: '',
                        waterNum: null,
                        position: '',
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
                    //    alert('失败')
                    // this.$message({
                    //     type: 'error',
                    //     message: '请完善参数'
                    // })
                }
            },
            async getlandOptionByBaseId (baseId) {
                const res = await this.http.get(this.api.controller.getControllerDropDownList, {
                    flag: 2,
                    baseId,
                }, true)
                return !(res && res.code == 200 && res.data.list) ? [] : res.data.list
            },
            async changeBase (seedling) {
                seedling.landOptions = await this.getlandOptionByBaseId(seedling.baseId)
                seedling.land = ''

                // 清空地块
                seedling.massifId && (seedling.massifId = '')
            },
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.currentSeedingEdit.coordinate = coordinate && coordinate.toString()
                this.currentSeedingEdit.position = address
            },
            openSetMapAddress (item) {
                this.currentSeedingEdit = item
                this.showLocalDialog = true
            },
            back () {
                this.$router.go(-1)
            }
        },
        created () {
            this.addSeedling()
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

