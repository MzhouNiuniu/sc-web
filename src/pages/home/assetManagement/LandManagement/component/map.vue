<template>
    <div class="mapShowBox">
        <div id="container">
        </div>
        <el-button type="primary" class="mapEditButton" @click="toSetMapPage"> 编辑</el-button>
    </div>
</template>
<script>
    export default {
        props: {
            coordinate: {
                type: Array,
                default: () => [],
            },
            polygonPath: {
                type: Array,
                default: () => []
            },
        },
        data () {
            this.map = null
            this.polygon = null
            return {}
        },
        mounted () {
            var map = this.map = new AMap.Map('container', {
                zoom: 13,//级别
                // viewMode: '3D'//使用3D视图
            })

            AMap.plugin([
                'AMap.ToolBar',
            ], function () {
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                map.addControl(new AMap.ToolBar({
                    // 简易缩放模式，默认为 false
                    liteStyle: true
                }))
            })

            this.$watch('polygonPath', path => {
                if (this.polygon) {
                    this.map.remove(this.polygon)
                    this.polygon = null
                }

                if (path.length === 0) {
                    return
                }

                path = JSON.parse(JSON.stringify(path))
                var polygon = new AMap.Polygon({
                    path: path,
                    strokeColor: '#FF33FF',
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    zIndex: 50,
                    draggable: false
                })

                this.polygon = polygon
                this.map.add(polygon)
                this.map.setFitView([polygon])
            }, { immediate: true })
        },
        watch: {
            coordinate: {
                immediate: true,
                handler (pos) {
                    this.setCenter(pos)
                }
            },
        },
        methods: {
            setCenter (pos) {
                if (!Array.isArray(pos) || pos.length !== 2) {
                    return
                }

                this.map.setZoomAndCenter(18, pos)
            },
            toSetMapPage () {
                this.$emit('OpenEditMap')
            },
        }
    }
</script>
<style lang="scss" scoped>
    #container {
        width: 930px;
        height: 700px;
        display: inline-block;

        /deep/ .amap-logo {
            line-height: initial;
        }

        /deep/ .amap-copyright {
            line-height: initial;
        }
    }

    .mapEditButton {
        display: none;
        vertical-align: top;
        position: relative;
        right: 90px;
        top: 10px;
    }

    .mapShowBox {
        width: 1010px;
        height: 700px;
    }

    .mapShowBox:hover {
        .mapEditButton {
            display: inline-block
        }
    }


</style>
<style>

</style>

