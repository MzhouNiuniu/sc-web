<template>
    <div>
        <p class="wrapper-title"><span>变更管理列表</span></p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="请输入编码" v-model="number" class="input-with-select modify_input">
                        <el-button slot="append" icon="el-icon-search" @click="searchKeyWord"></el-button>
                    </el-input>
                    <el-date-picker
                    class="modify-timePick"
                    v-model="timeRange"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="changeTime"
                    end-placeholder="结束日期">
                    </el-date-picker>
                    &nbsp; &nbsp;
                    <el-select v-model="params.type" placeholder="请选择" @change="changeSelect(1, params.type)" class="input-with-select">
                        <el-option
                        v-for="item in changeTypeOpt"
                        :key="item.sfKey"
                        :label="item.sfValue"
                        :value="item.sfKey">
                        </el-option>
                    </el-select>
                    <el-select v-model="params.modeKey" placeholder="请选择" @change="changeSelect(2, params.modeKey)" class="input-with-select">
                        <el-option
                        v-for="(item, index) in changeResOpt"
                        :key="index"
                        :label="item.sfValue"
                        :value="item.sfKey">
                        </el-option>
                    </el-select>
                    <el-select v-model="params.massifId" placeholder="请选择" @change="changeSelect(3, params.massifId)" class="input-with-select">
                        <el-option
                        v-for="(item, index) in landOption"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="option-button">
                    <el-button  v-allow="'change-export'"  type="primary"  @click="downExcel">导出</el-button>
                    <el-button  v-allow="'change-setListColumns'"  type="primary"  @click="changeColShowVisible = true">设置列表字段</el-button>
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
             <el-dialog title="设置列显示" :visible.sync="changeColShowVisible" width="50%"  v-if="changeColShowVisible" :close-on-click-modal = "false">
                <dragger @closeDialog="changeColShowVisible = false" :allLabels="allLabels" :showLength="7" v-model="showKeys"></dragger>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import pagination from '@/components/pagination/pagination.vue'
