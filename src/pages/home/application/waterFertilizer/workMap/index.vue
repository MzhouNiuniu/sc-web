<template>
    <div>
        <div class="content-wrapper">
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="水肥作业列表展示" name="work">水肥作业列表展示</el-tab-pane>
                    <el-tab-pane label="水肥作业地图展示" name="workMap">水肥作业地图展示</el-tab-pane>
                </el-tabs>
            </div>
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="控制器名称/编码" v-model="keywords" class="input-with-select workMap_input">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-select v-model="params.stateKey" placeholder="请选择状态" @change="resetMap"
                               class="input-with-select">
                        <el-option
                            v-for="item in statusOpt"
                            :key="item.stateKey"
                            :label="item.stateName"
                            :value="item.stateKey">
                        </el-option>
                    </el-select>
                </div>
                <div class="option-button" v-allow="'sfWork-set-operation'">
                    <el-button type="primary" @click="preSetJudge()">
                        设置
                    </el-button>
                    <el-button type="primary" @click="stopControls()">
                        结束
                    </el-button>
                    <el-button type="primary" :disabled="selects.length > 1" @click="setArtControls()">
                        人工
                    </el-button>
                </div>

            </div>
            <div>
                <div id="workMap">

                </div>
            </div>
        </div>
        <!-- 这里的title需要根据不同的场景替换 -->
        <el-dialog title="水肥作业结束提示" :visible.sync="isShowWorkEnd" width="50%"
                   @closed="isShowWorkEnd = false;isHaveEnd = false;" :close-on-click-modal="false">
            <work-end v-if="isShowWorkEnd" :isHaveEnd="isHaveEnd" :data="endData"
                      @closeDialog="isShowWorkEnd = false;isHaveEnd = false;" @reloadTable="OpenWorkSet"></work-end>
        </el-dialog>

        <el-dialog title="水肥作业设定" :visible.sync="isShowWorkSet" width="50%" v-if="isShowWorkSet"
                   :close-on-click-modal="false">
            <work-set :data="setData" @closeDialog="isShowWorkSet = false" @reloadTable="resetMap"></work-set>
        </el-dialog>

        <el-dialog title="水肥作业人工设定" :visible.sync="isShowArt" width="40%" v-if="isShowArt"
                   :close-on-click-modal="false">
            <artificial :data="artData" @closeDialog="isShowArt = false" @reloadTable="resetMap"></artificial>
        </el-dialog>
    </div>
