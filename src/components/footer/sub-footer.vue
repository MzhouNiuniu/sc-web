<template>
    <div>
        <!-- 杭州金恪云数据技术有限公司 版权所有©(2018-2019） -->
        版本号：{{version}}</div>

</template>

<script>
    export default {
        data() {
            return {
                version:this.packageJson['agri-version'],
            }
        }
    }
</script>

<style>

</style>
