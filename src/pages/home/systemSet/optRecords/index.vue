<template>
    <div>
        <p class="wrapper-title"><span>操作记录</span></p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-select v-model="params.operateObj" placeholder="请选择操作对象" @change="changeSelect" class="input-with-select">
                        <el-option
                        v-for="item in operateOption"
                        :key="item.sf_value"
                        :label="item.name"
                        :value="item.sf_value">
                        </el-option>
                    </el-select>
                     <el-date-picker
                    v-model="yearsLimit"
                    type="daterange"
                    range-separator="至"
                    @change="changeTime"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                     <el-input placeholder="搜索操作类型" v-model="operateType" class="input-with-select">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
                <div class="option-button">
                    <el-button v-allow="'oper-record-export'" type="primary" @click="downExcel" >
                            导出列表
                    </el-button>
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
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                        type="index"
                        width="50"
                        :index="indexMethod"
                        >
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    v-for="(item, index) in showKeys "
                    :key="index"
                    :label="item.name"
                    :prop="item.key"
                    :width="item.width?item.width:'auto'"
                    >
                    <template slot-scope="scope" >
                        <span @click="handleCurrentTableRow(scope.row)" class="clickATag" v-if="item.key === 'number'"> {{scope.row.number || '/'}}</span>
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
import { toExcel } from '@/utils/excel.js'
export default {
    components: {
        pagination
    },
    data() {
        return {
            total: 0,
            massifId: '',
            operateOption: {
            },
            params: {
                operateObj: '',
                endTime: '',
                startTime: '',
                pageNo: 1,
                pageSize: 8,
                operateType: ''
            },
            yearsLimit: [],
            operateType: '',
            tableData: [],
            selectOpt: [],
            showKeys: [
                    {
                        name: '时间',
                        key: 'createTime',
                        width: ''
                    },
                    {
                        name: '用户',
                        key: 'memberName',
                        width: ''

                    },{
                        name: '操作对象',
                        key: 'operateObj',
                        width: ''

                    },{
                        name: '操作类型',
                        key: 'operateType',
                        width: ''

                    },
                    {
                        name: '类型',
                        key: 'type',
                        width: '',
                    }
            ],
        }
    },
    methods: {
        changeSelect() {
            this.params.pageNo = 1;
            this.getLogList(this.params);
        },
        searchKey() {

            this.params.operateType = this.operateType;
            this.params.pageNo = 1;
            this.getLogList(this.params);
        },
        changeTime() {
            this.params.startTime = this.yearsLimit && this.yearsLimit[0];
            this.params.endTime = this.yearsLimit && this.yearsLimit[1];
            this.params.pageNo = 1;
            this.getLogList(this.params);
        },
        async getSelectData() {
            const res = await this.http.get(this.api.system.getSelectData, {});
            if(res && res.code === 200) {
                this.operateOption = res.data.list;
                this.operateOption.forEach(ele => {
                    ele.name = ele.sf_value;
                })
                this.operateOption.unshift({
                    sf_value: '',
                    name: '请选择操作对象'
                })
            }
        },
        handleSelectionChange(value) {
            this.selectOpt = value;
        },
        indexMethod(index) {
            const num = this.params.pageNo;
            return (num - 1) * 8 + index + 1;
        },
        handleCurrentTableRow(currentRow) {
            // this.$router.push({
            //     path: '/home/seeOrEditContorller',
            //     query: {
            //         id: currentRow.id
            //     }
            // })
        },
        handleCurrentChange(value) {
            this.params.pageNo = value;
            this.getLogList(this.params);
        },
        async getLogList(params) {
            const res = await this.http.postJson(this.api.system.getLogList, params);
            if(res && res.code === 200) {
                this.tableData = res.data.logList;
                this.total = +res.data.count;
            }
        },
        // 导出excel
        async downExcel() {
            const ids = this.selectOpt.length > 0? this.selectOpt.map(ele => ele.id): null;
            const otherparam = Object.assign({
                 operateType: '', operateObj: '', startTime: '',
                endTime: '',
            }, this.params);
            otherparam.operateType = this.operateType;
            delete otherparam.pageNo;
            delete otherparam.pageSize;
            const res = await this.http.postJson(this.api.system.exportLog, {
                ids, ...otherparam
            });
            let excelData = null;
            if(res && res.code === 200) {
                 excelData = res.data.list || [];
                 excelData.forEach((ele, index) => {
                     ele.index = index + 1
                 })
            } else {
                this.$message({
                    type: 'error',
                    message: res.message
                })
                return
            }
            const th = [ '序号','时间','用户', '操作对象', '操作类型', '类型'];
            const filterVal = ['index','createTime','memberName', 'operateObj', 'operateType', 'type'];
            const data = excelData.map(v => filterVal.map(k => v[k]))
            const [fileName, fileType, sheetName] = ['操作记录', 'xlsx', '操作记录']
            toExcel({th, data, fileName, fileType, sheetName})
        },
    },
    created() {
        this.getSelectData();
        this.getLogList(this.params);
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
    .input-with-select{
        margin-right: 1rem;
        width: 15rem;
    }
    /deep/  .el-date-editor .el-range-separator, /deep/ .el-date-editor .el-range__close-icon, /deep/ .el-date-editor .el-range__icon{
    line-height: 2.2rem;
}

</style>
