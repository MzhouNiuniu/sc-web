<template>
    <section>
        <h1 style="font-size: 18px;">
            亲爱的用户，您好！由于您没有该权限，故无法进行该项操作！
        </h1>
        <br/>
        <el-button type="primary" size="small" @click="back()">返回</el-button>
    </section>
</template>

<script>
    export default {
        name: 'NotAllow',
        /**
         * 暂时与企业页面，保持一致...
         * 正常的是，手动点按钮
         * */
        methods: {
            checkIsNeedToBack () {
                return window.$fromRouter.path !== '/' && window.$fromRouter.path !== '/login'
            },
            back () {
                if (this.checkIsNeedToBack()) {
                    this.$router.back()
                } else {
                    this.$store.dispatch('user/logout')
                }
            },
        },
        created () {
            this.$message.error('亲爱的用户，您好！由于您没有该权限，故无法进行该项操作')

            if (this.checkIsNeedToBack()) {
                this.$router.back()
            }
        },
    }
</script>

<style scoped lang="scss">

</style>
