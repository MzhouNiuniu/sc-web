<template>
   <div style="display:inline-block ">
       <el-button  v-if="item.status==0"  type="text" size="small"
                  @click="dialogFormVisible=true">审核
       </el-button>
       <el-dialog title="审核" :append-to-body="body" :visible.sync="dialogFormVisible">
           <el-form ref="form" :rules="rules"  :model="ruleForm">

           <el-radio v-model="status" :label="agree">通过</el-radio>
           <el-radio v-model="status" :label="refuse">不通过</el-radio>
           <el-form-item label="拒绝理由：" prop="reason" v-if="status==2">
               <el-input type="textarea" v-model="ruleForm.reason" placeholder="请输入内容"></el-input>
           </el-form-item>
           </el-form>

           <div slot="footer" class="dialog-footer">
               <el-button @click="dialogFormVisible=false">取 消</el-button>
               <el-button type="primary"  @click="submit">确 定</el-button>
           </div>
       </el-dialog>

   </div>
</template>

<script>

    export default {
        props:['item','url'],
        data() {
            return {
                ruleForm:{
                    reason:'',
                },
                rules:{
                    reason: [{ required: true, message: '请输入拒绝理由', trigger: 'blur' }
                ]},
                body:true,
                dialogFormVisible:false,
                status:1,
                agree:1,
                refuse:2
            }
        },
        watch:{
            status(){
                this.ruleForm.reason=''
            }
        },
        created(){
        },
        methods: {
            submit () {
                if(this.status==2){
                    this.$refs['form'].validate( async(valid) => {
                        if(valid){
                          this.changeStatus()
                        }
                    })
                }
                else{
                    this.changeStatus()
                }
            },
            async changeStatus(){
                let data={
                    id:this.item.id,
                    status:this.status
                }
                if(this.status==2){
                    data.reason=this.ruleForm.reason
                }
                console.log(this.status)
                console.log(data)
                const res = await this.http.get(this.url,data)
                if (res.code==200){
                    this.dialogFormVisible=false
                    this.ruleForm.reason=''
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
