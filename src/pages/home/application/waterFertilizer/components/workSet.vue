<template>
    <div>
        <el-form ref="controls" :rules="rules" :model="controls" label-width="0px">

            <p class="workEnd-title">控制器信息</p>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                highlight-current-row
            >
                <el-table-column
                    prop="baseName"
                    label="基地名称"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="massifName"
                    label="地块名称"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="控制器名称"
                    show-overflow-tooltip
                >
                </el-table-column>
            </el-table>

            <p class="workEnd-title">灌溉周期</p>
            <el-form-item prop="yearsLimit">
                <el-date-picker
                    @change="setWorkDay"
                    v-model="controls.yearsLimit"
                    :picker-options="pickerOptions"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker> &nbsp;&nbsp;<span> 共计{{controls.workingHours}}天</span>
            </el-form-item>

            <p class="workEnd-title">间隔周期</p>
            <el-form-item prop="intervals">

                <el-select v-model="controls.intervals" placeholder="请选择">
                    <el-option
                        v-for="item in InterOption"
                        :key="item.sfKey"
                        :label="item.sfValue"
                        :value="item.sfKey">
                    </el-option>
                </el-select>
            </el-form-item>
            <br><br>
            <div>
                <el-form-item prop="isIrrigationWeekend">
                    <span class="workEnd-title"> 周末灌溉</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-radio-group v-model="controls.isIrrigationWeekend" @change="setFormValidate">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <br>
            <p class="workEnd-title">灌溉时段</p>
            <el-form-item prop="fmpGroupTime">
                <set-time v-model="controls.fmpGroupTime" @input="setFormValidate" @setHours="setTotleHours"></set-time>
            </el-form-item>
        </el-form>

        <div class="updata-button">
            <el-button type="info" @click="$emit('closeDialog')">取消</el-button>
            <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
    </div>
</template>
<script>
    import setTime from './setTime'

    function getWorkTime (start, end) {
        const times = new Date(end).getTime() - new Date(start).getTime()
        return times / (1000 * 60 * 60 * 24) + 1
    }

    export default {
        props: {
            data: {
                type: Array,
                default: () => {
                }
            }
        },
        components: {
            setTime
        },
        data () {
            return {
                tableData: [],
                yearsLimit: [],
                InterOption: [],
                radio: '',
                rules: {
                    yearsLimit: [
                        { required: true, message: '请输入周期', trigger: 'change' }
                    ],
                    intervals: [
                        { required: true, message: '请选择间隔', trigger: 'change' }
                    ],
                    isIrrigationWeekend: [
                        { required: true, message: '请选择是否周末灌溉', trigger: 'change' }
                    ],
                    fmpGroupTime: [
                        { required: true, message: '请正确填写灌溉周期', trigger: 'change' }
                    ]
                },
                controls: {
                    controllerIds: [],
                    endTime: '',
                    startTime: '',
                    workingHours: '0',
                    intervals: '',
                    yearsLimit: [],
                    isIrrigationWeekend: '',
                    setHours: null,
                    fmpGroupTime: []
                },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() <= (Date.now() - 1000 * 60 * 60 * 24)
                    }
                },
            }
        },
        created () {
            this.getIntervalPer()
            this.controls.controllerIds = this.data.map(ele => +ele.id)
            this.tableData = this.data
        },
        methods: {
            async getDropDownList (params) {
                const res = await this.http.get(this.api.controller.getDropDownList, params)
                if (res && res.code === 200) {
                    return res
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                    return null
                }
            },
            async getIntervalPer () {
                const data = await this.getDropDownList({
                    dicType: 'group_Interval_period'
                })
                if (data) {
                    this.InterOption = data.groupLntervalPeriods
                }
                return true
            },
            submitForm () {
                this.$refs['controls'].validate(validate => {
                    if (validate) {
                        this.saveGroup(this.preDealParams(this.controls))
                    }
                })
            },
            async saveGroup (params) {
                const res = await this.http.postJson(this.api.GroupControler.saveGroup, params)
                if (res && res.code === 200) {
                    if (res.bizCode && res.bizCode === 401) {
                        this.$message({
                            type: 'error',
                            message: res.bizMsg
                        })
                        return
                    } else if (res.bizCode && res.bizCode === 1001) {
                        this.$alert(res.bizMsg, '提示', {
                            confirmButtonText: '返回',
                            callback: action => {
                                this.$emit('closeDialog')
                                this.$emit('reloadTable')
                            },
                            showClose: false
                        })
                        return
                    }
                    this.$message({
                        type: 'success',
                        message: '设定成功'
                    })
                    this.$router.push('/home/waterFertilizer/workingGroup')
                    this.$emit('reloadTable')
                    this.$emit('closeDialog')
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            preDealParams (data) {
                const params = JSON.parse(JSON.stringify(data))
                params.startTime = params.yearsLimit[0]
                params.endTime = params.yearsLimit[1]
                delete params.yearsLimit
                params.orgId = this.$store.state.user.info.organizationId
                return params
            },
            setWorkDay (value) {
                if (!value) {
                    this.controls.workingHours = 0
                    return
                }
                this.controls.workingHours = getWorkTime(this.controls.yearsLimit[0], this.controls.yearsLimit[1])
            },
            setFormValidate () {
                this.$refs['controls'].validateField('fmpGroupTime')
            },
            setTotleHours (time) {
                this.controls.setHours = time
            }
        }
    }
</script>

<style lang="scss" scoped>
    .updata-button {
        margin-top: 1rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    .workEnd-title {
        font-size: 1.2rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        font-weight: 600;
    }

    .work-tips {
        font-size: 1.2rem;
        text-align: center;
    }

    //     /deep/  .el-date-editor .el-range-separator{
    //     line-height: 2.2rem;
    // }
    /deep/ .el-input__inner {
        height: auto !important;
    }
</style>
