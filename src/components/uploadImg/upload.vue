<template>
    <div class="uploadImg-wrapper">
        <el-upload
            class="upload-demo"
            :action="url"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-exceed="exceed"
            :accept = 'accept'

            :headers="token"
            :limit="limit"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>

</template>
<!--accept=".doc,.docx,.rar,.zip,.xls,.xlsx"-->
<!--accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document，application/x-zip-compressed,application/octet-stream"-->

<script>
    export default {
        props:{
            value: {
                default: ''
            },
            limit: {
                type: Number,
                default:1
            },
            list:{
                type:String
            },
            accept:{
                type:String
            }
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                imgList:[],//传给后台的数据
                addUrl:'',
                ishidden:false,
                removeUrl:'',//删除之后的url
                updataComeUrl:[],
                url:'',
                token:{},
                fileList:[]
            };
        },
        watch:{
            value(value){
                console.log("value****")
                console.log(value)
                if(value != ''){
                    this.imgList=value
                    this.fileList = []
                    this.fileList.push({url:value.join(','),name:'123'})
                    console.log(this.fileList)
                    if(this.fileList.length >= this.limit){
                        this.ishidden = true
                    }
                }else{
                    console.log('123')
                    this.fileList = []
                }
            },
            imgList(val){
                console.log(val)
                this.$emit('input',val)
            },
        },
        mounted(){
            this.url = `${this.api.fileServer.uploadFile}`
            this.token = {'Authorization': 'Bearer ' + window.$getToken()}
        },
        methods: {
            handleChange(file, fileList) {
                this.fileList3 = fileList.slice(-3);
            },
            handleRemove(file, fileList) {
                console.log(file.url)
                console.log(typeof (file.url))
                if((typeof (file.url)) == 'object'){
                    console.log("11")
                    try{
                        console.log("删除")
                        this.ishidden = false
                        this.imgList.splice(0, 1)
                        this.$nextTick(()=>{
                            this.fileList=[]
                            this.ishidden = false
                        })
                        console.log(this.imgList)
                    }catch(e){
                        console.log('图片的路径变了')
                    }

                }else if((typeof (file.url)) == 'string'){
                    console.log("22")
                    if(typeof(file.url.split("?")[1]) == 'undefined'){
                        console.log("删除1***********")
                        try{
                            console.log(0)
                            this.fileList=[]
                            this.imgList.splice(index, 1)
                            this.ishidden = false

                        }catch(e){
                            console.log('图片的路径变了')
                        }
                    }else{
                        console.log("删除2*******")
                        var index = this.imgList.indexOf(file.url.split("?")[1].split("=")[1])
                        this.imgList.splice(index, 1)
                        this.ishidden = false
                    }
                }
                console.log("删除了文件")
                this.$nextTick(()=>{
                    this.fileList=[]

                })
                console.log(this.imgList)
            },

            handleAvatarSuccess:function(res, file, fileList){
                console.log("上传成功*****")
                console.log(res)
                console.log(file)
                console.log(fileList)
                console.log(this.imgList)
                if(this.imgList.length <= this.limit){
                    if(res.code == 200){
                        this.imgList = []
                        this.imgList.push(res.data[0])

                        this.$nextTick(()=>{
                            this.fileList=[]
                            var newList = {
                                name:fileList[0].name,
                                url:res.data[0]
                            }
                            this.fileList.push(newList)
                            console.log(this.fileList)
                        })
                    }
                }
                console.log("更新了文件")
                console.log(this.fileList)
                console.log(this.imgList)
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 4;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 4MB!');
                }
                return isLt2M;
            },
            exceed:function(files, fileList){
                // console.log(files)
            },
            clearFiles:function(){  //清除已上传的文件
                console.log("清除**********")
                this.imgList = []
                this.fileList = []
                this.$nextTick(()=>{
                    this.fileList=[]
                    this.ishidden = false
                })
                this.$refs.uploadCode.clearFiles();

                this.ishidden = false
            }
        }
    }
</script>

<style scoped>
    .uploadImg-wrapper .img{
        width: 100px;
        height: 100px;
    }
    >>>.hiddenIcon .el-upload--picture-card {
        display: none;
    }
    /deep/.dialogImage .el-dialog__header {
        padding: 40px 20px 10px;
    }


</style>
