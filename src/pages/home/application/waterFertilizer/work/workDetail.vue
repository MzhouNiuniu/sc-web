<template>
    <div>
        <el-form ref="seedlingDetail" :rules="rules" :model="seedlingDetail" label-width="140px">
            <p class="wrapper-title"><span>控制器信息</span></p>
            <div class="content-wrapper">
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
                        <el-form-item label="状态：">
                            <span>{{seedlingDetail.stateName}}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="坐标：">
                            <div>
                                <span>{{seedlingDetail.coordinate}}</span> &nbsp;
                            </div>
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
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="MAC地址：">
                                    <!-- mac地址 -->
                                    <span>{{seedlingDetail.macAddress}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>


                    <el-col :span="10">
                        <el-form-item label="位置：" prop="position">
                            {{seedlingDetail.position}}
                            <!--                            <el-input v-model="seedlingDetail.position" placeholder="请输入内容">-->
                            <!--                                <el-button slot="append" @click="showLocalDialog = true"-->
                            <!--                                           icon="el-icon-location-outline"></el-button>-->
                            <!--                            </el-input>-->
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>

        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" v-if="showLocalDialog"
                   :close-on-click-modal="false">
            <locat-map @closeAndSave="saveAddress" :coordinate="coordinate"
                       :CoordinateType="CoordinateType"></locat-map>
        </el-dialog>
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <!--            <el-button type="primary" :disabled="isEdit" @click="saveSeedling('seedlingDetail')">保存</el-button>-->
        </div>
        <br>
        <p class="wrapper-title"><span>设定记录</span></p>
        <div class="content-wrapper">
            <section>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                >
                    <el-table-column
                        show-overflow-tooltip
                        v-for="(item, index) in showKeys "
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width?item.width:'auto'"
                    >
                        <template slot-scope="{row}">
                            <!-- if，为空，展示 /-->
                            <!-- else，如果是0就展示0，否则原样展示-->
                            <span v-if=" !(item.key === 'fmpGroupTime' || item.key === 'intervalsName')">
                                {{ (row[item.key] === 0 ? '0' : row[item.key]) || '/'}}
                            </span>
                            <div v-if="item.key === 'fmpGroupTime' || item.key === 'intervalsName'"
                                 v-html="(row[item.key] === 0 ? '0' : row[item.key]) || '/'">
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination :totalNum="total" :currentPage="params.pageNo" @handleCurrentChange="handleCurrentChange">
                </pagination>
            </section>
        </div>
    </div>
</template>
<script>
    // 当前页面的Seedling 对象吗，从苗木那边复制过来，暂时没有更改，不影响功能，可将Seedling默认相当于控制器。
    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import locatMap from '@/pages/home/assetManagement/SeedlingManagement/component/map'
    import { singleImgByName } from '@/utils/downImgsZip.js'
    import pagination from '@/components/pagination/pagination.vue'

    // 3545 根据产品新需求，水肥作业进入的控制器信息页面，不支持编辑各字段，pc和APP保持一致
    // 编辑只是注释掉了
    export default {
        components: { MultipleUploadImgs, locatMap, pagination },
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
                rules: {
                    position: [{
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
                CoordinateType: { controller: true, massif: false, nursery: false, },
                tableData: [],
                showKeys: [
                    {
                        name: '作业组编号',
                        key: 'groupNumber',
                        width: '220px'
                    }, {
                        name: '设定时间',
                        key: 'setTime',
                        width: '180px'
                    }, {
                        name: '灌溉周期',
                        key: 'IrrigationCycle',
                        width: '200px'
                    }, {
                        name: '间隔周期',
                        key: 'intervalsName',
                        width: '120px'
                    }, {
                        name: '灌溉时段',
                        key: 'fmpGroupTime',
                        width: '200px'
                    }, {
                        name: '设定人',
                        key: 'memberName',
                        width: ''
                    }, {
                        name: '设定人工号',
                        key: 'memberJobNumber',
                        width: '120px'
                    }, {
                        name: '工作时长',
                        key: 'workHours',
                        width: ''
                    }, {
                        name: '灌溉量（L）',
                        key: 'irrigationNum',
                        width: '120px'
                    }, {
                        name: '备注',
                        key: 'stateName',
                        width: '120px'
                    },
                ],
                params: {
                    controllerId: '',
                    pageNo: 1,
                    pageSize: 8
                },
                total: 0,
                isEdit: false,
            }
        },
        methods: {
            saveAddress ({ address, coordinate }) {
                this.showLocalDialog = false
                this.seedlingDetail.coordinate = coordinate.toString()
                this.coordinate = coordinate.toString()
                this.seedlingDetail.position = address
            },
            saveSeedling (name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        const params = {
                            id: this.seedlingDetail.id,
                            coordinate: this.seedlingDetail.coordinate,
                            position: this.seedlingDetail.position
                        }
                        // const params = JSON.parse(JSON.stringify(this.seedlingDetail));

                        this.updateController(params)
                    } else {

                    }
                })
            },
            // 获取详情
            async getControllerInfo (params) {
                const res = await this.http.get(this.api.GroupControler.getGroupControllerSettingInfo, params)
                if (res && res.code === 200) {
                    if (res.bizCode && res.bizCode === 1001) {
                        this.$alert(res.bizMsg, '提示', {
                            confirmButtonText: '返回',
                            callback: action => {
                                this.$router.go(-1)
                            },
                            showClose: false
                        })
                        return
                    }
                    const seedlingDetail = res.data.obj
                    this.coordinate = seedlingDetail.coordinate

                    const tableData = seedlingDetail.fmpControllerSettingRecordsPageResult.list
                    tableData.forEach(ele => {
                        ele.IrrigationCycle = (ele.startTime && ele.endTime) ? ele.startTime + '--' + ele.endTime : null
                        ele.fmpGroupTime = ''
                        ele.fmpGroupTimeList.forEach(item => {
                            ele.fmpGroupTime += `${item.name}: ${item.startTime} - ${item.endTime} <br>`
                        })
                        ele.intervalsName = ele.intervalsName ? ele.intervalsName + `<br> ${ele.isIrrigationWeekend === 1 ? '周末灌溉' : '周末不灌溉'}` : ''
                    })
                    this.tableData = tableData
                    this.seedlingDetail = seedlingDetail

                    this.total = +this.seedlingDetail.fmpControllerSettingRecordsPageResult.total
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
                    this.$alert(res.message, '提示', {
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
                this.$router.go(-1)
            },
            init () {
                this.seedlingId = this.$route.query.id
                this.params.controllerId = this.seedlingId
                this.getControllerInfo(this.params)
            },
            handleCurrentChange (val) {
                this.params.pageNo = val
                this.getControllerInfo(this.params)
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
