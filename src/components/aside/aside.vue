<template>
    <div class="aside-wrapper">
        <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true">
            <!--<el-menu-item  index="/login">登录</el-menu-item>-->
            <el-menu-item  index="/home/course">课程列表</el-menu-item>
            <el-menu-item  index="/home/certificate">证书列表</el-menu-item>
            <el-menu-item  index="/home/questionBank">题库</el-menu-item>
            <el-menu-item  index="/home/knowledge">微小知识</el-menu-item>
            <el-menu-item  index="/home/headline">书辰头条</el-menu-item>
            <el-menu-item  index="/home/test">考试信息发布列表</el-menu-item>
            <el-menu-item  index="/home/user">用户列表</el-menu-item>


        </el-menu>
        <div class="shrink" @click="takeCollapse">
            <i :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></i>
        </div>
    </div>
</template>

<script>
    import './iconfont/iconfont.js';
    export default {
        data() {
            return {
                isCollapse:false,
            }
        },
        created(){
            // this.aside = this.asideAll
            // this.aside=JSON.parse(sessionStorage.getItem('aside'))
        },
        components: {},
        methods:{
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            takeCollapse:function(){
                if(this.isCollapse){
                    this.isCollapse = false;
                }else{
                    this.isCollapse = true
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './iconfont/iconfont.css';
    .aside-wrapper{
        height: 100%;
        position: relative;
    }
    .el-submenu [class^=el-icon-]{
        margin-right: 2px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 219px;
        height: 100%;
        overflow: auto;
    }
    /deep/ .el-submenu__title{
        font-size: 12px;
        height: 36px;
        line-height: 36px;
        border-left: 3px solid #fff; // fix
    }
    .el-submenu.is-opened > .el-submenu__title, .el-submenu.is-opened > .el-submenu__title > i{
        color: #409EFF;
    }
    .el-submenu .el-menu-item{
        font-size: 12px;
        height: 30px;
        line-height: 30px;
    }
    /deep/ .el-menu--inline{
        padding: 10px 0;
    }
    .el-menu--inline{
        div{
            .el-menu-item{
                padding-left: 55px;
            }
        }
    }
    .aside-wrapper{
        box-shadow: 3px 0 5px #ccc;
    }
    .aside-wrapper .icon{
        vertical-align: middle;
        margin:0 5px;
    }
    .aside-wrapper .nav{
        margin-left: 5px;
        vertical-align: middle;
    }
    .el-menu-item a{
        display: block;
        width: 100%;
        height: 100%;
    }
    .el-menu-item.is-active{
        border-left: 3px solid #409EFF;
        background: #f4f5fa;
    }
    .shrink{
        position: absolute;
        right: -12px;
        top: 50%;
        height: 60px;
        line-height: 60px;
        width: 12px;
        z-index: 2;
        background: #409EFF;
        margin-top: -40px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }

</style>
