<template>
    <div class="input-limit">
        <el-input v-model="input" size="small " ref='input' @input="$emit('input', input)" :placeholder="placeholder"
                  :disabled="disabled"><i
            class=" el-input__icon el-limit" slot="suffix"><span id='el-limit-length-start'>{{toLength}}</span>/<span>{{limitLength}}</span></i>
        </el-input>
    </div>
</template>
<style lang="scss" scoped="scoped">
    .input-limit /deep/ .el-input--small .el-input__inner {
        padding-left: 10px;
        padding-right: 45px;
    }

    .input-limit /deep/ .el-input__suffix i {
        font-size: 12px;
        font-style: normal;
    }
</style>
<script type="text/ecmascript-6">
    export default {
        props: {
            placeholder: {
                default: ''
            },
            limitLength: {
                default: 50
            },
            value: {
                default: ''
            },
            disabled: {
                default: false
            }

        },
        data() {
            return {
                input: '',
                toLength:0
            }
        },
        created() {
        },
        methods: {},
        watch: {
            input(val) {
                //监听改变当前输入长度

                this.toLength = val.length
                console.log(val.length)

            },
            value(value){
                this.input = this.value
            }
        },
        mounted() {
            //限制字数
            this.$refs.input.$refs.input.maxLength = this.limitLength
            //接受父组件初始化的值


        }


    }
</script>
