<template>
    <div>
        <p class="wrapper-title"><span>微小知识</span></p>

            <el-form ref="form" :rules="rules"  :model="seedling" label-width="140px" class="contents" :disabled="disabled">
                <el-row>
                    <el-col :span="16">
                <el-form-item label="知识点分类：" prop="dataType">
                        <el-select v-model="seedling.dataType" placeholder="请选择分类" >
                            <el-option
                                v-for="(item,index) in $optionList"
                                :key="index"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>


                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                    <el-form-item label="标题：" prop="title">
                        <el-input type="input" v-model="seedling.title" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="内容：" prop="content">

                        <Editor   :showContent='seedling.content'
                                  :disabled="disabled"
                                  ref="editor"
                        ></Editor>
                    </el-form-item>
                </el-row>


            <!--</el-row>-->
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
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                    ],
                    dataType: [
                        { required: true, message: '请选择', trigger: 'change' },
                    ],
                },
                seedling: {
                    title:'',
                    content:'',
                    dataType:''
                },
            }
        },
        methods: {
           async submit () {
         this.seedling.content= this.$refs.editor.editorContent
               this.$refs['form'].validate( async(valid) => {
                   if (valid) {
                       let res
                       if(this.$route.query.id){
                            res = await this.http.post(this.api.knowledge.changeInFo,this.seedling)
                       }
                       else{

                            res = await this.http.post(this.api.knowledge.publish,this.seedling)
                       }
                       if(res.code==200){
                           this.$message.success('操作成功')
                           this.$router.push('/home/knowledge')
                       }
                   }
               })

            },

            async getDetailsById(id){
                const res = await this.http.get(this.api.knowledge.getDetailsById,{id})
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

