<template>
    <section class="role-manage-list">
        <div style="padding: 8px 0">
            <el-button-group>
                <el-button v-allow="'role-add'" type="primary" size="mini" @click="formModel.open = true">新建</el-button>
                <el-button v-allow="'role-update'" :disabled="isAdmin" type="primary" size="mini"
                           @click="handleEditRole">修改
                </el-button>
                <el-button v-allow="'role-delete'" :disabled="isAdmin" type="primary" size="mini" @click="del">删除
                </el-button>
            </el-button-group>
        </div>
        <div class="list-header">
            <p>
                角色名称
            </p>
            <p>
                描述
            </p>
        </div>
        <ul>
            <li v-for="(item,index) in roleList" :key="index">
                <p>
                    <!-- :disabled="item.roleId === adminRoleId" -->
                    <el-radio
                        :title="item.roleName"

                        :value="value"
                        :label="item.roleId"
                        @change="handleRoleChange(item.roleId)"
                    >
                        {{item.roleName}}
                    </el-radio>
                </p>
                <p :title="item.remark">
                    {{item.remark | maxLength(12)}}
                </p>
            </li>
        </ul>
        <AddRole :open="formModel.open" :data="formModel.data" @close="handleFormClose" @success="handleFormSuccess"/>
    </section>
</template>

<script>
    import { checkIsAdmin } from '@/utils'
    import AddRole from './Add'

    export default {
        name: 'RoleList',
        components: {
            AddRole,
        },
        filters: {
            // 。。。fix bug 3394；原来样式已经处理过了，180px放12个汉字，测试要求数字、字母也要限制12个
            maxLength (value, len = 12) {
                if (value && value.length > 12) {
                    return value.slice(0, len) + '...'
                }
                return value
            },
        },
        inject: ['$roleBridge'],
        props: {
            value: '',
        },
        data () {
            this.roleList = []
            return {
                adminRoleId: '',
                formModel: {
                    open: false,
                    data: null,
                },
            }
        },
        computed: {
            isAdmin () {
                return this.checkIsAdminByRoleId(this.value)
            },
        },
        methods: {
            del () {
                if (this.isAdmin) {
                    this.$message.error('不能删除管理员！')
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.http.delete(this.api.system.role.del, { roleIds: this.value }).then(res => {
                        if (res.code !== 200) {
                            this.$message.error(res.message)
                            return
                        }

                        this.$message.success('删除成功')
                        this.loadRoleList().then(this.selectLastRole)
                    })
                })
            },
            handleEditRole () {
                if (this.isAdmin) {
                    this.$message.error('不能删除管理员！')
                    return
                }

                this.formModel.data = this.roleList.find(item => item.roleId === this.value)
                this.formModel.open = true
            },
            handleFormClose () {
                this.formModel.open = false
                this.formModel.data = null
            },
            handleFormSuccess (ACTION_TYPE) {
                this.loadRoleList().then(() => {
                    // 编辑的时候就不要重新选择角色了
                    if (ACTION_TYPE === 'edit') {
                        return
                    }

                    this.selectLastRole()
                })
                this.handleFormClose()
            },
            loadRoleList () {
                return this.http.get(this.api.system.role.list, {}, true).then(res => {
                    if (res.code !== 200) {
                        this.$message.error(res.message)
                        return
                    }

                    this.roleList = res.roles
                    this.$forceUpdate()
                })
            },

            handleRoleChange (rid) {
                this.$emit('input', rid)
            },
            // 根据需求，默认选中管理员
            initDefaultRole () {
                const admin = this.getAdmin()
                if (!admin) {
                    this.$message.error('系统管理员不存在')
                    return
                }
                this.adminRoleId = admin.roleId
                this.handleRoleChange(admin.roleId)
            },

            selectLastRole () {
                const lastRoleItem = this.roleList[this.roleList.length - 1]
                this.handleRoleChange(lastRoleItem.roleId)
            },

            getAdmin () {
                return this.roleList.find(item => checkIsAdmin(item.roleCode))
            },
            checkIsAdminByRoleId (rid) {
                if (!rid) {
                    return false
                }
                return rid === this.adminRoleId
            },

            getRoleInfoById (roleId) {
                return this.roleList.find(item => item.roleId === roleId)
            },
        },
        created () {
            this.loadRoleList().then(this.initDefaultRole)
        },
    }
</script>

<style lang="scss" scoped>
    .role-manage-list {
        font-size: 14px;
    }

    .list-header, ul li {
        display: flex;

        p {
            flex: 1;
        }
    }

    .list-header {
        border: 1px solid #DCDFE6;

        p {
            padding: 6px 0;
            text-align: center;

            &:first-child {
                border-right: 1px solid #DCDFE6;
            }
        }
    }

    ul {
        overflow-y: auto;
        max-height: 600px;
        line-height: 26px; // 行高与el-tree保持一致
        color: #606266;

        p:last-child {
            text-align: center;
            max-width: 180px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
