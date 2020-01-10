<template>
    <div>
        <p class="total_time">合计： {{ totleTime }}</p>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row
        >
            <el-table-column
                prop="name"
                label="序号"
                width="100px"
            >
            </el-table-column>
            <el-table-column
                prop="massifName"
                label="设置时间"
                width="600px"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-time-picker
                        :disabled="isDisable(scope.row, scope.$index)"
                        @change="bindTime(scope.row, scope.$index)"
                        v-model="scope.row.time1"
                        format='HH:mm'
                        value-format="HH:mm"
                        placeholder="开始时间">
                    </el-time-picker>

                    <el-time-picker
                        :disabled="isDisable(scope.row, scope.$index)"
                        @change="bindTime(scope.row, scope.$index)"
                        v-model="scope.row.time2"
                        format='HH:mm'
                        value-format="HH:mm"
                        placeholder="结束时间">
                    </el-time-picker>
                </template>
            </el-table-column>
            <el-table-column
                prop="duration"
                label="设置时长"
                show-overflow-tooltip
            >
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: {
            value: {
                type: Array,
                default: () => {
                }
            },
        },
        data () {
            return {
                value2: '',
                value4: '',
                tableData: [
                    {
                        name: '设定1',
                        time1: '',
                        time2: '',
                        time: '',
                        duration: '',
                        isMaximum: 0,
                        startTime: '',
                        endTime: ''
                    }, {
                        name: '设定2',
                        time1: '',
                        time2: '',
                        time: '',
                        isMaximum: 0,
                        duration: '',
                        startTime: '',
                        endTime: ''
                    }, {
                        name: '设定3',
                        isMaximum: 0,
                        time1: '',
                        time2: '',
                        time: '',
                        duration: '',
                        startTime: '',
                        endTime: ''
                    }, {
                        name: '设定4',
                        time1: '',
                        time2: '',
                        time: '',
                        isMaximum: 0,
                        duration: '',
                        startTime: '',
                        endTime: ''
                    }, {
                        name: '设定5',
                        time1: '',
                        time2: '',
                        time: '',
                        isMaximum: 0,
                        duration: '',
                        startTime: '',
                        endTime: ''
                    },
                ],
                totleTime: ''
            }
        },
        methods: {
            bindTime (value, sIndex) {
                if ((value.time1 && !value.time2) || (!value.time1 && value.time2)) {
                    value.time = ''
                    sIndex < 4 ? this.clearTime(this.tableData[sIndex + 1]) : ''
                    this.setValue(value)
                    this.$emit('input', null)
                    return
                }

                if (!value.time1 && !value.time2) {
                    value.duration = null
                    value.time = ''
                    sIndex < 4 ? this.clearTime(this.tableData[sIndex + 1]) : ''
                    this.setValue(value)
                    return
                }

                if (!this.compareTime(value.time1, value.time2)) {
                    this.$message({
                        type: 'warning',
                        message: '结束时间应该晚于开始时间！'
                    })
                    value.duration = null
                    value.time = ''
                    value.time2 = ''
                    sIndex < 4 ? this.clearTime(this.tableData[sIndex + 1]) : ''
                    this.setValue(value)
                    this.$emit('input', null)
                    return
                }

                value.time = [value.time1, value.time2]
                const flag = this.tableData.every((ele, index) => {
                    if (sIndex === index) {
                        return true
                    }
                    if (ele.time && Array.isArray(ele.time)) {
                        return this.checkTime(value.time, ele.time)
                    }
                    return true
                })
                if (!flag) {
                    this.$message({
                        type: 'warning',
                        message: '您所选的时间有交叉，请重新选择！'
                    })
                    value.duration = null
                    value.time = ''
                    value.time1 = ''
                    value.time2 = ''
                    this.setValue(value)
                    return
                }
                sIndex < 4 ? this.clearTime(this.tableData[sIndex + 1]) : ''
                this.setValue(value)
            },
            checkTime (curTime, time) {
                // curTime 当前待检验的时间是否在 time范围中 两个时间都是时间段
                if (Array.isArray(curTime) && Array.isArray(time)) {
                    const startH = +time[0].split(':')[0]
                    const startM = +time[0].split(':')[1]
                    const endH = +time[1].split(':')[0]
                    const endM = +time[1].split(':')[1]

                    const curStartH = +curTime[0].split(':')[0]
                    const curstartM = +curTime[0].split(':')[1]
                    const curEndH = +curTime[1].split(':')[0]
                    const curEndM = +curTime[1].split(':')[1]

                    if (curEndH < startH) {
                        return true
                    }
                    if (curEndH === startH && curEndM <= startM) {
                        return true
                    }

                    if (curStartH > endH) {
                        return true
                    }
                    if (curStartH === endH && curstartM >= endM) {
                        return true
                    }

                    return false
                } else {
                    console.log('时间不合法')
                    return
                }
            },
            computed (time) {
                if (Array.isArray(time)) {
                    const startH = +time[0].split(':')[0]
                    const startM = +time[0].split(':')[1]
                    const endH = +time[1].split(':')[0]
                    const endM = +time[1].split(':')[1]

                    let hour, min
                    if (endH - startH > 0) {
                        let hour = endH - startH - 1
                        let min = 60 - startM + endM
                        if (min >= 60) {
                            hour += Math.floor(min / 60)
                            min = min % 60
                        }
                        return (hour > 0 ? hour + '小时' : '') + (min > 0 ? min + '分钟' : '')
                    }
                    if (endH - startH === 0) {
                        return endM - startM + '分钟'
                    }
                    if (endH - startH < 0) {
                        console.error('时间先后错误！')
                    }

                }
            },
            setValue (value) {
                value.duration = this.computed(value.time)
                value.startTime = (value.time && value.time[0] + ':00')
                value.endTime = (value.time && value.time[1] + ':00')
                const fmpGroupTime = []
                let hours = 0
                let mins = 0
                this.tableData.forEach(ele => {
                    if (ele.startTime) {
                        fmpGroupTime.push(ele)
                        const time = this.dealTime(ele.duration)
                        hours += time.hour
                        mins += time.min
                    }
                })
                if (mins >= 60) {
                    hours += (Math.floor(mins / 60))
                    mins = mins % 60
                }
                this.totleTime = (hours > 0 ? hours + '小时' : '') + (mins > 0 ? mins + '分钟' : '')
                const params = JSON.parse(JSON.stringify(fmpGroupTime))
                params.forEach(ele => {
                    delete ele.time
                    delete ele.time1
                    delete ele.time2
                })
                this.$emit('setHours', this.totleTime)

                this.$emit('input', params)
            },
            isDisable (data, index) {
                let flag = true
                if (index !== 4 && index !== 0 && this.tableData[index - 1].time && !this.tableData[index + 1].time) {
                    flag = false
                } else {
                    flag = true
                }

                if (index === 0 && !this.tableData[index + 1].time) {
                    flag = false
                }

                if (index === 4 && this.tableData[index - 1].time) {
                    flag = false
                }
                return flag
            },
            dealTime (timeStr) {
                if (typeof timeStr === 'string') {
                    let hour = 0
                    let min = 0
                    if (timeStr.indexOf('小时') !== -1) {
                        hour = +timeStr.split('小时')[0]
                    }
                    if (timeStr.indexOf('小时') !== -1 && timeStr.indexOf('分钟') !== -1) {
                        min = +timeStr.split('小时')[1].split('分钟')[0]
                    }
                    if (timeStr.indexOf('小时') === -1 && timeStr.indexOf('分钟') !== -1) {
                        min = +timeStr.split('分钟')[0]
                    }
                    return {
                        hour, min
                    }
                }
            },
            compareTime (time1, time2) {
                // 时分
                time1.split(':')[0]
                const timeH1 = +time1.split(':')[0]
                const timeM1 = +time1.split(':')[1]

                const timeH2 = +time2.split(':')[0]
                const timeM2 = +time2.split(':')[1]

                if (timeH1 < timeH2) {
                    return true
                }
                if (timeH1 === timeH2 && timeM1 < timeM2) {
                    return true
                }
                return false
            },
            clearTime (value) {
                value.duration = null
                value.time = null
                value.time1 = null
                value.time2 = null
            }
        }
    }
</script>
<style lang="scss" scoped>
    .total_time {
        text-align: right;
    }
</style>
