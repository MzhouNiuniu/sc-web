<template>
    <div class="uploadImg-wrapper">
        <el-upload
            class="uploadImg-wrapper"
            :action="url"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-exceed="exceed"
            :limit="limit"
            :before-upload="beforeAvatarUpload"

            accept="image/gif,image/jpeg,image/jpg,image/png,word"
            :class="{hiddenIcon: ishidden}"
            ref="uploadCode"
            :headers="token"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true" class="dialogImage">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<!--accept=".gif,.jpeg,.jpg,.png,.doc,.rar,.txt"-->

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
            visible:Boolean
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
                this.imgList=value
                this.fileList = []
                this.fileList.push({url: value})
                if(this.fileList.length >= this.limit){
                    this.ishidden = true
                }
            },
            imgList(val){
                this.$emit('input',val)
            },
            visible(val){
                if(!val){
                    this.fileList=[]
                    this.ishidden = false
                }
            }
        },
        mounted(){
            this.url = `${this.api.fileServer.uploadFile}`
            this.token = {'Authorization': 'Bearer ' + window.$getToken()}
        },
        methods: {
            handleRemove(file, fileList) {
                if((typeof (file.url)) == 'object'){
                    try{
                        this.ishidden = false
                        this.imgList.splice(0, 1)
                        this.$nextTick(()=>{
                            this.fileList=[]
                            this.ishidden = false
                        })
                    }catch(e){
                        console.log('图片的路径变了')
                    }

                }else if((typeof (file.url)) == 'string'){
                    this.imgList = this.imgList.split(',');
                    try{
                        this.ishidden = false
                        this.imgList.splice(0, 1)
                        this.$nextTick(()=>{
                            this.fileList=[]
                            this.ishidden = false
                        })
                    }catch(e){
                        console.log('图片的路径变了')
                    }
                }
            },
            handlePictureCardPreview(file) {
                if(typeof (file.url) == 'string'){
                    this.dialogImageUrl = file.url
                }else{
                    this.dialogImageUrl = file.url.join(',');
                }
                this.dialogVisible = true;
            },
            handleAvatarSuccess:function(res, file, fileList){
                if(typeof (this.imgList) == 'object'){
                    if(this.imgList.length <= this.limit){
                        // console.log(res)
                        if(res.code == 200){
                            this.imgList.push(res.data[0])
                            if(this.imgList.length >= this.limit){
                                this.ishidden = true
                            }
                        }else{
                            console.log('上传图片失败')
                        }
                    }else{
                        this.ishidden = true
                    }
                }else{
                    if(res.code == 200){
                        this.imgList = res.data[0]
                        this.ishidden = true
                    }else{
                        console.log('上传图片失败')
                    }
                }

            },
            beforeAvatarUpload(file) {
                const isJPG = /^image\/(jpeg|png|gif|jpg)$/.test(file.type);
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 jpg/png/gif 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 4MB!');
                }
                return isJPG && isLt2M;
            },
            exceed:function(files, fileList){
                // console.log(files)
            },
            clearFiles:function(){  //清除已上传的文件
                this.imgList = []
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
