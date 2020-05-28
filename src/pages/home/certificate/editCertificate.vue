<template>
    <div>
        <p class="wrapper-title"><span>课程</span></p>

            <el-form ref="form" :rules="rules"  :model="seedling" label-width="140px" class="contents" :disabled="disabled">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="证书名称：" prop="name">
                            <el-input v-model="seedling.name" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                <el-form-item label="证书封面：" prop="cover">
                    <Multiple-upload-imgs :fileLimit="1" v-model="seedling.cover"/>
                </el-form-item>
                 <el-form-item label="证书图：" prop="banner">
                         <Multiple-upload-imgs :fileLimit="1" v-model="seedling.banner"/>
                 </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="证书优势：" prop="advantage">
                    <el-collapse  v-if="seedling.advantage.length>0" >
                        <el-collapse-item v-for="(item,index) in seedling.advantage" :title="item.title" :name="index">
                            <div>{{item.content}}</div>
                            <div style="margin-top: 20px"> <el-button @click="modifyContent(item,index)" type="primary" size="mini">编辑</el-button>  <el-button type="danger" size="mini" @click="deleteContent(item,index)">删除</el-button></div>
                        </el-collapse-item>
                    </el-collapse>
                        <el-button style="margin-top: 20px" @click="addContent">添加</el-button>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="特色标签：" prop="label">
                        <el-tag
                            :key="tag"
                            v-for="tag in seedling.label"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加一个标签</el-button>

                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="证书简介：" prop="brief">
                        <el-input type="textarea" v-model="seedling.brief" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="证书大纲：" prop="baseId">

                        <Editor   :showContent='seedling.outline'
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
        <el-dialog title="证书优势" :visible.sync="dialogFormVisible">
            <el-form :model="form" >
                <el-form-item label="优势标题"   >
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="form">
                <el-form-item label="优势内容" >
                    <el-input v-model="form.content"  type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="saveContent">确 定</el-button>
            </div>
        </el-dialog>
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
                    name: [
                        { required: true, message: '请输入证书名称', trigger: 'blur' },
                    ],
                    brief: [
                        { required: true, message: '请输入简介', trigger: 'blur' },
                    ],
                    cover: [
                        {  required: true, message: '请上传图片', trigger: 'change' }
                    ],
                    banner: [
                        {  required: true, message: '请上传图片', trigger: 'change' }
                    ],
                    advantage: [
                        {  type: 'array', required: true, message: '请填写特点', trigger: 'change' }
                    ],
                    label: [
                        {  type: 'array',required: true, message: '请填写标签', trigger: 'change' }
                    ],
                },
                form:{
                    title:'',
                    content:''
                },
                seedling: {
                    name:'',
                    label:[],
                    brief:'',
                    outline:'',
                    cover:'',
                    advantage:[]
                },

                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                dialogFormVisible:false,
                modify:null
            }
        },
        methods: {
           async submit () {
         this.seedling.outline= this.$refs.editor.editorContent

               this.$refs['form'].validate( async(valid) => {
                   if (valid) {
                       let res
                       if(this.$route.query.id){
                            res = await this.http.post(this.api.certificate.changeInFo,this.seedling)
                       }
                       else{
                            res = await this.http.post(this.api.certificate.publish,this.seedling)
                       }
                       if(res.code==200){
                           this.$message.success('操作成功')
                           this.$router.push('/home/certificate')
                       }
                   }
               })

            },
            handleClose(tag) {

                this.seedling.label.splice(this.seedling.label.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    // this.dynamicTags.push(inputValue);
                    this.seedling.label.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
                this.$refs['form'].validateField('label');

            },
            saveContent() {
                const data = JSON.parse(JSON.stringify(this.form))
                console.log(this.modify)
                console.log('save')
                if (this.modify != null) {
                    console.log(this.modify)
                    this.seedling.advantage[this.modify] = data
                    console.log(this.seedling.advantage[this.modify])
                }
                else {
                    this.seedling.advantage.push(data)
                }
                this.dialogFormVisible = false
                this.form.title = ''
                this.form.content = ''
                this.$refs['form'].validateField('advantage');
            },
            modifyContent(item, index) {
                this.form.title = item.title
                this.form.content = item.content
                this.modify = index  //标识进入修改模式
                console.log(index)
                this.dialogFormVisible = true
            },
            addContent() {
                this.dialogFormVisible = true;
                this.modify = null;
                this.form.title = '';
                this.form.content = '';
            },
            deleteContent(item, index) {
                this.$confirm('是否确定删除？', item.title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.seedling.advantage.splice(index, 1);
                }).catch(() => {
                })

            },
            async getDetailsById(id){
                const res = await this.http.get(this.api.certificate.getDetailsById,{id})
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

