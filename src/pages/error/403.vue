<template>
    <section>
        <h1 style="font-size: 18px;">
            亲爱的用户，您好！由于您没有该权限，故无法进行该项操作！
        </h1>
        <br/>
        <router-link to="/">
            <el-button type="primary" size="small">返回首页</el-button>
        </router-link>
    </section>
</template>

<script>
    export default {
        name: 'Error403',
    }
</script>

<style scoped lang="scss">

</style>
