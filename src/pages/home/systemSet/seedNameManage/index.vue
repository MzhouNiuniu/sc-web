<template>
    <div>
        <p class="wrapper-title">
            <span>苗木名称管理</span>
        </p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="输入关键字搜索" v-model="lazyParams.key">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
                <div class="option-button">
                    <el-button type="primary" v-allow="'nursery-name-manage-add'"
                               @click="isSeedShow = true,seedType = 'add',seedTitle='新建'">新建
                    </el-button>
                    <el-button type="primary" v-allow="'nursery-name-manage-update'" @click="updateSeedShow">编辑
                    </el-button>
                    <el-button type="primary" v-allow="'nursery-name-manage-delete'" @click="deleteSeed">删除</el-button>
                </div>
            </div>
            <br/>
            <section>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="50" :index="indexMethod"></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        v-for="(item, index) in showKeys "
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width?item.width:'auto'"
                    >
                        <template slot-scope="scope">
                            <span>{{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    :totalNum="total"
                    :currentPage="params.pageNo"
                    @handleCurrentChange="handleCurrentChange"
                ></pagination>
            </section>
        </div>

        <el-dialog
            :title="seedTitle"
            :visible.sync="isSeedShow"
            width="30%"
            :close-on-click-modal="false"
            @closed="resetForm"
        >
            <div v-if="isSeedShow">
                <el-form ref="seed" :rules="rules" :model="seed" label-width="100px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="苗木名称:" prop="fmpNurseryName">
                                <el-input v-model="seed.fmpNurseryName" maxlength="5" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="updata-button">
                    <el-button type="primary" @click="save">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import pagination from '@/components/pagination/pagination.vue'
    import { checkPageLimit, debounce } from '@/utils'

    export default {
        components: {
            pagination
        },
        data () {
            return {
                tableData: [],
                selectSeeds: [],
                lazyParams: {
                    key: '',
                },
                params: {
                    key: '',
                    pageNo: 1,
                    pageSize: 8
                },
                isSeedShow: false,
                seedType: '',
                seedTitle: '新建',
                showKeys: [
                    {
                        name: '苗木名称编码',
                        key: 'number',
                        width: ''
                    },
                    {
                        name: '苗木名称',
                        key: 'name',
                        width: ''
                    },
                    {
                        name: '建立时间',
                        key: 'createTime',
                        width: ''
                    }
                ],
                total: 0,
                seed: {
                    fmpNurseryId: '',
                    fmpNurseryName: ''
                },
                rules: {
                    fmpNurseryName: [
                        { required: true, message: '请输入苗木名称', trigger: 'change' }
                    ]
                }
            }
        },
        created () {
            this.getFmpNurseryNameInfoList(this.params)
        },
        methods: {
            handleSelectionChange (value) {
                this.selectSeeds = value
            },
            indexMethod (index) {
                const num = this.params.pageNo
                return (num - 1) * 8 + index + 1
            },
            handleCurrentChange (val) {
                this.params.pageNo = val
                this.getFmpNurseryNameInfoList(this.params)
            },
            //列表信息
            async getFmpNurseryNameInfoList (params) {
                const res = await this.http.get(
                    this.api.system.getFmpNurseryNameInfoList,
                    params
                )
                if (res && res.code === 200) {
                    this.tableData = res.fmpNurseryNames
                    this.total = +res.total
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            //列表查询
            searchKey () {
                this.params.key = this.lazyParams.key
                this.params.pageNo = 1
                this.getFmpNurseryNameInfoList(this.params)
            },
            //修改窗口展示
            updateSeedShow () {
                let ids = this.selectSeeds.map(item => item.id)
                if (ids.length == 0) {
                    this.$message.error('请选择一条数据进行编辑！')
                    return
                }else if (ids.length > 1) {
                    this.$message.error('只能选择一个苗木名称编辑！')
                    return
                }
                this.isSeedShow = true
                this.seedType = 'update'
                this.seedTitle = '修改'
                this.seed.fmpNurseryName = this.selectSeeds[0].name
                this.seed.fmpNurseryId = this.selectSeeds[0].id
            },
            //删除苗木
            deleteSeed: debounce(function () {
                let ids = this.selectSeeds.map(item => item.id)
                if (ids.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择苗木！'
                    })
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    ids = ids.toString()
                    const res = await this.http.delete(this.api.system.deleteFmpNurseryName, {
                        ids: ids
                    })
                    if (res && res.code === 200) {
                        this.params.pageNo = checkPageLimit(
                            this.selectSeeds,
                            this.tableData,
                            this.params.pageNo,
                            this.total
                        )
                        this.getFmpNurseryNameInfoList(this.params)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.selectSeeds = []
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            }),
            save () {
                this.$refs['seed'].validate(async valid => {
                    if (valid) {
                        let res = '',
                            successMsg = '',
                            params = {
                                name: this.seed.fmpNurseryName
                            }
                        if (this.seedType == 'add') {
                            res = await this.http.postJson(
                                this.api.system.addFmpNurseryName,
                                params
                            )
                            successMsg = '新增成功'
                        } else if (this.seedType == 'update') {
                            params.id = this.seed.fmpNurseryId
                            res = await this.http.postJson(
                                this.api.system.editFmpNurseryName,
                                params
                            )
                            successMsg = '修改成功'
                        }
                        if (res && res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: successMsg
                            })
                            this.isSeedShow = false
                            this.getFmpNurseryNameInfoList(this.params)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    }
                })
            },
            resetForm () {
                this.seed.nurseryStockName = ''
                this.seedType = ''
                this.seed.fmpNurseryName = ''
                this.seed.fmpNurseryId = ''
            }
        },
        watch: {}
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
</style>
