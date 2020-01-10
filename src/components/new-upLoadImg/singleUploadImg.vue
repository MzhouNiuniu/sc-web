<template>
    <div>
        <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
   /**

    * 属性说明

    * @uploadUrl {String} 传入上传的地址，若不传，默认使用本项目的上传地址。
      @maxSize {Number}  这里限制单张图片的大小，重置默认的5MB
      @v-model  这里单个图片的使用非常简单，直接使用v-model 进行绑定显示的url即可，
                    不可以进行删除，可以进行替换,
    */
import baseURL from '@/utils/baseURL';
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        maxSize: {
            type: Number,
            default: 5
        },
        uploadUrl: {
            type: String,
            default: baseURL.jky + '/fileServer/uploadFile'
        }
    },
    data() {
        this.elFormItem = null
        return {
        imageUrl: ''
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        this.imageUrl = file.response.data[0];
        this.$emit("input", this.imageUrl);
        this.elFormItem && this.elFormItem.$emit('el.form.change',  this.imageUrl)
        },
        beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt2M) {
            this.$message.error(`上传头像图片大小不能超过 ${this.maxSize}MB!`);
        }
        return isLt2M;
        }
    },
    created() {
        this.imageUrl = this.value;
    },
    mounted () {
        const getParentByName = parentName => {
            let parent = this
            while (parent.$options.name !== parentName) {
                if (!parent.$parent) return null
                parent = parent.$parent
            }
            return parent
        }
        this.elFormItem = getParentByName('ElFormItem')
    },
    activated() {
        this.imageUrl = this.value;
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
