<template>
   <div style="display:inline-block ">
       <el-button type="text" size="small"
                  @click="deleteHandle()">删除
       </el-button>
   </div>
</template>

<script>

    export default {
        props:['item','url'],
        data() {
            return {
            }
        },

        created(){
        },
        methods: {
            deleteHandle () {
                this.$confirm(`确定进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete(this.item.id)
                }).catch(() => {
                })
            },
            async delete(id){
                const res = await this.http.get(this.url,{id})
                if (res.code==200){
                    this.$message.success('删除成功')
                    this.$parent.$parent.$parent.getList()
                }
                else{
                    this.$message.error(res.message)

                }
            },
        }
    }
</script>
