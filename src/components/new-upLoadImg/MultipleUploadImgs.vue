<template>
    <div>
        <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :limit="fileLimit"
            :on-success='afterLoadSuccess'
            :before-upload="beforeAvatarUpload"
            :disabled="authenStatus"

            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>


<script>
    /**

     * 属性说明
     *  属性名
     @uploadUrl 传入上传的uploadUrl，如果没有传入，默认就是用本地的上传路径
     @fileLimit 传入fileLimit 来重置默认的5条上传限制，
     @maxSize  传入最大图片的大小maxSize，来重置 最大5MB，
     @v-model  进行绑定上传的图片fileList， 可以是一个数组，也可以是一个数组的json字符串
     结构如下： [
     {
                    url: 'http://images.oraro.net/20190606/1559799098982.png'
                },
     {
                    url: 'http://images.oraro.net/20190606/1559799098982.png'
                },
     {
                    url: 'http://images.oraro.net/20190606/1559799098982.png'
                }
     ]
     */
    import baseURL from '@/utils/baseURL'
    import api from '@/utils/api'
    export default {
        props: {
            value: {
                type: [Array, String],
                default: () => {
                }
            },
            maxSize: {
                type: Number,
                default: 5
            },
            uploadUrl: {
                type: String,
                default:api.fileServer.uploadFile
            },
            fileLimit: {
                type: Number,
                default: 5
            },
            authenStatus: false
        },
        data () {
            this.elFormItem = null
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                uploadFileList: null // 上传成功之后的list，保存下来，进行对比，防止监听器导致的重复渲染问题。
            }
        },
        methods: {
            handleRemove (file, fileList) {
                // 这里表示当上传不符合条件的文件时触发的删除钩子进行的处理，防止出现闪图的问题。
                if (this.value.length === fileList.length) {
                    return
                }
                const temp = this.getImgList(fileList)
                this.uploadFileList = temp
                this.$emit('input', temp)
                this.elFormItem && this.elFormItem.$emit('el.form.change', temp)
            },
            handlePictureCardPreview (file) {
                window.open(file.url, '_blank')
                return
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            getUrl (val) {
                return (val.response && val.response.data && val.response.data[0]) || val.url
            },
            getImgList (list) {
                // list 为element默认的 文件list ,我们要拿出传给后台的url数组。
                return list.map(ele => {
                    return {
                        url: this.getUrl(ele)
                    }
                })
            },
            beforeAvatarUpload (file) {
                // 上传大文件的图片的时候，会重复上传两次（element的问题），且第二次没有类型，导致类型错误重复抛出问题。
                if (!file.type) {
                    return false
                }
                if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
                    const isLt2M = file.size / 1024 / 1024 < this.maxSize
                    if (!isLt2M) {
                        this.$message.error(`上传图片大小不能超过 ${this.maxSize}MB!`)
                    }
                    return isLt2M
                } else {
                    this.$message({
                        type: 'warning',
                        message: '图片类型必须是jpg,png中的一种'
                    })
                    return false
                }
            },
            afterLoadSuccess (response, file, fileList) {
                if (response.code === 200) {
                    this.uploadFileList = this.getImgList(fileList)
                    // 这里的fileList 会被进行转化
                    const temp = this.getImgList(fileList)
                    this.$emit('input', temp)
                    this.elFormItem && this.elFormItem.$emit('el.form.change', temp)
                } else {
                    this.$message({
                        type: 'error',
                        message: '上传失败！'
                    })
                }
            },
            initFileList () {
                // 防止出现重复渲染的问题。
                if (Array.isArray(this.value) && !this.uploadFileList) {
                    this.fileList = this.getImgList(this.value)
                } else if (typeof this.value === 'string' && this.value) {
                    try {
                        const list = JSON.parse(this.value)
                        this.fileList = this.getImgList(list)
                    } catch (error) {
                        this.$message({
                            type: 'warning',
                            message: '图片的值的格式不符合！'
                        })
                    }

                }
            },
            handleExceed (files, fileList) {
                this.$message.warning(`当前限制上传 ${this.fileLimit} 张图片`)
            },
            beforeRemove (file, fileList) {
                // 这里有一个element的bug，出发上传失败的时候，会回调，删除当前事件。这里做处理。
                if (file.size && !file.response) {
                    return
                }
                return this.$confirm(`确定移除图片吗？`)
            }
        },
        watch: {
            value () {
                this.initFileList()
            }
        },
        created () {
            this.initFileList()

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
        activated () {
            this.initFileList()
        }
    }
</script>
<style scoped lang="scss">
    /deep/ {
        .el-upload-list {
            display: inline-block;
            margin-top: -8px;
            vertical-align: middle;
            line-height: 0;
        }

        .el-upload-list__item {
            position: relative;
            margin-bottom: 0;
            margin-top: 8px;

            img {
                position: absolute;
                /*width: auto;*/
                height: auto;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
</style>
