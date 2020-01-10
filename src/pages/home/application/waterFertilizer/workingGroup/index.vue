<template>
    <div>
        <p class="wrapper-title"><span>作业组列表</span></p>

        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                    <div>
                        <el-date-picker
                                    class="modify-timePick"
                                    v-model="setTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="设定开始"
                                    end-placeholder="设定结束"
                                    value-format="yyyy-MM-dd"
                                    @change="changeTime('setTime')"
                                   >
                        </el-date-picker>
                         &nbsp; &nbsp;
                        <el-date-picker
                        class="modify-timePick"
                        v-model="yearsLimit"
                        type="daterange"
                        range-separator="至"
                        @change="changeTime('yearsLimit')"
                        value-format="yyyy-MM-dd"
                        start-placeholder="灌溉开始"
                        end-placeholder="灌溉结束">
                    </el-date-picker>
                    &nbsp; &nbsp;
                    <el-tooltip class="item" effect="dark" content="请输入作业组编号/设定人/设定人工号" placement="top-start">
                        <el-input placeholder="请输入作业组编号/设定人/设定人工号" v-model="keywords" class="input-with-select">
                            <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-tooltip>
                    <el-select v-model="params.stateKey" placeholder="请选择状态" @change="changeSelect" class="input-with-select">
                        <el-option
                        v-for="item in statusOpt"
                        :key="item.stateKey"
                        :label="item.stateName"
                        :value="item.stateKey">
                        </el-option>
                    </el-select>
                    <el-select v-model="params.intervalPeriod" placeholder="请选择间隔周期" @change="changeSelect" class="input-with-select">
                        <el-option
                        v-for="item in intervalOpt"
                        :key="item.sfKey"
                        :label="item.sfValue"
                        :value="item.sfKey">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <br>
            <section>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                    >
                    <el-table-column
                        type="index"
                        width="50"
                        :index="indexMethod"
                        >
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    v-for="(item, index) in showKeys"
                    :key="index"
                    :label="item.name"
                    :prop="item.key"
                    :width="item.width?item.width:'auto'"
                    >
                    <template slot-scope="scope" >
                        <span @click="handleCurrentTableRow(scope.row)" class="clickATag" v-if="item.key === 'number'"> {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                        <span v-else > {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                    </template>
                    </el-table-column>
                </el-table>
                <pagination :totalNum = "total" :currentPage="params.pageNo" @handleCurrentChange="handleCurrentChange">
                </pagination>
            </section>
        </div>

    </div>
</template>
<script>
import pagination from '@/components/pagination/pagination.vue'
import { checkPageLimit } from '@/utils'
import workEnd from '../components/workEnd'
import workSet from '../components/workSet'

export default {
    components: {
        pagination,workEnd, workSet
    },
    data() {
        return {
            keywords: null,
            tableData: [],
            yearsLimit: null,
            setTime: '',
            params: {
                stateKey: null,
                intervalPeriod: null,
                setStartTime: null,
                setEndTime: null,
                periodStartTime: null,
                periodEndTime: null,
                keywords: null,
                pageNo: 1,
                pageSize: 8
            },
            showKeys: [
                {
                    name: '作业组编号',
                    key: 'number',
                    width: '220px'
                },{
                    name: '设定时间',
                    key: 'createTime',
                    width: '180px'
                },{
                    name: '灌溉周期',
                    key: 'IrrigationCycle',
                    width: '200px'
                },
                {
                    name: '间隔周期',
                    key: 'intervalsName',
                    width: '200px'
                },{
                    name: '设定人',
                    key: 'memberName',
                    width: ''
                },{
                    name: '设定人工号',
                    key: 'memberJobNumber',
                    width: ''
                },{
                    name: '备注',
                    key: 'stateName',
                    width: ''
                }
            ],
            total: 0,
            statusOpt: [],
            intervalOpt: [],
        }
    },
    created() {
        this.getGroupList(this.params);
        this.getIntervalOpt();
        this.getStatusOpt();
    },
    methods: {
        searchKey() {
            this.params.keywords = this.keywords;
            this.params.pageNo = 1;
            this.getGroupList(this.params);
        },
        changeTime(key) {
            if(key === 'setTime') {
                this.params.setStartTime = this.setTime && this.setTime[0];
                this.params.setEndTime = this.setTime && this.setTime[1];
            } else if( key === 'yearsLimit') {
                this.params.periodStartTime = this.yearsLimit && this.yearsLimit[0];
                this.params.periodEndTime = this.yearsLimit && this.yearsLimit[1];
            }
            this.params.pageNo = 1;
            this.getGroupList(this.params);
        },
        indexMethod(index) {
            const num = this.params.pageNo;
            return (num - 1) * 8 + index + 1;
        },
        handleCurrentChange(val) {
            this.params.pageNo = val;
            this.getGroupList(this.params);
        },
        changeSelect() {
             this.params.pageNo = 1;
             this.getGroupList(this.params);
        },
        // 点击查看列表
        handleCurrentTableRow(currentRow) {
            this.$router.push({
                path: '/home/waterFertilizer/workingGroupDetail',
                query: {
                    id: currentRow.id
                }
            })
        },
        async getDropDownList(params) {
            const res = await this.http.get(this.api.controller.getDropDownList, params);
            if(res && res.code === 200) {
                return res;
            } else {
                this.$message({
                    type: 'error',
                    message: res.message
                })
                return null
            }
        },
        // 获取间隔周期
        async getIntervalOpt() {
            const data = await this.getDropDownList({
                dicType: 'group_Interval_period'
            });
            if(data) {
                this.intervalOpt = data.groupLntervalPeriods;
                this.intervalOpt.unshift({
                    sfKey: null,
                    sfValue: '请选择间隔周期'
                })
            }
            return true
        },
        // 获取状态下拉
        async getStatusOpt() {
            const data = await this.getDropDownList({
                type: 'group'
            });
            if(data) {
                this.statusOpt = data.stateList;
                this.statusOpt.unshift({
                    stateKey: null,
                    stateName: '请选择状态'
                })
            }
            return true
        },
        // 获取list
        async getGroupList(params) {
            const res = await this.http.postJson(this.api.GroupControler.getGroupList, params);
            if(res && res.code === 200) {
                this.tableData = res.data.obj.list;
                this.total = +res.data.obj.total;
                this.tableData.forEach(ele => {
                    ele.IrrigationCycle = ele.startTime + '---' + ele.endTime;
                    })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.searchAndButtonBox{
        display: flex;
        justify-content: space-between;
        > div{
            display: flex;
            justify-content: space-between;
        }
    }

    .input-with-select{
        margin-right: 1rem;
        width: 15rem;
    }

    .option-button{
        display: block !important;
    }
    /deep/ .el-input__inner{
        height: 2.75rem;
        line-height: 2.75rem;
        // font-size: 0.8rem;
        // font-size: 1rem;
    }
    /deep/ .el-button{
        // font-size: 0.8rem;
        padding: 0.75rem 1.25rem;
    }
    .updata-button{
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
}
.clickATag{
        cursor: pointer;
        text-decoration: underline;
    }
    .modify-timePick{
       width: 20rem;
   }
</style>
<style scoped>
/deep/  .el-date-editor .el-range-separator, /deep/ .el-date-editor .el-range__close-icon, /deep/ .el-date-editor .el-range__icon{
    line-height: 2.2rem;
}

</style>
