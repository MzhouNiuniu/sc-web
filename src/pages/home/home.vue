<template>
    <div class="home-wrapper">
        <el-container>
            <el-header height="70px">
                <subHeader></subHeader>
            </el-header>
            <el-container class="container">
                <subAside></subAside>
                <el-main>
                    <router-view></router-view>
                    <!--
                        移除keep-alive
                        保留之前处理缓存的相关代码，例如watch路由、activated()
                        watch路由、activated()选一个就行了
                    -->
                    <!--                     <tag></tag> -->
                    <!--                    <keep-alive :include="tagsList">-->
                    <!--                        <router-view></router-view>-->
                    <!--                    </keep-alive>-->
                </el-main>
            </el-container>
            <el-footer height="40px">
                <subFooter></subFooter>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import subHeader from 'components/header/sub-header.vue'
    import subFooter from 'components/footer/sub-footer.vue'
    import subAside from 'components/aside/aside'
    import tag from 'components/tag/tag'
    import bus from 'components/tag/bus'

    export default {
        data () {
            return {
                tagsList: [],
                path: [],
                collapse: false
            }
        },
        components: {
            subHeader,
            subFooter,
            subAside,
            tag,
        },
        watch: {
            $route (val, oldVal) {
                if (val.path != oldVal.path) {
                    $('.el-main').scrollTop(0)
                }
            }
        },
        mounted () {
            // this.getLoginUser()
        },
        created () {
            bus.$on('collapse', msg => {
                this.collapse = msg
            })
            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = []
                let path = []
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name)
                    msg[i].path && path.push(msg[i].path)
                }
                this.tagsList = arr
                this.path = path
            })

            bus.$on('closeTab', url => {
                var index = this.path.indexOf(url)
                bus.$emit('closeTags', index)
            })
            bus.$on('closeKeep', index => {
                this.tagsList.splice(index, 1)
                this.path.splice(index, 1)
            })
            bus.$on('replaceKeepList', value => {
                this.tagsList = value
                this.path = value
            })
        },
        methods: {
            getLoginUser: async function () {
                const res = await this.http.get(this.api.getLoginUser)
                localStorage.setItem('userInfo', JSON.stringify(res.data.user))
            },
        }
    }
</script>

<style scoped>
    .home-wrapper {
        height: 100%;
    }

    .el-footer {
        box-sizing: content-box;
        padding: 0;
        background: #fff;
        line-height: 40px;
        text-align: center;
        color: #383838;
        font-size: 12px;
        border-top: 1px solid #ccc;
    }

    .container {
        height: calc(100% - 110px) !important;
    }
</style>
