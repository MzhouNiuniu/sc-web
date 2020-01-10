<template>
    <div class="uploadImg-wrapper">
        <el-upload
                :action='url'
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :on-exceed="exceed"
                :limit="limit"
                :before-upload="beforeAvatarUpload"
                accept="image/gif,image/jpeg,image/jpg,image/png"
                :class="{hiddenIcon: ishidden}"
                ref="uploadCode"
                :headers="token"
                :file-list="list">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        imgList: [],//传给后台的数据
        addUrl: '',
        ishidden: false,
        removeUrl: '',//删除之后的url
        updataComeUrl: [],
        url: '',
        token: {},
        fileList2: []
      }
    },
    props: {
      limit: {
        type: Number,
        default: 1
      },
      limitSize: {
        type: Number,
        default: 2
      },
      list: {
        type: Array,
        default: []
      }
    },
    watch: {
      list: {
        handler (val) {
          if(val.length==this.limit){
            this.ishidden = true
          }
          this.imgList = []
          val.map((item) => {
            this.imgList.push(item.url)
          })
        },
        immediate: true
      },
      // list(val) {
      //   this.imgList = [];
      //     val.map((item) => {
      //         this.imgList.push(item.url)
      //     })
      // },
      imgList (val) {
        this.$emit('getImgList', val)
        if (val.length < this.limit) {
          this.ishidden = false
        }
      }
    },
    mounted () {
      this.url = `${this.api.fileServer.uploadFile}`
      this.token = {'Authorization': 'Bearer ' + window.$getToken()}
    },
    methods: {
      handleRemove (file, fileList) {
        var imgList = this.imgList
        var index = imgList.indexOf(file.url)
        imgList.splice(index, 1)
        this.imgList = imgList
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleAvatarSuccess: function (res, file, fileList) {
        if (this.imgList.length <= this.limit) {
          if (res.code == 200) {
            this.imgList.push(res.data[0])
            if (this.imgList.length >= this.limit) {
              this.ishidden = true
            }
          } else {
            this.$message.error('上传图片失败！')
          }
        } else {
          this.ishidden = true
        }
      },
      beforeAvatarUpload (file) {
        const isJPG = /^image\/(jpeg|png|gif|jpg)$/.test(file.type)
        const isLt2M = file.size / 1024 / 1024 < this.limitSize

        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg/png/gif 格式!')
        }
        if (!isLt2M) {
          this.$message.error(`上传图片大小不能超过 ${this.limitSize}MB!`)
        }
        return isJPG && isLt2M
      },
      exceed: function (files, fileList) {
        console.log(files)
      },
      clearFiles: function () {  //清除已上传的文件
        this.$refs.uploadCode.clearFiles()
        this.ishidden = false
      }
    }
  }
</script>

<style scoped>
    .uploadImg-wrapper .img {
        width: 100px;
        height: 100px;
    }

    >>> .hiddenIcon .el-upload--picture-card {
        display: none;
    }
</style>
