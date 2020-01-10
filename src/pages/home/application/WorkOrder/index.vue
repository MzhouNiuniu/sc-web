<template>
    <section>
        <p class="wrapper-title">
            <span>工单列表</span>
        </p>
        <div class="content-wrapper">
            <div class="operate-bar">
                <el-form
                    ref="searchForm"
                    size="small"
                    inline
                    :model="searchParams"
                >
                    <el-form-item prop="wordKey">
                        <el-input
                            v-model="searchParams.wordKey"
                            :maxlength="50"
                            placeholder="请输入关键字搜索"
                            size="large"

                            style="width:220px;"
                        >
                            <el-button slot="append" @click="handleSearch('wordKey')" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="workType">
                        <el-select
                            v-model="searchParams.workType"
                            size="large"
                            @change="handleSearch('workType')"

                            style="width:160px;"
                        >
                            <el-option label="请选择作业类型" value=""/>
                            <el-option v-for="(item,index) in workTypeOptionList" :key="index" :label="item.sfValue"
                                       :value="item.sfKey"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dateRange">
                        <el-date-picker
                            v-model="searchParams.dateRange"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="large"
                            @change="handleSearch('dateRange')"

                            style="width: 260px;"
                        />
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="primary" size="small" @click="exportExcel">
                        导出
                    </el-button>
                </div>
            </div>

            <el-table
                ref="table"
                :data="tableData"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    label="#"
                    prop="index"
                    width="50"
                />
                <el-table-column
                    prop="number"
                    label="工单编码"
                    width="220"
                >
                    <template slot-scope="{row}">
                        <!-- 实际上是根据id查 -->
                        <router-link :to="`WorkOrderDetail?id=${row.id}`" style="text-decoration: underline;">
                            {{row.number}}
                        </router-link>
                    </template>
                </el-table-column>

                <el-table-column v-for="(item,index) in columns" :key="index" v-bind="item" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        {{row[item.prop] || '/'}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="mt-20 text-right"
                background
                layout="total,prev,pager,next,jumper"
                :current-page.sync="pagination.currentPage"
                :page-size="pagination.pageSize"
                :total="pagination.total"

                @current-change="handlePageChange"
            >
            </el-pagination>
        </div>
    </section>
</template>

<script>
    import { toExcel } from '@/utils/excel.js'

    export default {
        name: 'WorkOrder',
        data () {
            this.columns = [
                {
                    width: 120,
                    prop: 'workTypeName',
                    label: '作业类型',
                },
                {
                    width: 120,
                    prop: 'operator',
                    label: '操作人',
                },
                {
                    prop: 'baseName',
                    label: '基地名称',
                },
                {
                    prop: 'massifName',
                    label: '地块名称',
                },
                {
                    prop: 'nurseryName',
                    label: '苗木名称',
                },
                {
                    width: 170,
                    prop: 'createTime',
                    label: '填单时间',
                },
            ]

            return {
                hasPerm: true,
                tableData: [],
                selectionRowList: [],
                searchParams: {
                    wordKey: '',
                    workType: '',
                    dateRange: [], // startDay endDay
                },
                params: {
                    wordKey: '',
                    workType: '',
                    startDay: undefined,
                    endDay: undefined,
                },
                pagination: {
                    currentPage: 1,
                    pageSize: 8,
                    total: 0,
                },
                workTypeOptionList: [],
            }
        },
        methods: {
            async exportExcel () {
                let excelData = null

                // 如果从列表选择了
                if (this.$refs.table.selection.length) {
                    excelData = this.$refs.table.selection.map((item, index) => ({ ...item, index: index + 1 })) // 无论在第几页，序号都从1开始
                } else {
                    let api = ''
                    if (this.$hasPerms('work-order-findAll')) {
                        api = this.api.workOrder.exportCompanyList
                    } else if (this.$hasPerms('work-order-findself')) {
                        api = this.api.workOrder.exportList
                    }

                    if (api) {
                        excelData = await this.http.get(api, {
                            pageNo: this.pagination.currentPage,
                            pageSize: this.pagination.pageSize,
                            ...this.params,
                        }).then(res => {
                            if (res.code === 200) {
                                res.data.fmpWorkOrderList.forEach((item, index) => {
                                    item.index = index + 1
                                })
                                return res.data.fmpWorkOrderList
                            }
                            return []
                        })
                    } else {
                        // 没权限，导出空列表
                        excelData = []
                    }
                }

                // 懒得写变量，正好可以搭配插件使用。。不要更改这个数据
                const th = ['序号', '工单编号', '作业类型', '地块名称', '地块编码', '填单人', '工号', '填单时间']
                const filterVal = ['index', 'number', 'workTypeName', 'massifName', 'massifNumber', 'operator', 'jobNumber', 'createTime']
                const [fileName, fileType, sheetName] = ['工单列表', 'xlsx', '工单列表']

                toExcel({
                    th,
                    data: excelData.map(row => filterVal.map(colFieldName => row[colFieldName])),
                    fileName,
                    fileType,
                    sheetName
                })
            },
            handleSelectionChange (rowList) {
                this.selectionRowList = rowList
            },
            loadWorkTypeOption () {
                this.http.get(this.api.workOrder.typeOptions).then(res => {
                    if (res.code !== 200) {
                        return
                    }
                    this.workTypeOptionList = res.workType
                })
            },
            loadTableData (page = 1) {
                if (!this.hasPerm) {
                    return
                }

                let api = ''
                if (this.$hasPerms('work-order-findAll')) {
                    api = this.api.workOrder.companyList
                } else if (this.$hasPerms('work-order-findself')) {
                    api = this.api.workOrder.list
                } else {
                    this.hasPerm = false
                    console.info('暂无数据查看权限')
                    return
                }

                const { pagination } = this
                pagination.currentPage = page

                this.http.get(api, {
                    pageNo: pagination.currentPage,
                    pageSize: pagination.pageSize,
                    ...this.params,
                }).then(res => {
                    if (res.code !== 200) {
                        this.tableData = []
                        this.$message.error(res.message)
                        return
                    }

                    this.pagination.total = Number(res.total)

                    res.fmpWorkOrderList.forEach((item, index) => {
                        item.index = (pagination.currentPage - 1) * pagination.pageSize + index + 1
                    })
                    this.tableData = res.fmpWorkOrderList
                })
            },
            handlePageChange () {
                const { pagination } = this
                this.loadTableData(pagination.currentPage)
            },
            handleSearch (fieldName) {
                const searchParams = this.searchParams
                switch (fieldName) {
                    case 'wordKey':
                    case 'workType':
                        this.params[fieldName] = searchParams[fieldName]
                        break
                    case 'dateRange':
                        if (searchParams.dateRange && searchParams.dateRange.length === 2) {
                            this.params.startDay = searchParams.dateRange[0]
                            this.params.endDay = searchParams.dateRange[1]
                        } else {
                            this.params.startDay = this.params.endDay = undefined
                        }
                        break
                }

                this.loadTableData()
            },
        },
        created () {
            this.loadTableData()
            this.loadWorkTypeOption()
        },
    }
</script>

<style lang="scss" scoped>
    .operate-bar {
        display: flex;
        justify-content: space-between;
    }
</style>
