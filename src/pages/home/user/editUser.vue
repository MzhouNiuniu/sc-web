<template>
    <div>
        <p class="wrapper-title"><span>用户</span></p>

            <el-form ref="form" :rules="rules"  :model="seedling" label-width="140px" class="contents" :disabled="disabled">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="账号：" prop="userName">
                            <el-input v-model="seedling.userName" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                     <el-col :span="8">
                         <el-form-item label="密码：" prop="password">
                             <el-input type="password" v-model="seedling.password" placeholder="请输入内容"></el-input>
                         </el-form-item>
                     </el-col>
                 </el-row>
                <el-row>
                <el-form-item label="角色：" prop="role">
                    <el-select v-model="seedling.role" placeholder="请选择分类" >
                        <el-option
                            v-for="(item,index) in $roleList"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>


                </el-form-item>

            </el-row>
            </el-form>

        <div class="updata-button">
            <el-button v-if="!disabled" type="primary" @click="submit()">保存</el-button>
        </div>
    </div>
</template>
<script>
    import Editor from '@/components/ueditor/Editor'
    import { debounce } from '@/utils'
    import MultipleUploadImgs from "@/components/new-upLoadImg/MultipleUploadImgs";
    export default {
        name: 'addController',
        components: {
            Editor,
            MultipleUploadImgs
        },
        data () {
            return {
                disabled:false,
                rules:{
                    userName: [
                        { required: true, message: '账户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '密码', trigger: 'blur' },
                    ],
                    role: [
                        {  required: true, message: '角色', trigger: 'change' }
                    ],

                },
                seedling: {
                    userName:'',
                    password:'',
                    role:'',
                },
            }
        },
        methods: {
           async submit () {
               this.$refs['form'].validate( async(valid) => {
                   if (valid) {
                       let res
                       if(this.$route.query.id){
                            res = await this.http.post(this.api.user.changeInFo,this.seedling)
                       }
                       else{
                            res = await this.http.post(this.api.user.publish,this.seedling)
                       }
                       if(res.code==200){
                           this.$message.success('操作成功')
                           this.$router.push('/home/user')
                       }
                   }
               })

            },
            async getDetailsById(id){
                const res = await this.http.get(this.api.user.getDetailsById,{id})
                this.seedling=res.data
                this.$forceUpdate()
                console.log(this.seedling)

            }

        },
        created() {
            if(this.$route.query.id){
                if(this.$route.query.disabled){
                    this.disabled=true
                }
                this.getDetailsById(this.$route.query.id)
            }
            // this.addSeedling()
        }

    }
</script>
<style lang="scss" scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .seedlingDele {
        cursor: pointer;
        float: right;
        position: absolute;
        right: 10px;
    }

    .content-wrapper {
        position: relative;
    }

    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
    /*.contents{*/
        /*background: #fff;*/
    /*}*/

</style>
<style >

    .seedling-input-number .el-input-number__increase, .seedling-input-number .el-input-number__decrease {
        top: 2px;
    }
</style>

