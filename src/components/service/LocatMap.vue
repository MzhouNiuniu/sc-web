<template>
    <div class="mapShowBox">
        <div id="localMap"></div>
        <div class="tool-box">
            <div id="tip">
                <input
                    type="text"
                    id="keyword"
                    name="keyword"
                    placeholder="请输入关键字：(选定后搜索)"
                    value
                    onfocus="this.value=''"
                />
            </div>
            <div class="lnglat">
                <span>坐标：{{lnglat.toString()}}</span>
            </div>
            <el-button size="mini" type="primary" class="lnglatConfirm" @click="updateModel">保存</el-button>
        </div>

        <div>当前地址： {{address}}</div>
    </div>
</template>
<script>
    export default {
        props: {
            coordinate: {
                type: String,
                default: ''
            },
            defaultAddress: {
                type: String,
                default: ''
            },
            areaFlag: {
                type: Boolean,
                default: false
            },
            /*
                     * @Author: zhanglongfeng

                     * @Date: 2019-07-16 16:23:56
                 * @Last Modified by: zhanglongfeng
                 * @Last Modified time: 2019-08-05 17:24:14
                     */
            /*
                     * {
                         controller: boolean,
                         massif: boolean,
                         nursery: boolean,
                        }
                        例子：
                        {
                         controller: false,
                         massif: true,
                         nursery: false,
                        }
                     */

            CoordinateType: {
                type: Object,
                default: () => {
                }
            }
        },
        data () {
            this.map = null
            this.marker = null
            this.geocoder = null
            this.defautIcon = require('@/assets/img/map/locat02.png')
            this.otherICon = require('@/assets/img/map/locat01.png')
            return {
                lnglat: [],
                address: '',
                province: '',
                city: '',
                counties: '',
                controllerNameCoordinate: [], // 控制器所有坐标
                massifNameCoordinate: [], // 地块所有坐标
                nurseryNameCoordinate: [] // 苗木所有坐标
            }
        },
        methods: {
            updateAddress () {
                this.geocoder.getAddress(this.lnglat, (status, result) => {
                    if (status === 'complete' && result.regeocode) {
                        this.address = result.regeocode.formattedAddress
                    } else {
                        this.address = '暂无地址'
                    }
                    let areaAddress = result.regeocode.addressComponent
                    let realCity = areaAddress.city
                    let str = ['北京市', '上海市', '重庆市', '天津市']
                    if (
                        str.includes(areaAddress.province)
                    ) {
                        realCity = areaAddress.province
                    }
                    if (this.areaFlag) {
                        this.province = areaAddress.province
                        this.city = realCity
                        this.counties = areaAddress.district
                    }
                })
            },
            updateModel () {
                this.$emit('closeAndSave', {
                    address: this.address,
                    coordinate: this.lnglat,
                    province: this.province,
                    city: this.city,
                    counties: this.counties
                })
            },
            checkLnglat (coordinate) {
                if (coordinate) {
                    const lng = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
                    const lat = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
                    return lng.test(coordinate[0]) && lat.test(coordinate[1])
                } else {
                    return false
                }
            },
            // 往地图上打当前位置点
            setMasterMarker () {
                var marker = new AMap.Marker({
                    position: this.lnglat,
                    icon: this.defautIcon,
                    offset: new AMap.Pixel(0, 0),
                    // 设置是否可以拖拽
                    draggable: true,
                    cursor: 'move',
                    zIndex: 200,
                    anchor: 'center'
                })
                if (this.marker) {
                    this.map.remove(this.marker)
                }
                marker.on('dragging', e => {
                    this.setLngLat([e.lnglat.lng, e.lnglat.lat])
                })
                marker.setMap(this.map)
                this.marker = marker
                this.map.setFitView([marker])
            },
            // 往地图上打其他点
            setOtherMaster (location, name) {
                var marker = new AMap.Marker({
                    position: location,
                    icon: this.otherICon,
                    offset: new AMap.Pixel(0, 0),
                    // 设置是否可以拖拽
                    draggable: false,
                    cursor: '',
                    // 设置拖拽效果
                    anchor: 'center',
                    raiseOnDrag: false,
                    title: name
                })
                marker.setMap(this.map)
            },
            setLngLat (lngLat) {
                this.lnglat = lngLat
                // handle lnglat change
                this.updateAddress()
            },

            // 这里后台将所有点的坐标都给我了，查了三个表，后期如果打的点多了，可能需要优化
            getCoordinate (params) {
                return this.http.get(this.api.Massif.getCoordinate, params).then(res => {
                    if (res && res.code === 200) {
                        delete res.code
                        delete res.message
                        return res
                    }
                })
            },
            async initOtherMaster () {
                const coordinates = await this.getCoordinate(this.CoordinateType)
                if (!coordinates) {
                    return
                }

                for (const key in coordinates) {
                    if (
                        coordinates.hasOwnProperty(key) &&
                        Array.isArray(coordinates[key])
                    ) {
                        const element = coordinates[key]
                        element.forEach(item => {
                            if (item.coordinate && item.coordinate !== this.coordinate) {
                                this.setOtherMaster(item.coordinate.split(','), item.name)
                            }
                        })
                    }
                }
            }
        },
        async mounted () {
            /* 初始化地图 + 基础插件 */
            const map = (this.map = new AMap.Map('localMap', {
                resizeEnable: true,
                zoom: 13, //地图显示的缩放级别
                keyboardEnable: false
            }))
            // 设置编码器（根据坐标，获取位置）
            AMap.plugin(['AMap.Geocoder'], () => {
                this.geocoder = new AMap.Geocoder({
                    // city: "010", //城市设为北京，默认：“全国”
                    radius: 1000 //范围，默认：500
                })
            })

            /* 加载基础地图之后，开启异步任务，初始化其他点 */
            this.initOtherMaster()

            /* 继续初始化 */
            // 添加【定位到当前位置】按钮
            map.plugin('AMap.Geolocation', () => {
                const geolocation = new AMap.Geolocation({
                    showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false

                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: 'LB' //定位按钮停靠位置，默认：'LB'，左下角
                })
                map.addControl(geolocation)

                // 注册监听事件
                AMap.event.addListener(geolocation, 'complete', result => {
                    this.setLngLat([result.position.lng, result.position.lat])
                    this.setMasterMarker()
                })

                // 业务逻辑
                const coordinate = this.coordinate && this.coordinate.split(',')
                if (this.checkLnglat(coordinate)) {
                    this.setLngLat(coordinate)
                    this.setMasterMarker()
                } else {
                    geolocation.getCurrentPosition()
                }
            })

            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            AMap.plugin('AMap.ToolBar', () => {
                map.addControl(
                    new AMap.ToolBar({
                        liteStyle: true // 这里使用了简易模式，所以需要手动添加一个定位按钮
                        // autoPosition:true, // 这个自动定位不能隐藏默认的marker
                    })
                )
            })
            // 搜索功能
            AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
                var autoOptions = {
                    // city: "北京", //城市，默认全国
                    input: 'keyword' //使用联想输入的input的id
                }
                const autocomplete = new AMap.Autocomplete(autoOptions)
                var placeSearch = new AMap.PlaceSearch({
                    city: '北京',
                    map: map
                })

                AMap.event.addListener(autocomplete, 'select', e => {
                    placeSearch.setCity(e.poi.adcode)
                    placeSearch.search(e.poi.name, (status, result) => {
                        if (status === 'complete') {
                            const pois = result.poiList.pois[0]
                            this.setLngLat([pois.location.lng, pois.location.lat])
                            this.setMasterMarker()
                        }
                    })
                })
            })
        }
    }
</script>
<style lang="scss" scoped>
    #localMap {
        width: 100%;
        height: 550px;
        display: inline-block;
    }

    .mapShowBox {
        position: relative;
    }

    #tip {
        // background-color: #ddf;
        color: #333;
        // border: 1px solid silver;
        box-shadow: 3px 4px 3px 0px silver;
        border-radius: 5px;
        overflow: hidden;
        line-height: 30px;
        height: 30px;
    }

    #tip input[type="text"] {
        // border: 1px solid silver;
        box-shadow: 3px 4px 3px 0px silver;
        height: 30px;
        border: 0;
        padding-left: 5px;
        width: 280px;
        border-radius: 3px;
        outline: none;
    }

    .lnglat {
        width: 200px;
        background: #fff;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 5px;
        box-shadow: 3px 4px 3px 0px silver;
    }

    .lnglatConfirm {
        // position: absolute;
        top: 110px;
        right: 35px;
    }

    .tool-box {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        align-items: center;
        top: 30px;
        right: 20px;
        width: 600px;

        div {
            margin: auto;
        }

        button {
            margin: auto;
        }
    }
</style>
