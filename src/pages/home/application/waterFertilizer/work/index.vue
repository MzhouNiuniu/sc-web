<template>
    <div>
        <div class="content-wrapper">
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="水肥作业列表展示" name="work">水肥作业列表展示</el-tab-pane>
                    <el-tab-pane label="水肥作业地图展示" name="workMap">水肥作业地图展示</el-tab-pane>
                </el-tabs>
            </div>
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="控制器名称/编码" v-model="keywords" class="input-with-select">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-select v-model="params.massifId" placeholder="请选择地块名称" @change="changeSelect"
                               class="input-with-select">
                        <el-option label="请选择地块名称" value=""/>
                        <el-option
                            v-for="item in landOpt"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                    <el-select v-model="params.stateKey" placeholder="请选择状态" @change="changeSelect"
                               class="input-with-select">
                        <el-option label="请选择状态" value=""/>
                        <el-option
                            v-for="item in statusOpt"
                            :key="item.stateKey"
                            :label="item.stateName"
                            :value="item.stateKey"
                        />
                    </el-select>
                </div>
                <div class="option-button" v-allow="'sfWork-set-operation'">
                    <el-button type="primary" @click="preSetJudge()">
                        设置
                    </el-button>
                    <el-button type="primary" @click="stopControls()">
                        结束
                    </el-button>
                    <el-button type="primary" :disabled="selects.length > 1" @click="setArtControls()">
                        人工
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
                        v-for="(item, index) in showKeys"
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width?item.width:'auto'"
                    >
                        <template slot-scope="scope">
                            <span @click="handleCurrentTableRow(scope.row)" class="clickATag"
                                  v-if="item.key === 'number'"> {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                            <span v-else> {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="$hasPerms('sfWork-set-operation')"
                        label="操作"
                        width="260px"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" :disabled="scope.row.stateKey === 3"
                                       @click="preSetJudge(scope.row)">
                                设置
                            </el-button>
                            <el-button type="primary" :disabled="scope.row.stateKey === 3 "
                                       @click="stopControls(scope.row)">
                                结束
                            </el-button>
                            <el-button type="primary" :disabled="scope.row.stateKey === 2 "
                                       @click="setArtControls(scope.row)">
                                人工
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :totalNum="total" :currentPage="params.pageNo" @handleCurrentChange="handleCurrentChange">
                </pagination>
            </section>
        </div>
        <!-- 这里的title需要根据不同的场景替换 -->
        <el-dialog :title="isHaveEnd?'水肥作业人工设定' :'水肥作业结束提示'" :visible.sync="isShowWorkEnd" width="50%"
                   @closed="isShowWorkEnd = false;isHaveEnd = false;" :close-on-click-modal="false">
            <work-end v-if="isShowWorkEnd" :data="endData" @closeDialog="isShowWorkEnd = false;isHaveEnd = false;"
                      @reloadTable="OpenWorkSet()" :isHaveEnd="isHaveEnd"></work-end>
        </el-dialog>

        <el-dialog title="水肥作业设定" :visible.sync="isShowWorkSet" width="50%" v-if="isShowWorkSet"
                   :close-on-click-modal="false">
            <work-set :data="setData" @closeDialog="isShowWorkSet = false"
                      @reloadTable="getControllerList(params)"></work-set>
        </el-dialog>

        <el-dialog title="水肥作业人工设定" :visible.sync="isShowArt" width="40%" v-if="isShowArt"
                   :close-on-click-modal="false">
            <artificial :data="artData" @closeDialog="isShowArt = false"
                        @reloadTable="getControllerList(params)"></artificial>
        </el-dialog>
    </div>
</template>
<script>
    import pagination from '@/components/pagination/pagination.vue'
    import { checkPageLimit } from '@/utils'
    import workEnd from '../components/workEnd'
    import workSet from '../components/workSet'
    import artificial from '../components/artificial'
    import { debounce } from '@/utils'

    export default {
        components: {
            pagination, workEnd, workSet, artificial
        },
        data () {
            return {
                keywords: null,
                tableData: [],
                selects: [],
                params: {
                    stateKey: '',
                    massifId: '',
                    keywords: null,
                    pageNo: 1,
                    pageSize: 8
                },
                isAddMacShow: false,
                showKeys: [
                    {
                        name: '控制器编码',
                        key: 'number',
                        width: '180px'
                    }, {
                        name: '控制器名称',
                        key: 'name',
                        width: ''
                    }, {
                        name: '基地名称',
                        key: 'baseName',
                        width: '130px'
                    },
                    {
                        name: '地块名称',
                        key: 'massifName',
                        width: ''
                    }, {
                        name: '状态',
                        key: 'stateName',
                        width: ''
                    }, {
                        name: '工作时长',
                        key: 'workHours',
                        width: ''
                    }, {
                        name: '灌溉量L',
                        key: 'irrigationNum',
                        width: ''
                    }, {
                        name: '滴头数',
                        key: 'waterNum',
                        width: ''
                    },
                ],
                total: 0,
                statusOpt: [],
                landOpt: [],
                isShowWorkEnd: false,
                isShowWorkSet: false,
                isShowArt: false,
                endData: [], // 需要传到end组件的一个对象
                setData: [], // 传到set组件的一个对象
                artData: [],
                activeName: 'work',
                isHaveEnd: false, // 这个值用来标识是否从设定中打开了 结束设定，若为true 则需要在结束设定后打开 设定作业弹窗。
                timer: null, // 列表的定时器
            }
        },
        created () {
            this.getControllerList(this.params)
            this.getLandOpt()
            this.getStatusOpt()

        },
        mounted () {
            this.timer = setInterval(() => {
                this.tableData.forEach(item => {
                    if (item.statusTime && item.statusTime > 0) {
                        item.statusTime--
                    }
                })
                this.$refs['multipleTable'].$children.forEach(ele => {
                    ele.$forceUpdate()
                })
            }, 1000)
        },
        methods: {
            searchKey () {
                this.params.keywords = this.keywords
                this.params.pageNo = 1
                this.getControllerList(this.params)
            },
            handleSelectionChange (value) {
                this.selects = value
            },
            indexMethod (index) {
                const num = this.params.pageNo
                return (num - 1) * 8 + index + 1
            },
            handleCurrentChange (val) {
                this.params.pageNo = val
                this.getControllerList(this.params)
            },
            changeSelect () {
                this.params.pageNo = 1
                this.getControllerList(this.params)
            },
            // 点击查看列表
            handleCurrentTableRow (currentRow) {
                this.$router.push({
                    path: '/home/waterFertilizer/workDetail',
                    query: {
                        id: currentRow.id
                    }
                })
            },
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
            // 获取地块下拉
            async getLandOpt () {
                const res = await this.http.get(this.api.controller.getControllerDropDownList, {
                    flag: 2
                })
                if (res && res.code === 200) {
                    this.landOpt = res.data.list || this.landOpt // 此接口有可能出现null
                }
            },
            // 获取状态下拉
            async getStatusOpt () {
                const data = await this.getDropDownList({
                    type: 'controller'
                })
                if (data) {
                    this.statusOpt = data.stateList
                }
            },
            // 获取list
            async getControllerList (params) {
                const res = await this.http.get(this.api.GroupControler.getControllerList, params)
                if (res && res.code === 200) {
                    this.tableData = res.data.obj.list
                    this.total = +res.data.obj.total
                    // this.initArtTimeOut();
                }
            },
            // 批量/ 单个 设定
            setControls (val) {
                if (val) {
                    this.setData = [val]
                    this.isShowWorkSet = true
                    return
                }
                if (this.selects.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                const flag = this.isHavaArtControl(this.selects)
                if (flag) {
                    this.$message({
                        type: 'warning',
                        message: '不能选择人工设定状态的！'
                    })
                    return
                }
                this.setData = JSON.parse(JSON.stringify(this.selects))
                this.isShowWorkSet = true
            },
            // 设置人工设定
            setArtControls: debounce(function (val) {
                if (val) {
                    this.artData = [val]
                    this.isShowArt = true
                    return
                }
                if (this.selects.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                if (this.selects && this.selects.length > 1) {
                    this.$message({
                        type: 'warning',
                        message: '人工设定的不能超过一个'
                    })
                    return
                }
                if (this.selects && this.selects[0].stateKey === 2) {
                    this.$message({
                        type: 'warning',
                        message: '不能人工设定运行中的控制器'
                    })
                    return
                }
                this.artData = JSON.parse(JSON.stringify(this.selects))
                this.isShowArt = true
            }),
            // 批量/单个停止
            stopControls: debounce(function (val) {
                if (val) {
                    if (val.stateKey === 0) {
                        this.$confirm(`确定结束吗？`).then(() => {
                            const controllerIds = val.id
                            this.endGroupController({ controllerIds })
                        })
                        return
                    }
                    this.endData = [val]
                    this.isShowWorkEnd = true
                    return
                }
                if (this.selects.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                const flag = this.isHavaArtControl(this.selects)
                if (flag) {
                    this.$message({
                        type: 'warning',
                        message: '不能选择人工设定状态的！'
                    })
                    return true
                }

                const isAllNoSet = this.selects.every(item => {
                    return item.stateKey === 0
                })

                if (isAllNoSet) {
                    this.$confirm(`确定结束吗？`).then(() => {
                        const controllerIds = this.selects.map(item => item.id).toString()
                        this.endGroupController({ controllerIds })
                    })
                    return
                }

                this.endData = JSON.parse(JSON.stringify(this.selects))
                this.isShowWorkEnd = true
            }),
            preSetJudge: debounce(function (val) {
                if (val) {
                    if ((val.stateKey === 2 || val.stateKey === 1)) {
                        this.isHaveEnd = true
                        this.stopControls(val)
                        return
                    } else {
                        this.setControls(val)
                        return
                    }

                }
                const flag = this.selects.some(ele => {
                    return ele.stateKey === 2 || ele.stateKey === 1
                })
                if (flag) {
                    this.isHaveEnd = true
                    this.stopControls()
                } else {
                    this.setControls()
                }
            }),
            isHavaArtControl (controllers) {
                if (Array.isArray(controllers)) {
                    return controllers.some(ele => {
                        return ele.stateKey === 3
                    })
                } else if (typeof controllers === 'object') {
                    return controllers.stateKey === 3
                }

            },
            handleClick (tab, event) {
                if (tab.name === 'work') {
                    this.$router.push('/home/waterFertilizer/work')
                } else if (tab.name === 'workMap') {
                    this.$router.push('/home/waterFertilizer/workMap')
                }
            },
            OpenWorkSet () {
                if (this.isHaveEnd) {
                    if (this.endData && this.endData.length === 1) {
                        // 数组表示单点出来操作的或勾选一个操作的，
                        this.setControls(this.endData[0])
                    } else {
                        this.setControls()
                    }
                } else {
                    this.getControllerList(this.params)
                }
                this.isHaveEnd = false
            },
            // 初始化人工操作的定时器的时间
            initArtTimeOut () {
                // 定义 artTime 为缓存的key, 里面存储的每一次设置的新的点击时间点 是一个id 与 人工设定状态切换时间点， 和灌溉状态切换时间点的 键值对。
                // 定义 artStatusTi 为 人工状态切换时间， 时间都是毫秒级，进行运算
                // 定义 artIrriTi 为灌溉切换时间
                let artTime = localStorage.getItem('artTime') || '{}'
                artTime = JSON.parse(artTime)
                this.tableData.forEach(ele => {
                    if (artTime[ele.id]) {
                        const timeOb = artTime[ele.id]
                        ele.artStatusTi = timeOb.artStatusTi || 0
                        ele.artIrriTi = timeOb.artIrriTi || 0
                    } else {
                        // id 对应的值没有说明，还没有操作过这个人工按钮
                        ele.artStatusTi = 0
                        ele.artIrriTi = 0
                    }
                    ele.statusTime = ele.artStatusTi === 0 ? 0 : (new Date().getTime() - ele.artStatusTi >= 15000 ? 0 : 15000 - (new Date().getTime() - ele.artStatusTi))
                    ele.irriTime = ele.artIrriTi === 0 ? 0 : (new Date().getTime() - ele.artIrriTi >= 15000 ? 0 : 15000 - (new Date().getTime() - ele.artIrriTi))

                    ele.statusTime = Math.floor(ele.statusTime / 1000)
                    ele.irriTime = Math.floor(ele.irriTime / 1000)
                })
            },
            async endGroupController ({ controllerIds }) {
                const res = await this.http.get(this.api.GroupControler.endGroupController, {
                    controllerIds
                })
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
                        message: '结束设定成功！'
                    })
                    return {
                        code: 200
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            // // 写入每次操作的时间到缓存中
            // writeLocalStrory(val, type) {
            //     // type 1 为对应  artStatusTi （人工设定状态），2 代表 artIrriTi（灌溉状态）
            //     // 表示将对应的 id的操作时间写入
            //     let artTime = localStorage.getItem('artTime') || {};
            //     artTime = JSON.parse(artTime);
            //     if(type === 1) {
            //         artTime[val.id] ? (artTime[val.id].artStatusTi = new Date().getTime() ) : (artTime[val.id] = { 'artStatusTi' : new Date().getTime() } );
            //     } else if (type === 2) {
            //         artTime[val.id] ? (artTime[val.id].artIrriTi = new Date().getTime() ) : (artTime[val.id] = { 'artIrriTi' : new Date().getTime() } );
            //     }
            //     localStorage.setItem('artTime', JSON.stringify(artTime));

            // }
        },
        beforeDestroy () {
            clearInterval(this.timer)
        }
    }
</script>

<style lang="scss" scoped>
    .searchAndButtonBox {
        display: flex;
        justify-content: space-between;

        > div {
            display: flex;
            justify-content: space-between;
        }
    }

    .input-with-select {
        margin-right: 1rem;
        width: 15rem;
    }

    .option-button {
        display: block !important;
    }

    /deep/ .el-input__inner {
        height: 2.75rem;
        line-height: 2.75rem;
        // font-size: 0.8rem;
        // font-size: 1rem;
    }

    /deep/ .el-button {
        // font-size: 0.8rem;
        padding: 0.75rem 1.25rem;
    }

    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

    .clickATag {
        cursor: pointer;
        text-decoration: underline;
    }

    /deep/ .el-tabs {
        .el-tabs__content {
            display: none;
        }
    }
</style>
