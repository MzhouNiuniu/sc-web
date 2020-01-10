<template>
   <div style="display:inline-block ">
       <el-button type="text" size="small"
                  @click="stickHandle()">{{item.stick==0?'置顶':'取消置顶'}}
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
            stickHandle () {
                this.$confirm(`确定进行操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.stick(this.item.id)
                }).catch(() => {
                })
            },
            async stick(id){
               let params={
                   id
               }
               if(this.item.stick==0){
                   params.stick=1
               }
               else{
                   params.stick=0
               }
                const res = await this.http.get(this.url,params)
                if (res.code==200){
                    this.$message.success('操作成功')
                    this.$parent.$parent.$parent.getList()
                }
                else{
                    this.$message.error(res.message)
                }
            },
        }
    }
</script>