import dragger from '@/components/changeTableCol/dragger.vue'
import { toExcel } from '@/utils/excel.js'
import { checkPageLimit } from '@/utils'
// 单个二维码下载和批量二维码下载。 传入对应的url
import axios from 'axios'
export default {
    components: {
        pagination, dragger
    },
    // name: 'modify',
    data() {
        return {
            downTemplate: 'static/template/苗木信息批量录入模版.xls',
            params: {
                pageNo: 1,
                pageSize: 8,
                startTime: '',
                endTime: '',
                massifId: '',
                modeKey: '',
                type: '',
                number: ''
            },
            timeRange: '',
            number: '',
            changeTypeOpt: [],
            changeResOpt: [],
            landOption: [
                    ],
            tableData: [
                    ],
            total: 200,
            selectSeedlings: [], // 被选中的苗木信息
            changeColShowVisible: false,
            allLabels:[
                {
                    name: '编码',
                    key: 'number',
                    width: '180px'

                },{
                    name: '名称',
                    key: 'name',
                    width: ''

                },{
                    name: '类型',
                    key: 'type',
                    width: ''

                },{
                    name: '变更前地块',
                    key: 'oldMassif',
                    width: ''

                },{
                    name: '变更',
                    key: 'change',
                    width: ''

                },{
                    name: '变更后地块',
                    key: 'nowMassif',
                    width: ''
                },{
                    name: '时间',
                    key: 'createTime',
                    width: '200px'
                },{
                    name: '株龄',
                    key: 'age',
                    width: ''
                },{
                    name: '坐标',
                    key: 'coordinate',
                    width: ''
                },{
                    name: '责任人',
                    key: 'responsible',
                    width: ''
                },{
                    name: '添加时间',
                    key: 'addTime',
                    width: ''
                },{
                    name: '栽种时间',
                    key: 'plantTime',
                    width: ''
                },{
                    name: '位置',
                    key: 'position',
                    width: ''
                },{
                    name: '原基地',
                    key: 'oldBase',
                    width: ''
                },{
                    name: '流失原因',
                    key: 'reasons',
                    width: ''
                },{
                    name: '详细',
                    key: 'description',
                    width: ''
                },{
                    name: '传记',
                    key: 'biography',
                    width: ''
                },{
                    name: '滴头数',
                    key: 'waterNum',
                    width: ''
                },{
                    name: '控制面积',
                    key: 'area',
                    width: ''
                },{
                    name: 'mac地址',
                    key: 'macAddress',
                    width: ''
                }
            ],
            showKeys: [{
                    name: '编码',
                    key: 'number',
                    width: '180px'

                },{
                    name: '名称',
                    key: 'name',
                    width: ''

                },{
                    name: '类型',
                    key: 'type',
                    width: ''

                },{
                    name: '变更前地块',
                    key: 'oldMassif',
                    width: ''

                },{
                    name: '变更',
                    key: 'change',
                    width: ''

                },{
                    name: '变更后地块',
                    key: 'nowMassif',
                    width: ''

                },{
                    name: '时间',
                    key: 'createTime',
                    width: '200px'
                }], // 应该展示的keys
            seedling: [] // 苗木的种类
        }
    },
    methods: {
        handleSelectionChange (value) {
            this.selectSeedlings = value;
        },
        indexMethod(index) {
            const num = this.params.pageNo;
            return (num - 1) * 8 + index + 1;
        },
        handleCurrentChange(value) {
            this.params.pageNo = value;
            this.getChangeInfo(this.params);
        },
        handleCurrentTableRow(currentRow) {
            let path = ''
            if(currentRow.typeNum == '1') {
                path = '/home/seeControrllerModify'
            } else if (currentRow.typeNum == '2') {
                path = '/home/seeSeedlingModify'
            }
            this.$router.push({
                path,
                query: {
                    id: currentRow.id,
                    number: currentRow.number
                }
            })
        },
        async downExcel() {
            const ids = this.selectSeedlings.length > 0? this.selectSeedlings.map(ele => ele.id).toString(): null;
            const otherparam = Object.assign({
                number:'', type: '', modeKey: '',massifId: '', startTime: '',
                endTime: '',
            }, this.params);
            otherparam.number = this.number;
            delete otherparam.pageNo;
            delete otherparam.pageSize;
            const res = await this.http.get(this.api.change.exportChangeExcel, {
                ids, ...otherparam
            });
            let excelData = null;
            if(res && res.code === 200) {
                 excelData = res.data.list;
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
            const th = ['序号','编号', '名称', '类型', '变更前地块', '变更', '变更后地块', '时间'];
            const filterVal = ['index','number', 'name', 'type', 'oldMassif', 'change', 'nowMassif', 'createTime'];
            const data = excelData.map(v => filterVal.map(k => v[k]))
            const [fileName, fileType, sheetName] = ['变更记录导出列表', 'xlsx', '变更']
            toExcel({th, data, fileName, fileType, sheetName})
        },
        searchKeyWord() {
            this.params.number = this.number;
            this.params.pageNo = 1;
            this.getChangeInfo(this.params);
        },
        changeSelect(type, value) {
            // 因为下拉框被选中时自动进行搜索，不用进行分类查询
            this.params.pageNo = 1;
            this.getChangeInfo(this.params);
        },
        changeTime(value) {
            this.params.startTime = this.timeRange && this.timeRange[0];
            this.params.endTime = this.timeRange && this.timeRange[1];
            this.params.pageNo = 1;
            this.getChangeInfo(this.params);
        },
        // 地块下拉信息获取，从密目接口中拿
        // async nurseryStockDropDown() {
        //     const res = await this.http.get(this.api.seedling.nurseryStockDropDown,{});
        //     if(res && res.code == 200) {
        //       this.landOption = res.data.sfMassifList;
        //       this.landOption.unshift({
        //           name: '请选择地块',
        //           id: ''
        //       })
        //   } else {
        //       this.$message({
        //           type: 'error',
        //           message: '系统错误，请联系管理员！'
        //       })
        //   }
        // },
        //
        async getChangeInfo(params) {
            const res = await this.http.postJson(this.api.change.getChangeInfo,params);
            if(res && res.code == 200) {
                this.tableData = res.data.list;
                this.total = +res.data.total
            }
        },
        async getChangeType() {
          const res = await this.http.get(this.api.change.changeInfoDown, {});
          if(res.code == 200) {
              this.changeTypeOpt = res.data.changeType;
              this.changeTypeOpt.unshift({
                  sfKey: '',
                  sfValue: '请选择类型'
              })
              this.changeResOpt = res.data.changeMode;
              this.changeResOpt.unshift({
                  sfKey: '',
                  sfValue: '请选择原因'
              })
              this.landOption = res.data.massifList;
              this.landOption.unshift({
                  name: '请选择地块',
                  id: ''
              })
          }
        },

    },
    created() {
        this.getChangeInfo(this.params);
        this.getChangeType();
    },
    activated() {
        this.getChangeInfo(this.params);
    },
    watch:{
        showKeys(){
           this.getChangeInfo(this.params);
        }
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
        width: 11rem;
    }
    .clickATag{
        cursor: pointer;
        text-decoration: underline;
    }
    .option-button{
        display: block !important;
    }
    /deep/ .el-input__inner{
        height: 2.75rem;
        line-height: 2.75rem;
        // font-size: 0.8rem;
    }
    /deep/ .el-button{
        // font-size: 0.8rem;
        padding: 0.75rem 1.25rem;
    }
    .excel-title{
        font-size: 18px;
        font-weight: 600;
        a {
            text-decoration: underline;
            cursor: pointer;
        }
    }
    /deep/  .el-date-editor .el-range-separator, /deep/ .el-date-editor .el-range__close-icon, /deep/ .el-date-editor .el-range__icon{
    line-height: 2.2rem;
}
</style>
<style scoped>

@media screen and (max-width:1440px) {
   /deep/ .input-with-select{
        width: 11rem !important;
    }
    /deep/ .modify-timePick{
       width: 20rem;
   }
   .modify_input{
       width: 13rem !important;
    }
}
@media screen and (max-width:1366px) {
   /deep/ .input-with-select{
        width: 10rem !important;
    }
   /deep/ .modify-timePick{
       width: 20rem;
   }
   .modify_input{
       width: 13rem !important;
    }
}
/deep/  .el-date-editor .el-range-separator{
    line-height: 2.2rem;
}
</style>

