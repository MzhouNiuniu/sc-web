<template>
    <section>
        <p class="wrapper-title">
            <span>课程列表</span>
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
                            v-model="keyWords"
                            :maxlength="50"
                            placeholder="请输入关键字搜索"
                            size="large"

                            style="width:220px;"
                        >
                            <el-button slot="append" @click="handleSearch()" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button
                        type="primary"
                        @click="$router.push('/home/editCertificate')"
                    >新增
                    </el-button>
                </div>
            </div>

            <el-table
                ref="table"
                :data="tableData"
            >

                <el-table-column v-for="(item,index) in columns" :key="index" v-bind="item" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        {{row[item.prop] || '/'}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip  label="状态">
                    <template slot-scope="{row}">
                        {{$status[row['status']]}}
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    header-align="center"
                    align="center"
                    width="230"
                    label="操作">
                    <template slot-scope="scope">
                        <ABth :item="scope.row" :url="api.certificate.changeStatus"/>
                        <SBth :item="scope.row" url="/home/editCertificate"></SBth>
                        <EBth :item="scope.row" url="/home/editCertificate"></EBth>
                        <DBth :item="scope.row"  :url="api.certificate.deleteById"/>
                        <STBth :item="scope.row"  :url="api.certificate.changeStick"/>
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

    export default {

        data () {
            this.columns = [
                {
                    prop: 'name',
                    label: '课程名称',
                },
                {
                    prop: 'brief',
                    label: '课程简介',
                },
                {
                    prop: 'releaseTime',
                    label: '发布时间',
                }
            ]

            return {
                pagination:{
                    currentPage:1,
                    pageSize:8,
                    total:0
                },
                type:[{
                    name:'web前端',
                    value:0
                },{
                    name:'运维',
                    value:1,

                }],
                tableData:[],
                searchParams: {
                    keyWords: '',

                },
                keyWords:''
            }
        },
        methods: {
            modify(id){
                this.$router.push({path:'/home/editCertificate',query:{id}})
            },
            handleSearch(){
                this.searchParams.keyWords=JSON.parse(JSON.stringify(this.keyWords))
                this.getList()
            },
            handlePageChange(val){
                this.pagination.currentPage=val
                this.getList()
            },
            async getList(){
                    const params={
                        page:this.pagination.currentPage,
                        limit:8,
                        keyWords:this.searchParams.keyWords
                    }
                const res = await this.http.get(this.api.certificate.getList,params)
                this.tableData=res.data.rows
                this.pagination.total=res.data.count
            }
        },
        created () {
            this.getList()
        },
    }
</script>

<style lang="scss" scoped>
    .operate-bar {
        display: flex;
        justify-content: space-between;
    }
    /deep/ .is-leaf{
        color: #383838;
        background: #F3F3F3;
        font-weight: 600;
    }
</style>
