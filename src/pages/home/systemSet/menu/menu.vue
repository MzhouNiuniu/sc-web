<template>
    <div>
        <p class="wrapper-title">菜单管理</p>
        <div class="mod-menu">
            <el-form :inline="true" :model="dataForm">
                <el-form-item>
                    <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
                </el-form-item>
            </el-form>
            <el-table
                border
                row-key="menuId"
                :data="dataList"
                style="width: 100%;"
            >
                <el-table-column
                    prop="menuId"
                    header-align="center"
                    align="center"
                    width="200"
                    label="ID">
                </el-table-column>
                <table-tree-column
                    prop="menuName"
                    header-align="center"
                    treeKey="menuId"
                    width="150"
                    label="名称">
                </table-tree-column>
                <el-table-column
                    prop="parentName"
                    header-align="center"
                    align="center"
                    width="120"
                    label="上级菜单">
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="图标">
                    <template slot-scope="scope">

                        <i :class="[scope.row.icon==null||scope.row.icon.substring(2,0)=='el'?(scope.row.icon==null?'':('icon',scope.row.icon)):'iconfont',scope.row.icon]"></i>

                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    header-align="center"
                    align="center"
                    label="类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                        <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
                        <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
                        <el-tag v-else-if="scope.row.type === 3" size="small" type="info">展示</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    header-align="center"
                    align="center"
                    label="排序号">
                </el-table-column>
                <el-table-column
                    prop="url"
                    header-align="center"
                    align="center"
                    width="150"
                    :show-overflow-tooltip="true"
                    label="菜单URL">
                </el-table-column>
                <el-table-column
                    prop="perms"
                    header-align="center"
                    align="center"
                    width="150"
                    :show-overflow-tooltip="true"
                    label="授权标识">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    header-align="center"
                    align="center"
                    width="150"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                                   @click="addOrUpdateHandle(scope.row.menuId)">修改
                        </el-button>
                        <el-button type="text" size="small"
                                   @click="deleteHandle(scope.row.menuId)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
    </div>
</template>

<script>
    import TableTreeColumn from '@/components/table-tree-column'
    import AddOrUpdate from './menu-add-or-update'
    import { translateToTreeData } from '@/utils'

    export default {
        data () {
            return {
                dataForm: {},
                dataList: [],
                dataListLoading: false,
                addOrUpdateVisible: false
            }
        },
        components: {
            TableTreeColumn,
            AddOrUpdate
        },
        created () {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList: async function () {
                this.dataListLoading = true
                const params = this.http.adornParams()
                const data = await this.http.get(this.api.system.menu.list, { appMark: 'efeee287-a2a6-4cda-b3fc-3c2c4e750cfb' })
                this.dataList = translateToTreeData(data)

                this.dataListLoading = false
            },
            // 新增 / 修改
            addOrUpdateHandle (id) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },
            // 删除
            delete: async function (id) {
                const params = [id]
                const data = await this.http.postJson(`${this.api.system.menuDelete}`, params)
                if (data && data.code === 200) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }

            },
            deleteHandle (id) {
                this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete(id)

                }).catch(() => {
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrapper-title {
        border-left: 4px solid #2285dc;
        padding-left: 10px;
        color: #383838;
        font-size: 14px;
    }

    .mod-menu {
        margin: 15px 0;
        background: #fff;
        padding: 20px;
    }
</style>
