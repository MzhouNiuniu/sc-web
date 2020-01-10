<template>
    <div>
        <el-form ref="landDetail" :rules="rules" :model="landDetail" label-width="140px">
            <p class="wrapper-title"><span>地块信息</span></p>
            <div class="content-wrapper">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="地块名称：" prop="name">
                            <el-input v-model="landDetail.name" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="面积（亩）：" prop="area">
                            <el-input v-model="landDetail.area" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="责任人：" prop="responsible">
                            <el-autocomplete
                                class="inline-input"
                                v-model="landDetail.responsible"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                @select="handleSelect"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="基地名称：" prop="baseId">
                            <BaseLandSelect
                                v-model="landDetail.baseId"
                                :name.sync="landDetail.baseName"
                                @change="handleBaseChange"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="位置：" prop="position">
                            <el-input v-model="landDetail.position" placeholder="请输入内容">
                                <el-button slot="append" @click="showLocalDialog = true"
                                           icon="el-icon-location-outline"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="坐标：">
                            <el-input :value="landDetail.coordinate" placeholder="请选择位置" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="地形：" prop="terrainKey">
                            <el-select v-model="landDetail.terrainKey" placeholder="请选择">
                                <el-option
                                    v-for="item in terrainOption"
                                    :key="item.sfValue"
                                    :label="item.sfValue"
                                    :value="item.sfKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="海拔：" prop="altitude">
                            <el-input v-model="landDetail.altitude" placeholder="请输入内容">
                                <span slot="append">m</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="土壤类型：">
                            <el-select v-model="landDetail.soilTypeKey" placeholder="请选择">
                                <el-option label="请选择" value=""/>
                                <el-option
                                    v-for="item in soilTypeOption"
                                    :key="item.sfValue"
                                    :label="item.sfValue"
                                    :value="item.sfKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="坡度：" prop="slope">
                            <el-input v-model="landDetail.slope" placeholder="请输入内容">
                                <template slot="append"> °</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <br>
            <p class="wrapper-title"><span>土地信息</span></p>
            <div class="content-wrapper">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="土地权属：" prop="landOwnershipKey">
                            <el-select v-model="landDetail.landOwnershipKey" placeholder="请选择">
                                <el-option
                                    v-for="item in landOwnerOption"
                                    :key="item.sfValue"
                                    :label="item.sfValue"
                                    :value="item.sfKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="土地来源：" prop="landSourceKey">
                            <el-select v-model="landDetail.landSourceKey" placeholder="请选择">
                                <el-option
                                    v-for="item in landSourcesOption"
                                    :key="item.sfValue"
                                    :label="item.sfValue"
                                    :value="item.sfKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="年限：" prop="yearsLimit">
                            <el-date-picker
                                v-model="landDetail.yearsLimit"
                                type="daterange"
                                range-separator="至"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="土地详情：" prop="landDetails">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="landDetail.landDetails">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <br>
            <p class="wrapper-title"><span>围栏信息</span></p>
            <div class="content-wrapper">
                <el-form-item label="电子围栏：">
                    <some-map
                        ref="someMap"
                        :coordinate="baseCoordinate"
                        :polygonPath="fmpMassifElectronic.coordinate"
                        @OpenEditMap="showlandSetDialog = true"
                    />
                </el-form-item>
            </div>
            <br>
            <p class="wrapper-title"><span>详细信息</span></p>
            <div class="content-wrapper">
                <el-form-item label="图片上传：" prop="picture">
                    <Multiple-upload-imgs :fileLimit="9" v-model="landDetail.picture"/>
                </el-form-item>

                <el-form-item label="地块详情：">
                    <el-row>
                        <el-col :span="16" style="margin-top: 16px;">
                            <el-col :span="12">
                                <el-form-item label="东至：" prop="east" label-width="80px">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="请输入内容"
                                        v-model="landDetail.east">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="南至：" prop="south" label-width="80px">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="请输入内容"
                                        v-model="landDetail.south">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <el-col :span="16" style="margin-top: 20px;">
                            <el-col :span="12">
                                <el-form-item label="西至：" prop="west" label-width="80px">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="请输入内容"
                                        v-model="landDetail.west">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="北至：" prop="north" label-width="80px">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="请输入内容"
                                        v-model="landDetail.north">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-form-item>
            </div>
        </el-form>
        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" :close-on-click-modal="false"
                   v-if="showLocalDialog">
            <locat-map @closeAndSave="saveAddress" :coordinate="landDetail.coordinate"
                       :CoordinateType="CoordinateType"></locat-map>
        </el-dialog>
        <el-dialog title="设置电子围栏" :visible.sync="showlandSetDialog" width="50%" :close-on-click-modal="false"
                   v-if="showlandSetDialog">
            <land-map-set
                @closeAndSave="savePolygon"
                :base-name="landDetail.baseName"
                :base-coordinate="baseCoordinate"
                :outPolygon="fmpMassifElectronic.coordinate"
                :outLandFencing="fmpMassifElectronic"
                :allPolygon="polygonPaths"
            />
        </el-dialog>
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <el-button :disabled="isDisabled" type="primary" @click="saveLandDetail">保存</el-button>
        </div>
    </div>
