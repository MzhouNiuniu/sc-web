<template>
    <section class="role-manage">
        <div class="panel left-panel">
            <p class="header">
                角色列表
            </p>
            <RoleList ref="roleList" style="padding-left: 8px;" v-model="currentRoleId"/>
        </div>
        <div class="panel right-panel">
            <p class="header">
                权限设置
            </p>
            <RoleTree
                ref="roleTree"
                :role-id="currentRoleId"
            />
        </div>
    </section>
</template>

<script>
    /**
     * 提示 提示 ：与此页面相关的文件，dev环境下，热更新调试会有问题
     * 解决方案：每次修改后刷新，从其他页面跳转过来
     * */
    import RoleList from './RoleList'
    import RoleTree from './RoleTree'

    export default {
        name: 'RoleManage',
        components: {
            RoleList,
            RoleTree,
        },
        provide () {
            return {
                $roleBridge: this,
            }
        },
        data () {
            return {
                currentRoleId: '',
            }
        },
        methods: {
            // 连接2个组件
            checkIsAdmin () {
                return this.$refs.roleList.isAdmin
            },
            getSelectedMenus () {
                return this.$refs.roleTree.getSelectedMenus()
            },
            getRoleInfoById (roleId) {
                return this.$refs.roleList.getRoleInfoById(roleId)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .role-manage {
        display: flex;
        min-width: 1000px;
        justify-content: space-between;
        background-color: #fff;
        padding: 10px;
    }

    .panel {

        .header {
            font-size: 18px;
            background: #dcdfe6;
            padding: 6px 8px;
        }
    }

    .left-panel {
        width: 365px;
        margin-right: 16px;
    }

    .right-panel {
        flex: 1;
    }
</style>
