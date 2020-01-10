<template>
    <div class="pagination-wrapper">
        <span class="total-num">共 {{totalNum}} 条</span>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="8"
                layout=" prev, pager, next, jumper"
                :total="totalNum">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name:'pagination',
        props:{
            totalNum:{
                type:Number,
                default:0
            },
            currentPage:{
                type:Number,
                default:1
            }
        },
        methods:{
            handleSizeChange(val){
                this.$emit('handleSizeChange',val)
            },
            handleCurrentChange(val){
                this.$emit('handleCurrentChange',val)
            }
        }
    }
</script>
<style scoped lang="scss">
    .pagination-wrapper {
        span.total-num {
            font-size: 13px;
            color: #606266;
        }
    }
</style>