</template>
<script>
    const landDescribeLimit = {
        validator: (rules, value, callback) => {
            if (value && value.length > 100) {
                callback(new Error('最长100个汉字/字母/数字'))
            } else {
                callback()
            }
        }, trigger: 'change'
    }

    function getPathOption (pathArray) {
        return pathArray.map(element => {
            return [element.lng, element.lat]
        })
    }

    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import BaseLandSelect from '@/components/service/BaseLandSelect'
    import someMap from './component/map'
    import locatMap from '../SeedlingManagement/component/map'
    import landMapSet from './landMapSet'

    export default {
        components: {
            MultipleUploadImgs,
            BaseLandSelect,
            someMap,
            locatMap,
            landMapSet,
        },
        name: 'addland',
        data () {
            return {
                baseCoordinate: [], // 当前基地的位置，如果没有选择，则是公司位置

                terrainOption: [],
                landOwnerOption: [],
                landSourcesOption: [],
                soilTypeOption: [],
                rules: {
                    name: [
                        { required: true, message: '请输入地块名', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value.length > 10) {
                                    callback(new Error('最长10个字符！'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }],
                    area: [
                        { required: true, message: '请输入亩的数量', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                const res = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                                if (!res.test(value) || value > 999999999.99 || value < 1) {
                                    callback(new Error('最多保留两位小数，值范围在1-999999999.99之间'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    responsible: [{ required: true, message: '请选择责任人', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                const user = this.usersList.find(ele => ele.name === value)
                                if (user) {
                                    this.landDetail.memberCode = user.employee_id
                                    callback()
                                    return
                                }
                                callback(new Error('系统没有此责任人或者被删除'))
                            }, trigger: 'change'
                        }
                    ],
                    baseId: [{ required: true, message: '请选择基地', trigger: 'change' }],
                    position: [
                        { required: true, message: '请输入位置', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value.length > 50) {
                                    callback(new Error('长度小于等于50'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    terrainKey: [{ required: true, message: '请选择地形', trigger: 'change' }],
                    soilTypeKey: [{ required: true, message: '请选择土壤类型', trigger: 'change' }],
                    altitude: [
                        { required: true, message: '请输入海拔', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                const res = /^[0-9]+(\.[0-9]{1,2})?$/
                                if (!res.test(value) || value >= 10000) {
                                    callback(new Error('最多2位小数且最大值为9999.99'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    slope: [
                        {
                            validator: (rules, value, callback) => {
                                const res = /^[0-9]+([.][0-9]{1}){0,1}$/
                                if (value && !res.test(value) || value > 90) {
                                    callback(new Error('0-90，最多1位小数'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    landOwnershipKey: [
                        { required: true, message: '请选择土地权属', trigger: 'change' }
                    ],
                    landSourceKey: [
                        { required: true, message: '请选择土地来源', trigger: 'change' }
                    ],
                    yearsLimit: [
                        { required: true, message: '请输入年限', trigger: 'change' }
                    ],
                    landDetails: [
                        {
                            validator: (rules, value, callback) => {

                                if (value.length > 1000) {
                                    callback(new Error('最长1000个汉字/字母/数字'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    picture: [{
                        required: true, validator: (rules, value, callback) => {
                            if (!Array.isArray(value) || value.length === 0) {
                                callback(new Error('请上传图片！'))
                            } else {
                                callback()
                            }
                        }, trigger: 'blur'
                    }],
                    east: [landDescribeLimit],
                    south: [landDescribeLimit],
                    west: [landDescribeLimit],
                    north: [landDescribeLimit],

                },
                landDetail: {
                    name: '',
                    area: '',
                    responsible: '',
                    baseId: '',
                    baseName: '', // 提交时需要删除
                    position: '',
                    coordinate: '',
                    terrainKey: '',
                    altitude: '',
                    soilTypeKey: '',
                    slope: '',
                    landOwnershipKey: '',
                    landSourceKey: '',
                    yearsLimit: '',
                    yearsStart: '', // 开始年限
                    yearsEnd: '', // 结束年限
                    landDetails: '',
                    picture: [],
                    east: '',
                    south: '',
                    west: '',
                    north: ''
                },
                fmpMassifElectronic: {
                    coordinate: [],
                    description: '',
                    name: '',
                    type: '地块围栏'
                },
                usersList: [],
                isDisabled: false,
                landId: '',
                showLocalDialog: false, // 设置地块位置。
                showlandSetDialog: false,// 电子围栏的设置dailog
                polygonPaths: [],
                CoordinateType: { controller: false, massif: true, nursery: false, },
            }
        },
        methods: {
            handleBaseChange (item) {
                this.baseCoordinate = item.coordinate.split(',')
            },
            // 调接口
            getProcessedFromData () {
                const fmpMassif = JSON.parse(JSON.stringify(this.landDetail))
                // 对截至时间进行分割
                fmpMassif.yearsStart = fmpMassif.yearsLimit[0]
                fmpMassif.yearsEnd = fmpMassif.yearsLimit[1]
                delete fmpMassif.yearsLimit
                const array = fmpMassif.picture.map(ele => {
                    return ele.url
                })
                fmpMassif.picture = JSON.stringify(array)
                let fmpMassifElectronic = JSON.parse(JSON.stringify(this.fmpMassifElectronic))
                if (fmpMassifElectronic.name) {
                    fmpMassifElectronic.coordinate = getPathOption(fmpMassifElectronic.coordinate)
                    fmpMassifElectronic.coordinate = JSON.stringify(fmpMassifElectronic.coordinate)
                } else {
                    fmpMassifElectronic = null
                }

                fmpMassif.fmpMassifElectronic = fmpMassifElectronic
                return fmpMassif
            },
            saveLandDetail () {
                this.$refs.landDetail.validate(async (valid) => {
                    if (valid) {
                        const res = await this.http.postJson(this.api.Massif.addMassif, this.getProcessedFromData())
                        if (res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '新增成功！'
                            })
                            this.back()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    } else {
                        // this.$message({
                        //     type: 'warning',
                        //     message: '请完善信息'
                        // })
                    }
                })
            },
            saveAddress ({ address, coordinate }) {
                this.landDetail.position = address
                this.landDetail.coordinate = coordinate.toString()
                this.showLocalDialog = false
            },
            savePolygon (landFencing) {
                // if(landFencing) {
                this.fmpMassifElectronic = landFencing
                // }
                this.showlandSetDialog = false
            },
            querySearch (queryString, cb) {
                var usersList = this.usersList
                var results = queryString ? usersList.filter(this.createFilter(queryString)) : usersList
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            handleSelect (item) {
                this.landDetail.responsible = item.name
                this.landDetail.memberCode = item.employee_id
            },
            createFilter (queryString) {
                return (user) => {
                    return (user.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            // 获取责任人的列表
            async getUsersList () {
                const res = await this.http.get(this.api.Massif.getUsersList)
                if (res && res.code === 200) {
                    this.usersList = res.data.list
                    this.usersList.forEach(ele => {
                        ele.value = ele.name + `  ${ele.phone || ''}`
                    })
                }
            },
            async getDropDown () {
                const res = await this.http.get(this.api.Massif.dropDown, {})
                if (res && res.code === 200) {
                    this.terrainOption = res.data.terrain
                    this.landOwnerOption = res.data.landOwnership
                    this.landSourcesOption = res.data.landSource
                    this.soilTypeOption = res.data.soilType

                } else {
                    return []
                }
            },
            async jumpAddMassif () {
                let res = await this.http.get(this.api.Massif.jumpAddMassif)
                if (res.code !== 200) {
                    return
                }

                res = res.data.obj
                this.polygonPaths = res.fmpMassifElectronicList

                // 电子围栏默认展示地址
                res.defaultCoordinate = res.defaultCoordinate || this.$G_ORARO_COORDINATE
                this.handleBaseChange({
                    coordinate: res.defaultCoordinate
                })
            },
            back () {
                this.$router.replace('/home/landManagement')
            },
        },
        mounted () {
        },
        async created () {
            this.getUsersList()
            this.getDropDown()
            this.jumpAddMassif()
        }
    }
</script>
<style lang="scss" scoped>
    .updata-button {
        margin-top: 1rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    #container {
        width: 930px;
        height: 700px;
        display: inline-block;
    }

</style>
