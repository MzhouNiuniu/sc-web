<template>
    <section class="role-manage-tree">
        <!-- 获取到roleId之后才允许操作 -->
        <div style="padding: 8px 0" v-if="roleId">
            <el-button-group>
                <el-button v-allow="'role-save'" type="primary" size="mini" :disabled="isAdmin" @click="save">保存
                </el-button>
                <el-button v-allow="'role-reset'" type="primary" size="mini" :disabled="isAdmin" @click="reset">重置
                </el-button>
                <el-button v-allow="'role-selectall'" type="primary" size="mini" :disabled="isAdmin" @click="selectAll">
                    全选
                </el-button>
                <el-button v-allow="'role-notselectall'" type="primary" size="mini" :disabled="isAdmin"
                           @click="unselectAll">
                    全不选
                </el-button>
            </el-button-group>
        </div>

        <div class="tree-header">
            <p class="left">
                权限名称
            </p>
            <div class="right">
                <p style="display: inline-block;width: 40%;">
                    描述
                </p>
                <p style="display: inline-block">
                    使用范围
                </p>
            </div>
        </div>
        <el-tree

            ref="tree"
            class="checkbox-expanded-style"

            show-checkbox
            default-expand-all
            highlight-current

            node-key="menuId"
            :data="menuList"
            :props="defaultProps"
        >
            <div class="custom-tree-node" slot-scope="{node,data}">
                <p class="left" :title="data.perms">
                    {{node.label}}
                </p>
                <div class="right">
                    <p :title="data.remarks">
                        {{data.remarks}}
                    </p>
                    <p :title="data.useRange">
                        {{data.useRange}}
                    </p>
                </div>
            </div>
        </el-tree>
    </section>
</template>

<script>
    import { translateToTreeData } from '@/utils'

    export default {
        name: 'RoleTree',
        inject: ['$roleBridge'],
        props: {
            roleId: '',
        },
        data () {
            this.defaultProps = {
                children: 'children',
                label: 'menuName'
            }

            this.currentUserName = this.$store.state.user.info.loginName // 登录者的角色ID

            return {
                selectionNodeList: [],

                rawMenuList: [], // 全选要用。。（不要直接保存id）
                menuList: [],
            }
        },
        computed: {
            // 当前roleId是否是管理员，并非当前登录的用户 （变量名需修改）
            isAdmin () {
                return this.$roleBridge.checkIsAdmin()
            },
        },
        methods: {
            resetTreeNodeStatus () {
                this.rawMenuList.forEach(item => {
                    item.disabled = this.isAdmin
                })
            },
            async loadMenuList () {
                // 权限分发
                // const data = this.isAdmin
                //     ? await this.http.get(this.api.system.menu.listByOrgId, {}, true)
                //     : await this.http.get(this.api.system.menu.listByOrgId, {}, true)
                // : await this.http.get(this.api.system.menu.listByRoleId, { roleID: this.currentUserRoleId }, true)
                // const data = await this.http.get(this.api.system.menu.listByLoginName, { loginName: this.currentUserName }, true)

                const data = await this.http.get(this.api.system.menu.listByOrgId, {}, true)
                this.rawMenuList = data.menus
                this.menuList = translateToTreeData(this.rawMenuList)
            },

            // utils methods
            getSelectedMenuPerms () {
                return this.$refs.tree.getCheckedNodes(false, true).map(item => item.perms)
            },
            unselectAll () {
                this.$refs.tree.setCheckedKeys([])
            },
            selectAll () {
                this.$refs.tree.setCheckedKeys(this.rawMenuList.map(item => item.menuId))
            },
            reset () {
                this.loadMenuIds()
            },
            save () {
                if (!this.roleId) {
                    this.$message.error(res.message)
                    return
                }

                this.$store.dispatch('log', ['角色权限', '保存'])

                const roleInfo = this.$roleBridge.getRoleInfoById(this.roleId)
                if (!roleInfo) {
                    this.$message.error('角色不存在，请刷新页面重试！')
                    return
                }

                this.http.postJson(this.api.system.role.edit, {
                    roleId: this.roleId,
                    roleName: roleInfo.roleName,
                    remark: roleInfo.remark,
                    organizationId: this.$store.state.user.info.organizationId,
                    menus: this.getSelectedMenuPerms(),
                }).then(res => {
                    if (res.code !== 200) {
                        this.$message.error(res.message)
                        return
                    }

                    this.$message.success('操作成功')
                })
            },
            loadMenuIds (loading = true) { // return Array
                return this.http.get(this.api.system.menu.listByRoleId, { roleID: this.roleId }, !loading).then(res => {
                    if (!Array.isArray(res.menus)) {
                        return []
                    }

                    //  封装函数
                    const list = res.menus
                    const listMap = {}
                    list.forEach(item => listMap[item.menuId] = item)

                    for (let k in listMap) {
                        const item = listMap[k]

                        if (item.type === 0) {
                            continue
                        }

                        if (item.parentId) {
                            delete listMap[item.parentId]
                        }
                    }
                    // return Object.values(listMap)

                    res.menus = Object.values(listMap)
                    this.$refs.tree.setCheckedKeys(res.menus.map(item => item.menuId))
                })
            },
        },
        watch: {
            roleId () {
                this.resetTreeNodeStatus()

                this.loadMenuIds()
            },
        },
        created () {
            this.loadMenuList().then(() => {
                // 如果是管理员，则禁止选择 - 每次角色切换都需要resetTreeNodeStatus()
                this.resetTreeNodeStatus()
            })
        },
    }
</script>

<style lang="scss" scoped>
    // 有类似功能，可以提取样式
    /deep/ {
        .checkbox-expanded-style {
            .el-tree-node__expand-icon {
                position: relative;
                margin: 1px 4px 0;
                padding: 0;
                width: 14px;
                height: 14px;
                background: #409EFF;
                border-radius: 2px;

                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 2px;
                    height: 8px;
                    background: #fff;
                }

                &::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 8px;
                    height: 2px;
                    background: #fff;
                }

                &.expanded {
                    &::after {
                        opacity: 0;
                    }
                }

                &.is-leaf {
                    opacity: 0;
                }
            }

        }
    }

    .role-manage-tree {
    }

    /*与下边布局一样，右定宽800，左自适应（暂时使用flex）*/
    /*右边继续4、6分*/
    .tree-header {
        $border-color: #DCDFE6;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        border: 1px solid $border-color;

        p {
            flex: 1;
            text-align: center;
            padding: 6px 0;
        }

        .left {
        }

        .right {
            display: flex;
            width: 500px;
            border-left: 1px solid $border-color;

            p {
                width: 50%;
            }

            p:first-child {
                border-right: 1px solid $border-color;
            }
        }
    }

    .custom-tree-node {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 14px;

        p {
            flex: 1;
        }

        .left {
        }

        .right {
            display: flex;
            width: 500px;
            text-align: center;

            p {
                width: 50%;

                // 溢出之后隐藏，此时可以查看title..
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>
