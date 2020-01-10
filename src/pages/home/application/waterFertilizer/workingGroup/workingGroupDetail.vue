<template>
    <div>
        <el-form ref="seedlingDetail"  :model="seedlingDetail" label-width="140px">
            <p class="wrapper-title"><span>设定信息</span></p>
            <div class="content-wrapper">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="作业组编号：" >
                            <span>{{seedlingDetail.number}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="设定时间：" >
                            <span>{{seedlingDetail.createTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                            <el-form-item label="灌溉周期：">
                                <span>{{seedlingDetail.IrrigationCycle}}</span>
                            </el-form-item>
                    </el-col>
                    <el-col :span="10">
                            <el-form-item label="间隔周期：" >
                                    <span>{{seedlingDetail.intervalsName}}
                                        &nbsp; &nbsp; &nbsp;
                                        {{ seedlingDetail.isIrrigationWeekend === 0? '周末不灌溉' : '' }}</span>
                            </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="设定人：" >
                                    <span>{{seedlingDetail.memberName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="设定人工号：" >
                                  <span>{{seedlingDetail.memberJobNumber}}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="灌溉总时长：" >
                                  <span>{{seedlingDetail.setHours}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="灌溉时段：" >
                                    <div>
                                        <el-table
                                            ref="multipleTable"
                                            :data="seedlingDetail.fmpGroupTimeList"
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
                                                    label="设置时间"
                                                        >
                                                    <template slot-scope="scope">
                                                       <span>
                                                           {{scope.row.startTime.slice(0,5)}} -- {{scope.row.endTime.slice(0,5)}}
                                                       </span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                    prop="duration"
                                                    label="设置时长"
                                                    >
                                                </el-table-column>
                                            </el-table>
                                    </div>
                        </el-form-item>
                    </el-col>

                </el-row>
            </div>
        </el-form>
        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
        </div>
        <br>
        <p class="wrapper-title"><span>控制器信息</span></p>
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
                    <template slot-scope="scope" >
                        <span > {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
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
// 当前页面的Seedling 对象吗，从苗木那边复制过来，暂时没有更改，不影响功能，可将Seedling默认相当于控制器。
import pagination from '@/components/pagination/pagination.vue'

export default {
    components: { pagination},
    name: 'seeOrEditContorller',
    data() {
        return {
            seedlingId: '',
            tableData: [],
            showKeys: [
                {
                    name: '基地名称',
                    key: 'baseName',
                    width: '150px'
                },{
                    name: '地块名称',
                    key: 'massifName',
                    width: '120px'
                },{
                    name: '控制器编号',
                    key: 'number',
                    width: '220'
                },{
                    name: '控制器名称',
                    key: 'name',
                    width: ''
                },{
                    name: '滴头数',
                    key: 'waterNum',
                    width: ''
                },{
                    name: '坐标',
                    key: 'coordinate',
                    width: '180px'
                },{
                    name: '添加时间',
                    key: 'createTime',
                    width: '180px'
                },{
                    name: '备注',
                    key: 'remarks',
                    width: ''
                }
            ],
            params: {
                id : '',
                pageNo: 1,
                pageSize: 8
            },
            total: 0,
            seedlingDetail: {

            }
        }
    },
    methods: {
        // 获取详情
        async getControllerInfo(params) {
            const res = await this.http.get(this.api.GroupControler.getPcGroupInfo, params);
            if(res && res.code === 200) {
                this.seedlingDetail = res.data.obj;
                // this.coordinate = this.seedlingDetail.coordinate;
                this.seedlingDetail.IrrigationCycle = this.seedlingDetail.startTime + ' 至 ' + this.seedlingDetail.endTime;
                this.tableData = this.seedlingDetail.controllerModels.list;
                this.tableData.forEach(ele => {
                    ele.IrrigationCycle = ele.startTime + '至' + ele.endTime;
                })
                this.total = +this.seedlingDetail.controllerModels.total;
            }
        },
        back() {
            this.$router.go(-1);
        },
        init() {
            this.seedlingId = this.$route.query.id;
            this.params.id = this.seedlingId;
            this.getControllerInfo(this.params);
        },
        handleCurrentChange(val) {
            this.params.pageNo = val;
            this.getControllerInfo(this.params);
        }
    },
    computed: {
    },
    created() {
        // this.times = this.getTimes()
        this.init();
        this.times = 0
        this.timer = setInterval(() => {
            if(this.times === 0) {
                clearInterval(this.timer)
                return
            }
            this.times --;
        }, 1000)
    },
    watch: {
        $route: {
             handler: function (val, oldVal) {
                    if(val.path == oldVal.path){
                        this.init();
                    }
                }
        }
    },
    activated() {
        this.init();
    }
}
</script>
<style lang="scss" scoped>
    .updata-button{
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
    .content-wrapper{
        position: relative;
    }
    .QRCode{
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
    .saveQRImg{
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
    .QRCode:hover{
        .saveQRImg{
            display: inline-block;
        }
    }
    .updataButton{
        line-height: 42px;
        margin-left: 10px;
    }
</style>
