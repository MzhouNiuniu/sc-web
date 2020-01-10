<template>
    <div>
        <p class="wrapper-title"><span>新增题目</span></p>

            <el-form ref="form" :disabled="disabled" :rules="rules" :model="seedling" label-width="140px" class="contents">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="题目类型：" prop="type">
                            <el-select v-model="seedling.type" placeholder="请选择类型"  @change="modifyType">
                                <el-option
                                    v-for="(item,index) in $optionList1"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="试题分类：" prop="dataType">
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
                    <el-col :span="16" >
                        <el-form-item label="关联知识点：" >
                        <el-select
                            v-model="seedling.knowledgeId"
                            clearable

                            filterable
                            remote
                            reserve-keyword
                            placeholder="请选择关联知识点"
                            :remote-method="remoteMethod"
                            :loading="loading">
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            >
                                <span style="float: left;width: 600px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ item.title }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{$optionList[item.dataType].name }}</span>
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col >
                </el-row>

                <el-row>
                    <el-form-item label="题干：" prop="topic">
                        <el-col :span="15">
                        <el-input type="textarea" v-model="seedling.topic" placeholder="请输入内容"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>

                <el-row  v-if="seedling.type!=2" >
                    <el-form-item  :label="`选项:${index+1}`"  :key="index" v-for=" (item,index) in seedling.option">
                        <el-col :span="15"> <el-input  v-model="item.value" placeholder="请输入内容"></el-input></el-col>
                        <el-button type="danger"  style="margin-left: 20px" @click="handleClose(index)" > 删除</el-button>
                    </el-form-item>
                    <el-button @click="add" v-if="seedling.type!=2" type="primary"  style="margin-left: 380px"> 添加一个选项</el-button>
                </el-row>
                <el-row >
                    <el-form-item label="正确答案："  prop="rightAnswer">
                            <el-radio v-if="seedling.type==0"  v-model="seedling.rightAnswer" :label="index" v-for="(item,index) in seedling.option">选项{{index+1}}</el-radio>
                        <el-checkbox-group v-if="seedling.type==1" v-model="seedling.rightAnswer">
                            <el-checkbox v-for="(item,index) in seedling.option" :key="index"  :label="index">选项{{index+1}}</el-checkbox>
                        </el-checkbox-group>
                        <div   v-if="seedling.type==2">
                            <el-radio v-model="seedling.rightAnswer" :key="index"  :label="index" v-for="(item,index) in seedling.option">{{verdict[index]}}</el-radio>
                        </div>
                    </el-form-item>
                </el-row>
            </el-form>

        <div class="updata-button">
            <el-button type="primary" @click="submit()"  v-if="!disabled">保存</el-button>
        </div>
    </div>
</template>
<script>
    import Editor from '@/components/ueditor/Editor'
    import { debounce } from '@/utils'
    export default {
        name: 'addController',
        components: {
            Editor,
        },
        data () {
            return {
                disabled:false,
                loading:false,
                form:{
                    title:'',
                    content:''
                },
                rules:{
                    topic: [
                        { required: true, message: '是输入标题', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' },
                    ],

                    dataType: [
                        {  required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    rightAnswer: [
                        { required: true, message: '请选择正确答案', trigger: 'change'  }
                    ],

                },
                radio:0,
                verdict:['正确','错误'],
                seedling: {
                    topic:'',
                    type:0,
                    dataType:0,
                    option:[
                        {value:''},
                        {value:''}
                    ],
                    rightAnswer:'',
                    knowledgeId:null
                },
                radio1:[{

                }],
                options:[],
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
            }
        },
        methods: {
            modifyType(n){
                    if(n==0){
                        this.seedling.option=[
                            {value:''},
                            {value:''}
                        ]
                        this.seedling.rightAnswer=''
                    }
                    if(n==1){
                        this.seedling.option=[
                            {value:''},
                            {value:''}
                        ]
                        this.seedling.rightAnswer=[]
                    }
                    if(n==2){
                        this.seedling.rightAnswer=''
                        this.seedling.option=[
                            {value:''},
                            {value:''}
                        ]
                    }
            },
            handleClose(index) {
                this.seedling.option.splice(index, 1);
            },
            submit() {
                this.$refs['form'].validate( async(valid) => {
                    if (valid) {
                       const  res = await this.http.post(this.api.questionBank.publish,this.seedling)
                        if(res.code==200){
                            this.$message.success('操作成功')
                            this.$router.push('/home/questionBank')
                        }
                    }
                })
            },
            add(){
                this.seedling.option.push(  {value:'',correct:false})
            },
            saveContent() {
                const data = JSON.parse(JSON.stringify(this.form))
                if (this.modify != null) {
                    this.seedling.advantage[this.modify] = data
                }
                else {
                    this.seedling.advantage.push(data)
                }
                this.dialogFormVisible = false
                this.form.title = ''
                this.form.content = ''
            },
            modifyContent(item, index) {
                this.form.title = item.title
                this.form.content = item.content
                this.modify = index  //标识进入修改模式
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
                const res = await this.http.get(this.api.questionBank.getDetailsById,{id})
                const knowledge = await this.http.get(this.api.knowledge.getDetailsById,{id:res.data.knowledgeId})
                if(knowledge.data){
                    this.options.push(knowledge.data)
                }
                if(res.data.type==1){
                    res.data.rightAnswer.forEach((item,index)=>{
                        res.data.rightAnswer[index]=Number(item)
                    })
                }
                else{
                    res.data.rightAnswer= Number(res.data.rightAnswer)
                }
                console.log(res.data)
                this.seedling=res.data
                console.log(this.seedling)
                this.$forceUpdate()
                console.log(this.seedling)

            },
            async remoteMethod(query){
                if ( query!== '') {
                    this.loading = true;
                    const params={
                        page:1,
                        limit:8,
                        keyWords:query
                    }
                    const res = await this.http.get(this.api.knowledge.getList,params)
                    this.options=res.data.rows
                    this.loading = false;

            }


        }},
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
        float: rightAnswer;
        position: absolute;
        rightAnswer: 10px;
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

