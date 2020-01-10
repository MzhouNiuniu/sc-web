<template>
    <div>
        <p class="wrapper-title"><span>用户管理</span></p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="搜索用户姓名/职位" v-model="name">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
                <div class="option-button">
                    <el-button v-allow="'user-manage-add'" type="primary" @click="isAddUserShow = true">
                        新建用户
                    </el-button>
                    <el-button v-allow="'user-manage-update'" type="primary" @click="editUser">
                        编辑
                    </el-button>
                    <el-button v-allow="'user-manage-delete'" type="primary" @click="deleteLands">
                        删除
                    </el-button>
                    <el-button v-allow="'user-manage-setListColumns'" type="primary"
                               @click="changeColShowVisible = true">
                        设置列表字段
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
                        label="#"
                        prop="index"
                        width="50"
                    />
                    <el-table-column
                        show-overflow-tooltip
                        v-for="(item, index) in showKeys "
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width?item.width:'auto'"
                    >
                        <template slot-scope="scope">
                            <span @click="handleCurrentTableRow(scope.row)" class="clickATag"
                                  v-if="item.key === 'number'"> {{scope.row.number || '/'}}</span>
                            <span v-else> {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination :totalNum="total" :currentPage="params.pageNo" @handleCurrentChange="handleCurrentChange">
                </pagination>
            </section>

        </div>
        <el-dialog title="新建用户" :visible.sync="isAddUserShow" width="50%" :close-on-click-modal="false"
                   @closed="closeUser">
            <add-user :user="user" @closeDialog="closeUser" @reloadTable="reload" v-if="isAddUserShow">
            </add-user>
        </el-dialog>
        <el-dialog :title="user.name" :visible.sync="isEditUserShow" width="50%" :close-on-click-modal="false"
                   @closed="closeUser">
            <edit-user :user="user" @closeDialog="closeUser" @reloadTable="reload" v-if="isEditUserShow">
            </edit-user>
        </el-dialog>
        <el-dialog title="设置列显示" :visible.sync="changeColShowVisible" width="50%" v-if="changeColShowVisible"
                   :close-on-click-modal="false">
            <dragger @closeDialog="changeColShowVisible = false" :allLabels="allLabels" :showLength="6"
                     v-model="showKeys"></dragger>
        </el-dialog>

    </div>
</template>
<script>
    import { checkPageLimit, checkIsAdmin } from '@/utils'
    import dragger from '@/components/changeTableCol/dragger.vue'

    import pagination from '@/components/pagination/pagination.vue'
    import addUser from './addUser'
    import editUser from './editUser'
    import { debounce } from '@/utils'

    export default {
        components: {
            pagination, addUser, dragger, editUser
        },
        data () {
            return {
                name: '',
                tableData: [],
                total: 0,
                params: {
                    name: '',
                    pageNo: 1,
                    pageSize: 8
                },
                changeColShowVisible: false,
                name: '',
                allLabels: [
                    {
                        name: '用户姓名',
                        key: 'name',
                        width: ''
                    }, {
                        name: '部门',
                        key: 'dept',
                        width: ''
                    }, {
                        name: '权限角色',
                        key: 'roleNames',
                        width: ''

                    }, {
                        name: '电子邮箱',
                        key: 'email',
                        width: ''

                    }, {
                        name: '手机号码',
                        key: 'mobile',
                        width: '100px'

                    },
                    {
                        name: '最近登录时间',
                        key: 'lastLoginTime',
                        width: ''
                    },
                    {
                        name: '性别',
                        key: 'sexName',
                        width: ''

                    }, {
                        name: '职位',
                        key: 'duty',
                        width: ''

                    }, {
                        name: '工号',
                        key: 'jobNumber',
                        width: ''

                    }, {
                        name: '备注',
                        key: 'remark',
                        width: ''
                    }
                ],
                showKeys: [{
                    name: '用户姓名',
                    key: 'name',
                    width: ''
                }, {
                    name: '部门',
                    key: 'dept',
                    width: ''
                }, {
                    name: '权限角色',
                    key: 'roleNames',
                    width: ''

                }, {
                    name: '电子邮箱',
                    key: 'email',
                    width: ''

                }, {
                    name: '手机号码',
                    key: 'mobile',
                    width: ''

                },
                    {
                        name: '最近登录时间',
                        key: 'lastLoginTime',
                        width: '',
                    }

                ], // 应该展示的keys
                selectUsers: [],
                isAddUserShow: false,
                isEditUserShow: false,
                user: {},
            }
        },
        methods: {
            handleSelectionChange (value) {
                this.selectUsers = value
            },
            handleCurrentTableRow (currentRow) {
                this.$router.push({
                    path: '/home/seeOrEditContorller',
                    query: {
                        id: currentRow.id
                    }
                })
            },
            handleCurrentChange (value) {
                this.params.pageNo = value
                this.userInfoList(this.params)
            },
            async userInfoList (params) {
                let res = await this.http.get(this.api.system.userInfoList, params)
                if (res && res.code === 200) {
                    const { pageNo, pageSize } = this.params

                    res = res.data.obj
                    this.total = Number(res.total)
                    res.selectResults.forEach((ele, index) => {
                        ele.roleNames = Array.isArray(ele.roleNames) ? ele.roleNames.join(',') : ele.roleNames
                        ele.sexName = !ele.gender ? null : (ele.gender === 1 ? '男' : '女')

                        // 不展示密码
                        ele.index = (pageNo - 1) * pageSize + index + 1
                        ele.roleCode = Array.isArray(ele.roleCodes) ? ele.roleCodes[0] : ele.roleCodes
                        delete ele.password
                    })

                    this.tableData = res.selectResults
                }
            },
            searchKey () {
                this.params.name = this.name
                this.params.pageNo = 1
                this.userInfoList(this.params)
            },
            deleteLands: debounce(function () {
                let ids = this.selectUsers.map(item => item.memberId)
                if (ids.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择用户！'
                    })
                    return
                }
                const userName = this.$cookies.get('userName') // 账号
                for (let i = 0; i < this.selectUsers.length; i++) {
                    const item = this.selectUsers[i]
                    if (checkIsAdmin(item.roleCode)) {
                        this.$message.error('不能删除管理员！')
                        return
                    }

                    if (item.loginName === userName) {
                        this.$message({
                            type: 'warning',
                            message: '不能删除自己！'
                        })
                        return
                    }
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    ids = ids.toString()
                    const res = await this.http.delete(this.api.system.deleteUser, {
                        userIds: ids
                    })
                    if (res && res.code === 200) {
                        this.params.pageNo = checkPageLimit(this.selectUsers, this.tableData, this.params.pageNo, this.total)
                        this.userInfoList(this.params)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.selectUsers = []
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        })
                    }
                })
            }),
            editUser: debounce(function () {
                if (this.selectUsers && this.selectUsers.length === 1) {
                    this.user = this.selectUsers[0]
                    const userName = this.$cookies.get('userName')
                    if (userName === this.user.username) {
                        this.$message({
                            type: 'warning',
                            message: '不能编辑自己！'
                        })
                        return
                    }
                    this.isEditUserShow = true
                } else {
                    this.$message.error('请选择一条数据进行编辑！')
                }
            }),
            closeUser () {
                this.isAddUserShow = false
                this.isEditUserShow = false
                this.user = {}
            },
            reload () {
                this.params.pageNo = 1
                this.userInfoList(this.params)
            }
        },
        created () {
            this.userInfoList(this.params)
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
</style>