</template>
<script>
    import workEnd from '../components/workEnd'
    import workSet from '../components/workSet'
    import artificial from '../components/artificial'
    import { debounce } from '@/utils'

    export default {
        components: {
            workEnd, workSet, artificial
        },
        data () {
            this.markersArray = [] // 渲染出来的marker
            return {
                activeName: 'workMap',
                statusOpt: [],
                keywords: null,
                params: {
                    stateKey: null,
                    keywords: null,
                },
                tableData: [],
                map: null,
                isShowWorkEnd: false,
                isShowWorkSet: false,
                isShowArt: false,
                endData: [], // 需要传到end组件的一个对象
                setData: [], // 传到set组件的一个对象
                artData: [],
                selects: [],
                markerIcon: null, // 图标颜色的定义 使用map结构
                defautIcon: require('@/assets/img/map/locat02.png'),
                PolygonArray: [],
                isHaveEnd: false
            }
        },
        created () {
            this.getStatusOpt()
        },
        mounted () {
            this.initMasterIcon()
            this.initMap()
        },
        methods: {
            handleClick (tab, event) {
                if (tab.name === 'work') {
                    this.$router.push('/home/waterFertilizer/work')
                } else if (tab.name === 'workMap') {
                    this.$router.push('/home/waterFertilizer/workMap')
                }
            },// 获取状态下拉
            async getStatusOpt () {
                const data = await this.getDropDownList({
                    type: 'controller'
                })
                if (data) {
                    this.statusOpt = data.stateList
                    this.statusOpt.unshift({
                        stateKey: null,
                        stateName: '请选择状态'
                    })
                }
                return true
            },
            async getDropDownList (params) {
                const res = await this.http.get(this.api.controller.getDropDownList, params)
                if (res && res.code === 200) {
                    return res
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                    return null
                }
            },
            // 清理地图上旧的图形和点
            clearMap () {
                this.markersArray.forEach(ele => {
                    this.map.remove(ele)
                })
                this.PolygonArray.forEach(ele => {
                    this.map.remove(ele)
                })
                this.markersArray = []
                this.PolygonArray = []
            },
            async searchKey () {
                this.params.keywords = this.keywords
                this.resetMap()
            },
            async getCoordinateMap (params) {
                const res = await this.http.get(this.api.GroupControler.getCoordinateMap, params)
                if (res && res.code === 200) {
                    this.initArtTimeOut(res.data.obj && res.data.obj.controllers)
                    return res.data.obj
                }
            },
            async initMap () {
                const map = this.map = new AMap.Map('workMap', {
                    zoom: 13,//级别
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

                this.resetMap()
            },
            async resetMap () {
                this.selects = []
                const { electronics, controllers } = await this.getCoordinateMap(this.params)
                this.clearMap()
                this.DrawLands(electronics)
                this.drawMulMarker(controllers)

                let mapCenter = ''
                if (Array.isArray(controllers) && controllers.length) {
                    mapCenter = controllers[0].baseCoordinate
                } else {
                    /* 没有可用控制器时：
                    * PC和APP水肥作业地图模式，如果企业下存在绑定了MAC地址的控制器，则地图中心点为随机一个绑定了MAC地址控制器的所属基地，
                    * 如果企业下不存在绑定了MAC地址的控制器，则地图中心点优先公司坐标，其次是橙红坐标
                    * */

                    // 获取公司坐标（随便找了个接口）
                    const res = await this.http.get(this.api.Massif.jumpAddMassif, {}, true)
                    if (res.data && res.data.obj) {
                        mapCenter = res.data.obj.defaultCoordinate
                    }

                    mapCenter = mapCenter || this.$G_ORARO_COORDINATE
                }

                this.map.setZoomAndCenter(18, mapCenter.split(','))

            },
            // 画单个多边形
            drawPolygon (path, data) {
                var polygon = new AMap.Polygon({
                    path: path,
                    strokeColor: '#FAC137',
                    strokeWeight: 6,
                    strokeOpacity: 0.5,
                    fillOpacity: 0.3,
                    fillColor: '#13BA78',
                    zIndex: 50,
                    draggable: false
                })
                this.map.add(polygon)
                this.PolygonArray.push(polygon)
                const mask = path[0]
                var marker = new AMap.Marker({
                    position: mask,
                    offset: new AMap.Pixel(-13, -30)
                })
                marker.setMap(this.map)
                marker.setLabel({
                    offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
                    content: `<div class='info'> 地块名：${data.massifName}</div>`, //设置文本标注内容
                    direction: 'right' //设置文本标注方位
                })

            },
            // 画多个多边形。
            DrawLands (electronics) {
                if (Array.isArray(electronics)) {
                    electronics.forEach(ele => {
                        if (typeof ele.coordinate === 'string') {
                            ele.coordinate = JSON.parse(ele.coordinate)
                        }
                        if (Array.isArray(ele.coordinate)) {
                            this.drawPolygon(ele.coordinate, ele)
                        } else {
                            console.log('path-类型不符合')
                        }
                    })
                }
            },
            // 画单个标点
            drawMarker (path, data) {
                data.isFoused = false
                // 控制器名称、滴头数、灌溉量（如果有）、工作时长（如果有）
                const detail = `${data.name}、${data.waterNum}、${data.irrigationNum}、${data.workHours}`
                var marker = new AMap.Marker({
                    position: path,
                    icon: this.markerIcon.get(data.stateKey),
                    offset: new AMap.Pixel(-13, -30),
                    // 设置是否可以拖拽
                    draggable: false,
                    cursor: '',
                    // 设置拖拽效果
                    raiseOnDrag: false,
                    title: detail,
                    extData: data
                })

                const _this = this
                this.markersArray.push(marker)
                marker.on('click', () => {
                    const data = marker.getExtData()
                    if (data.isFoused) {
                        data.isFoused = false
                        marker.setIcon(_this.markerIcon.get(data.stateKey))
                        _this.selects.splice(_this.selects.indexOf(data), 1)
                    } else {
                        data.isFoused = true
                        _this.selects.push(data)
                        marker.setIcon(_this.defautIcon)
                    }
                    console.log(_this.selects)

                })
                marker.on('dblclick', () => {
                    const data = marker.getExtData()
                    _this.$router.push({
                        path: '/home/waterFertilizer/workDetail',
                        query: {
                            id: data.id
                        }
                    })
                })
                marker.setMap(this.map)
            },
            // 画多个点
            drawMulMarker (controllers) {
                if (Array.isArray(controllers)) {
                    controllers.forEach(ele => {
                        if (ele.coordinate && typeof ele.coordinate === 'string') {
                            ele.coordinate = ele.coordinate.split(',')
                            if (ele.coordinate && Array.isArray(ele.coordinate)) {
                                this.drawMarker(ele.coordinate, ele)
                            }
                        }
                    })
                }
            },
            // 结束设定成功函数
            concelSucc () {
                this.isShowWorkEnd = false
                this.getCoordinateMap(this.params)
                // this.endData = []
            },
            // 批量/ 单个 设定
            setControls (val) {
                if (val) {
                    this.setData = [val]
                    this.isShowWorkSet = true
                    return
                }
                if (this.selects.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                const flag = this.isHavaArtControl(this.selects)
                if (flag) {
                    this.$message({
                        type: 'warning',
                        message: '不能选择人工设定状态的！'
                    })
                    return
                }
                this.setData = JSON.parse(JSON.stringify(this.selects))
                this.isShowWorkSet = true
            },
            // 设置人工设定
            setArtControls: debounce(function (val) {
                if (val) {
                    this.artData = [val]
                    this.isShowArt = true
                    return
                }
                if (this.selects.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                if (this.selects && this.selects.length > 1) {
                    this.$message({
                        type: 'warning',
                        message: '人工设定的不能超过一个'
                    })
                    return
                }
                if (this.selects && this.selects[0].stateKey === 2) {
                    this.$message({
                        type: 'warning',
                        message: '不能人工设定运行中的控制器'
                    })
                    return
                }
                this.artData = JSON.parse(JSON.stringify(this.selects))
                this.isShowArt = true
            }),
            // 批量/单个停止
            stopControls: debounce(function (val) {
                if (val) {
                    if (val.stateKey === 0) {
                        const controllerIds = val.id
                        this.endGroupController({ controllerIds })
                        return
                    }
                    this.endData = [val]
                    this.isShowWorkEnd = true
                    return
                }
                if (this.selects.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                const flag = this.isHavaArtControl(this.selects)
                if (flag) {
                    this.$message({
                        type: 'warning',
                        message: '不能选择人工设定状态的！'
                    })
                    return true
                }
                const isAllNoSet = this.selects.every(item => {
                    return item.stateKey === 0
                })

                if (isAllNoSet) {
                    this.$confirm(`确定结束吗？`).then(() => {
                        const controllerIds = this.selects.map(item => item.id).toString()
                        this.endGroupController({ controllerIds })
                    })
                    return
                }

                this.endData = JSON.parse(JSON.stringify(this.selects))
                this.isShowWorkEnd = true
            }),
            isHavaArtControl (controllers) {
                if (Array.isArray(controllers)) {
                    return controllers.some(ele => {
                        return ele.stateKey === 3
                    })
                } else if (typeof controllers === 'object') {
                    return controllers.stateKey === 3
                }

            },
            initMasterIcon () {
                this.markerIcon = new Map()
                this.markerIcon.set(3, require('@/assets/img/workMap/artSet.png'))
                this.markerIcon.set(1, require('@/assets/img/workMap/free.png'))
                this.markerIcon.set(0, require('@/assets/img/workMap/noSet.png'))
                this.markerIcon.set(2, require('@/assets/img/workMap/run.png'))
                this.markerIcon.set('已选中', require('@/assets/img/map/locat02.png'))
            },
            preSetJudge: debounce(function (val) {
                if (val) {
                    if ((val.stateKey === 2 || val.stateKey === 1)) {
                        this.isHaveEnd = true
                        this.setControls(val)
                        return
                    } else {
                        this.setControls(val)
                        return
                    }

                }
                const flag = this.selects.some(ele => {
                    return ele.stateKey === 2 || ele.stateKey === 1
                })
                if (flag) {
                    this.isHaveEnd = true
                    this.stopControls()
                } else {
                    this.setControls()
                }
            }),
            OpenWorkSet () {
                if (this.isHaveEnd) {
                    if (this.endData && this.endData.length === 1) {
                        // 数组表示单点出来操作的或勾选一个操作的，
                        this.setControls(this.endData[0])
                    } else {
                        this.setControls()
                    }
                } else {
                    this.resetMap()
                }
                this.isHaveEnd = false
            },
            // 初始化人工操作的定时器的时间
            initArtTimeOut (tableData) {
                // 定义 artTime 为缓存的key, 里面存储的每一次设置的新的点击时间点 是一个id 与 人工设定状态切换时间点， 和灌溉状态切换时间点的 键值对。
                // 定义 artStatusTi 为 人工状态切换时间， 时间都是毫秒级，进行运算
                // 定义 artIrriTi 为灌溉切换时间
                let artTime = localStorage.getItem('artTime') || '{}'
                artTime = JSON.parse(artTime)
                tableData.forEach(ele => {
                    if (artTime[ele.id]) {
                        const timeOb = artTime[ele.id]
                        ele.artStatusTi = timeOb.artStatusTi || 0
                        ele.artIrriTi = timeOb.artIrriTi || 0
                    } else {
                        // id 对应的值没有说明，还没有操作过这个人工按钮
                        ele.artStatusTi = 0
                        ele.artIrriTi = 0
                    }
                    ele.statusTime = ele.artStatusTi === 0 ? 0 : (new Date().getTime() - ele.artStatusTi >= 60000 ? 0 : 60000 - (new Date().getTime() - ele.artStatusTi))
                    ele.irriTime = ele.artIrriTi === 0 ? 0 : (new Date().getTime() - ele.artIrriTi >= 60000 ? 0 : 60000 - (new Date().getTime() - ele.artIrriTi))

                    ele.statusTime = Math.floor(ele.statusTime / 1000)
                    ele.irriTime = Math.floor(ele.irriTime / 1000)
                })
            },
            async endGroupController ({ controllerIds }) {
                const res = await this.http.get(this.api.GroupControler.endGroupController, {
                    controllerIds
                })
                if (res && res.code === 200) {

                    if (res.bizCode && res.bizCode === 401) {
                        this.$message({
                            type: 'error',
                            message: res.bizMsg
                        })
                        return
                    }

                    this.$message({
                        type: 'success',
                        message: '结束设定成功！'
                    })
                    return {
                        code: 200
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .el-tabs {
        .el-tabs__content {
            display: none;
        }
    }

    .searchAndButtonBox {
        display: flex;
        justify-content: space-between;

        > div {
            display: flex;
            justify-content: space-between;
        }
    }

    .input-with-select {
        margin-right: 1rem;
        width: 17rem;
    }

    #workMap {
        margin-top: 1rem;
        width: 100%;
        height: 550px;
    }

    .option-button {
        display: block !important;
    }
</style>
<style>
    .info {
        position: relative;
        top: 0;
        right: 0;
        min-width: 0;
    }

    .amap-marker-label {
        border: 0;
        box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    }

</style>

