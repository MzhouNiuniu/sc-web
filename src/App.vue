<template>
    <div id="app" class="main-box">
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {}
        },
        mounted () {
            console.log(this.packageJson['agri-version'])
        }
    }
</script>

<style lang="scss">
    @import './assets/css/reset.css';
    @import './assets/css/index.css';

    .success {
        .el-icon-success {
            font-size: 44px;
            color: #2285dc !important;
        }

        .el-icon-warning {
            font-size: 44px;
            color: #f27a76;
        }

        .el-message__content {
            padding-left: 70px;

            .title {
                font-size: 18px;
                height: 30px;
                line-height: 30px;
            }

            .subtitle {
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                color: #666666;

            }

            .hrefs {
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                color: #2285dc;
                display: inline-block;
            }
        }

    }
    .main-box{
       min-width: 1280px;
    }
</style>
