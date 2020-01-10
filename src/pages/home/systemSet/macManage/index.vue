<template>
    <div>
        <p class="wrapper-title"><span>mac地址管理</span></p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="输入mac地址" v-model="macAddress">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
                <div class="option-button">
                    <el-button v-allow="'mac-add'" type="primary" @click="isAddMacShow = true">
                        新建
                    </el-button>
                    <el-button v-allow="'mac-delete'" type="primary" @click="deleteMac">
                        删除
                    </el-button>
                </div>
            </div>
            <br>
            <section v-allow="'mac-list'">
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
                        <template slot-scope="scope">
                            <span> {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination :totalNum="total" :currentPage="params.pageNo" @handleCurrentChange="handleCurrentChange">
                </pagination>
            </section>
        </div>

        <el-dialog title="新建" :visible.sync="isAddMacShow" width="30%" :close-on-click-modal="false"
                   @closed="resetForm">
            <div v-if="isAddMacShow">
                <el-form ref="mac" :rules="rules" :model="mac" label-width="100px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="MAC地址:" prop="macAddress">
                                <el-input v-model="mac.macAddress" placeholder="请输入内容"></el-input>
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
    import { checkPageLimit } from '@/utils'
    import { debounce } from '@/utils'

    export default {
        components: {
            pagination
        },
        data () {
            return {
                macAddress: '',
                tableData: [],
                selectMacs: [],
                params: {
                    macAddress: '',
                    pageNo: 1,
                    pageSize: 8
                },
                isAddMacShow: false,
                showKeys: [
                    {
                        name: 'MAC地址',
                        key: 'macAddress',
                        width: ''
                    }, {
                        name: '状态',
                        key: 'status',
                        width: ''
                    }, {
                        name: '创建时间',
                        key: 'createTime',
                        width: ''
                    },
                ],
                total: 0,
                mac: {
                    macAddress: ''
                },
                rules: {
                    macAddress: [{ required: true, message: '请输入mac地址', trigger: 'change' },
                        {
                            validator: (rules, value, callback) => {
                                if (/^[0-9A-F]{12}$/.test(value) && /^[0-9](?![0-9]+$)|^[A-F](?![A-F]+$)/.test(value)) {
                                    callback()
                                } else {
                                    callback(new Error('请输入12位只包含“0-9和A-F“的字符串'))
                                }
                            }, message: '请输入12位只包含“0-9和A-F”的字符串', trigger: 'change'
                        }
                    ]
                }
            }
        },
        created () {
            this.getMacList(this.params)
        },
        methods: {
            searchKey () {
                this.params.macAddress = this.macAddress
                this.params.pageNo = 1
                this.getMacList(this.params)
            },
            handleSelectionChange (value) {
                this.selectMacs = value
            },
            indexMethod (index) {
                const num = this.params.pageNo
                return (num - 1) * 8 + index + 1
            },
            handleCurrentChange (val) {
                this.params.pageNo = val
                this.getMacList(this.params)
            },
            async getMacList (params) {
                const res = await this.http.get(this.api.system.getMacList, params)
                if (res && res.code === 200) {
                    this.tableData = res.data.macList
                    this.total = +res.data.count
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            deleteMac: debounce(function () {
                let ids = this.selectMacs.map(item => item.id)
                if (ids.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择mac地址！'
                    })
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    ids = ids.toString()
                    const res = await this.http.delete(this.api.system.deleteMac, {
                        ids: ids
                    })
                    if (res && res.code === 200) {
                        this.params.pageNo = checkPageLimit(this.selectMacs, this.tableData, this.params.pageNo, this.total)
                        this.getMacList(this.params)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.selectMacs = []
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            }),
            save () {
                this.$refs['mac'].validate(async valid => {
                    if (valid) {
                        const params = JSON.parse(JSON.stringify(this.mac))
                        const res = await this.http.post(this.api.system.saveMac, params)
                        if (res && res.code === 200) {
                            this.getMacList(this.params)
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.isAddMacShow = false
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
                this.mac.macAddress = ''
            }
        },
        watch: {
            'mac.macAddress': function (value) {
                this.mac.macAddress = value.toLocaleUpperCase()
            }
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
</style>
