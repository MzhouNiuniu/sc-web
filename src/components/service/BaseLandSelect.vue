<template>
    <el-select :value="value" placeholder="请选择基地" v-bind="$attrs" @input="$listeners.input" @change="handleChange">
        <el-option
            v-for="(item,index) in optionList"
            :key="index"
            :label="item.name"
            :value="item[valueKey]"
        />
    </el-select>
</template>

<script>
    // 基地选择组件
    export default {
        name: 'BaseLandSelect',
        props: {
            value: '',
            valueKey: {
                type: String,
                default: 'id',
                /**
                 id: "6"
                 name: "测试地块1"
                 number: "201910047191004701006"
                 */
            },
        },
        data () {
            this.optionList = []
            return {}
        },
        methods: {
            handleChange (number) {
                // 直接将整条数据传递出去了
                this.$emit('change', this.optionList.find(item => item[this.valueKey] === number))

                // 有的需要编号、有的需要id，有的id要补0.。。
                const curItem = this.optionList.find(item => item[this.valueKey] === number)
                this.$emit('update:id', curItem.id)
                this.$emit('update:name', curItem.name)
            },
        },
        created () {
            // 需要统一获取基地下拉接口（之后就可以移除props.data）
            /**
             * id
             * name
             * number
             * coordinate
             * position
             * */
            this.http.get(this.api.Massif.jumpAddMassif).then(res => {
                if (res && res.code == 200) {
                    this.optionList = res.data.obj.baseList || this.optionList  // 此接口有可能出现null
                    this.$forceUpdate()
                } else {
                    this.$message.error(res.message)
                }
            })
        },
    }
</script>

<style scoped lang="scss">

</style>
