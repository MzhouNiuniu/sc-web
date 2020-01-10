<template>
    <div>
        <el-form ref="landDetail" :rules="rules" :model="landDetail" label-width="140px">
            <p class="wrapper-title"><span>地块信息</span></p>
            <div class="content-wrapper">
                <div class="QRCode" :style="{'backgroundImage': 'url('+landDetail.qrCode1Url + ')' }">
                    <span @click="saveQRcode" class="saveQRImg">保存图片 </span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="地块编号：">
                            <span style="color: #606266;">{{landDetail.number}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
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
                            ></el-autocomplete>
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
                        <el-form-item label="坐标：" prop="coordinate">
                            {{landDetail.coordinate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="地形：" prop="terrainKey">
                            <el-select v-model="landDetail.terrainKey" placeholder="请选择">
                                <el-option
                                    v-for="item in terrainOption"
                                    :key="item.sfKey"
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
                                <span slot="append">°</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <br>
            <div v-if="landDetail.nurseryStockList && landDetail.nurseryStockList.length > 0">
                <p class="wrapper-title"><span>苗木信息</span></p>
                <div class="content-wrapper">
                    <div v-for="(seedling, index) in landDetail.nurseryStockList" :key="index">
                        <p class="treeTitle"> {{seedling.nurseryStockName}}</p>
                        <!-- 这里将会用到嵌套表单循环表单 -->
                        <el-form ref="seedlingDetail" :rules="seedlingRules" :model="seedling" label-width="140px">
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="种植数量：">
                                        <span>{{seedling.plantNum}} 棵</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="预计年产量：" prop="plan">
                                        <el-input v-model="seedling.plan" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="实际年产量：" prop="actual">
                                        <el-input v-model="seedling.actual" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div v-if="landDetail.nurseryStockList && landDetail.nurseryStockList.length === 0">
                        暂无苗木
                    </div>
                </div>
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
                                    :key="item.sfKey"
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
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <el-button v-allow="'massif-update'" type="primary" @click="saveEdit('landDetail')">保存修改</el-button>
        </div>
        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" :close-on-click-modal="false"
                   v-if="showLocalDialog">
            <locat-map @closeAndSave="saveAddress" :coordinate="coordinate"
                       :CoordinateType="CoordinateType"></locat-map>
        </el-dialog>
        <el-dialog title="设置电子围栏" :visible.sync="showlandSetDialog" width="50%" v-if="showlandSetDialog"
                   :close-on-click-modal="false">
            <land-map-set
                @closeAndSave="savePolygon"
                :base-name="landDetail.baseName"
                :base-coordinate="baseCoordinate"
                :outPolygon="fmpMassifElectronic.coordinate"
                :outLandFencing="fmpMassifElectronic"
                :allPolygon="polygonPaths"
            />
        </el-dialog>
    </div>
</template>
<script>
    /**
     * some-map、land-map-set两个组件有坑（引用数据类型- -）
     * */
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
            return [element[0], element[1]]
            return [element.lng, element.lat]
        })
    }

    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import BaseLandSelect from '@/components/service/BaseLandSelect'
    import { singleImgByName } from '@/utils/downImgsZip.js'
    import locatMap from '../SeedlingManagement/component/map'
    import someMap from './component/map'
    import landMapSet from './landMapSet'
    import { setOptionLog } from '../util/index'

    export default {
        components: {
            MultipleUploadImgs,
            BaseLandSelect,
            someMap,
            locatMap,
            landMapSet
        },
        name: 'seeOrEditLand',
        data () {
            return {
                baseCoordinate: [],  // 当前基地的位置（编辑页面会把新增时的基地坐标带出）

                terrainOption: [],
                soilTypeOption: [],
                landOwnerOption: [],
                landSourcesOption: [],
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

                                if (value && value.length > 1000) {
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
                        }, trigger: 'change'
                    }],
                    east: [landDescribeLimit],
                    south: [landDescribeLimit],
                    west: [landDescribeLimit],
                    north: [landDescribeLimit],
                    plan: [{ required: true, message: '预计产量不能为空' },
                        { type: 'number', message: '预计产量只能填写数字' }],
                    actual: [{ required: true, message: '实际产量不能为空' },
                        { type: 'number', message: '实际产量只能填写数字' }]

                },
                seedlingRules: {
                    plan: [
                        {
                            validator: (rules, value, callback) => {
                                const res = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                                if (value !== '0' && value && (!res.test(value) || value > 999999999.99 || value < 0)) {
                                    callback(new Error('最多保留两位小数，值范围在0-999999999.99之间数值'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    actual: [
                        {
                            validator: (rules, value, callback) => {
                                const res = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                                if (value !== '0' && value && (!res.test(value) || value > 999999999.99 || value < 0)) {
                                    callback(new Error('最多保留两位小数，值范围在0-999999999.99之间数值'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ]
                },
                landDetail: {
                    name: '',
                    area: '',
                    responsible: '',
                    baseId: '',
                    position: '',
                    coordinate: '',
                    terrainKey: '',
                    altitude: '',
                    soilTypeKey: '',
                    slope: '',
                    landOwnershipKey: '',
                    landSourceKey: '',
                    yearsLimit: [],
                    yearsStart: '', // 开始年限
                    yearsEnd: '', // 结束年限
                    landDetails: '',
                    picture: [],
                    east: '',
                    south: '',
                    west: '',
                    north: '',
                    fmpMassifElectronic: null,
                    nurseryStockList: null
                },
                landId: '',
                seedlings: [
                    {
                        preYield: '',
                        trueYield: ''
                    }
                ],
                showLocalDialog: false,
                showlandSetDialog: false,
                usersList: [],
                fmpMassifElectronic: {
                    coordinate: [],
                    description: '',
                    name: '',
                    type: '地块围栏'
                },
                polygonPaths: [],
                coordinate: [],
                CoordinateType: { controller: false, massif: true, nursery: false, },
            }
        },
        methods: {
            handleBaseChange (item) {
                this.baseCoordinate = item.coordinate.split(',')
            },
            saveEdit (name) {
                // 验证苗木表单
                this.$refs[name].validate(async valid => {
                    // 里面苗木的就没过
                    let flag = true
                    if (this.$refs['seedlingDetail'] && Array.isArray(this.$refs['seedlingDetail'])) {
                        this.$refs['seedlingDetail'].forEach(ele => {
                            ele.validate(valid => {
                                if (!valid) {
                                    flag = false
                                }
                            })
                        })
                    } else if (this.$refs['seedlingDetail'] && typeof this.$refs['seedlingDetail'] === 'object') {
                        this.$refs['seedlingDetail'].validate(valid => {
                            if (!valid) {
                                flag = false
                            }
                        })
                    }

                    if (valid && flag) {
                        const res = await this.http.postJson(this.api.Massif.updateMassif, this.beforeSaveGetparams())
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
                            this.$alert('该地块不存在，请返回列表，重新选择', '提示', {
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
                    }
                })
            },
            beforeSaveGetparams () {
                const fmpMassif = JSON.parse(JSON.stringify(this.landDetail))
                // 对截至时间进行分割
                fmpMassif.yearsStart = fmpMassif.yearsLimit[0]
                fmpMassif.yearsEnd = fmpMassif.yearsLimit[1]
                delete fmpMassif.yearsLimit
                const array = fmpMassif.picture.map(ele => {
                    return ele.url
                })
                fmpMassif.nurseryStockList && fmpMassif.nurseryStockList.forEach(ele => {
                    ele.plan = ele.plan ? ele.plan : 0
                    ele.actual = ele.actual ? ele.actual : 0

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
            saveQRcode () {
                const data = {
                    url: this.landDetail.qrCode1Url,
                    name: this.landDetail.qrCode1Name
                }
                singleImgByName(data)
                setOptionLog('地块管理', '保存二维码')
            },
            async getDropDown () {
                const res = await this.http.get(this.api.Massif.dropDown, {})
                if (res && res.code === 200) {
                    this.terrainOption = res.data.terrain
                    this.landOwnerOption = res.data.landOwnership
                    this.landSourcesOption = res.data.landSource
                    this.soilTypeOption = res.data.soilType
                    return true
                } else {
                    return []
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
            saveAddress ({ address, coordinate }) {
                this.landDetail.position = address
                this.landDetail.coordinate = coordinate.toString()
                this.coordinate = coordinate.toString()
                this.showLocalDialog = false
            },
            // 查看地块信息
            async lookMassif (id) {
                const res = await this.http.get(this.api.Massif.lookMassif, {
                    id
                })
                if (res && res.code === 200) {
                    Object.assign(this.landDetail, res.data.obj)

                    // 更新基地位置
                    this.handleBaseChange({
                        coordinate: this.landDetail.baseCoordinate
                    })

                    // 所有的电子围栏
                    if(res.data.fmpMassifElectronicList){
                        this.polygonPaths = res.data.fmpMassifElectronicList
                    }

                    // 当前地块的电子围栏
                    if (this.landDetail.fmpMassifElectronic) {
                        this.landDetail.fmpMassifElectronic.coordinate = JSON.parse(this.landDetail.fmpMassifElectronic.coordinate)
                        this.fmpMassifElectronic = this.landDetail.fmpMassifElectronic
                    }

                    this.landDetail.yearsLimit = [this.landDetail.yearsStart, this.landDetail.yearsEnd]
                    const imgUrls = this.landDetail.picture && JSON.parse(this.landDetail.picture)
                    this.landDetail.picture = imgUrls && imgUrls.map(img => {
                        return {
                            url: img
                        }
                    })

                    this.coordinate = this.landDetail.coordinate

                    this.$refs['landDetail'].validate(val => {
                    })
                } else if (res && res.code === 1001) {
                    this.$alert('该地块不存在，请返回列表，重新选择', '提示', {
                        confirmButtonText: '返回',
                        callback: action => {
                            this.$router.go(-1)
                        },
                        showClose: false
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '错误，请联系管理员！'
                    })
                }
            },
            querySearch (queryString, cb) {
                var usersList = this.usersList
                var results = queryString ? usersList.filter(this.createFilter(queryString)) : usersList
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            createFilter (queryString) {
                return (user) => {
                    return (user.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            handleSelect (item) {
                this.landDetail.responsible = item.name
                this.landDetail.memberCode = item.employee_id
            },
            savePolygon (landFencing) {
                if (landFencing) {
                    this.fmpMassifElectronic = landFencing
                }
                this.showlandSetDialog = false
            },
            init () {
                this.landId = this.$route.query.id
                if (this.landId) {
                    this.lookMassif(this.landId)
                }
            },
            back () {
                this.$router.go(-1)
            },
        },
        created () {
            this.getDropDown()
            this.getUsersList().then(() => {
                this.init()
            })
        },
    }
</script>
<style lang="scss" scoped>
    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

    .treeTitle {
        font-weight: 600;
        font-size: 18px;
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
        background-size: 100% 100%;
        background-repeat: no-repeat;
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
