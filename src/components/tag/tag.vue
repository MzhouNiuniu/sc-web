<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index" :style="{width: tagsWidth}">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.title}}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <i class="el-icon-arrow-down"></i>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import bus from './bus';
    export default {
        data() {
            return {
                tagsList: [],
            }
        },
        methods: {
            isActive(path) {
                return path === this.$route.path;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                bus.$emit('closeKeep',index)
                if (item) {
                    delItem.path === this.$route.path && this.$router.push(item.path);
                }else{
                    this.$router.push('/');
                }
            },

            // 关闭全部标签
            closeAll(){
                this.tagsList = [];
                bus.$emit('replaceKeepList',[])
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOther(){
                const curItem = this.tagsList.filter(item => {
                    bus.$emit('replaceKeepList',[this.$route.path])
                    return item.path === this.$route.path;
                })

                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route){
                const isExist = this.tagsList.some(item => {
                    return item.path === route.path;
                })
                !isExist && this.tagsList.push({
                    title: route.meta.title,
                    path: route.path,
                    name: route.matched[1].components.default.name
                })
                bus.$emit('tags', this.tagsList);
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            },
            tagsNum(){
                return this.tagsList.length
            },
            tagsWidth(){
                return 100/this.tagsNum + '%'
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            }
        },
        created(){
            //刷新处理
            bus.$on('closeTags',index=>{
                this.closeTags(index)
            })
            this.setTags(this.$route);
        }
    }

</script>


<style lang="scss" scoped>
    .tags {
        position: relative;
        top: -20px;
        left: -20px;
        width: calc(100% + 40px);
        // min-width: 1015px !important;
        height: 30px;
        overflow: hidden;
        background: #f1f1f1;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-bottom: 1px solid #d8d8d8;
    }

    .tags ul {
        box-sizing: border-box;
        padding-right: 30px;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        position:relative;
        font-size: 13px;
        overflow: hidden;
        cursor: pointer;
        max-width: 130px;
        height: 30px;
        line-height: 30px;
        background: #f1f1f1;
        border: 1px solid #d8d8d8;
        padding: 0 5px;
        vertical-align: middle;
        color: #666666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
        text-align: center;
        box-sizing: border-box;
    }
    .tags-li-icon{
        position: absolute;
        right: 5px;
    }

    .tags-li:not(.active):hover .tags-li-title{
        color: #000;
    }

    .tags-li.active {
        background: #ffffff;
    }
    .tags-li.active .tags-li-title {
        color: #409eff;
    }

    .tags-li-title {
        display: inline-block;
        width: 75%;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 5px;
        color: #666;
    }



    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 30px;
        height: 40px;
        border-left: 1px solid #d8d8d8;
        z-index: 10;
    }

    .el-dropdown{
        width: 100%;
        height: 40px;

    }
    .el-icon-arrow-down{
        width: 100%;
        height: 30px;
        line-height: 30px;
    }
</style>
