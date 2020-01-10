<template>
    <div>

        <p class="wrapper-title"><span>设置电子围栏</span></p>
        <div class="content-wrapper">
            <div id="landMap-container">
            </div>
            <div id="tip">
                <el-button size="mini" type="primary" @click="savePolygon" v-if="isShowEditButton">保存</el-button>
                <template v-if="!isHavePolygonPath">
                    <el-button size="mini" type="primary" @click="handleCreateFence">
                        新建电子围栏
                    </el-button>
                </template>
                <template v-else>
                    <el-button size="mini" type="primary" @click="handleLookFence">查看</el-button>
                    <el-button size="mini" type="primary" @click="fencingDialog = true" v-if="!isShowEditButton">
                        编辑
                    </el-button>
                    <el-button size="mini" type="primary" @click="deletePolygon">删除</el-button>
                </template>

                <el-button size="mini" type="primary" @click="back">返回</el-button>
                <!-- <input type="text" id="keyword" name="keyword" value="请输入关键字：(选定后搜索)" onfocus='this.value=""'/> -->
            </div>

            <el-dialog :title="fenceDialogTitle" :visible.sync="fencingDialog" width="30%" @close="isSeeDetail = false "
                       append-to-body :close-on-click-modal="false">
                <el-row>
                    <el-col :span="22">
                        <el-form
                            ref="landFencing"
                            label-width="100px"
                            :rules="rules"
                            :model="landFencing"
                            :disabled="isSeeDetail"
                        >
                            <el-form-item label="围栏名称：" prop="name">
                                <el-input
                                    v-model="landFencing.name"
                                    placeholder="请输入内容"
                                />
                            </el-form-item>
                            <el-form-item label="类型：">
                                <!-- <span>{{landFencing.type}}</span> -->
                                <span>地块围栏</span>
                                <!-- 这里默认写死，一期不做其他类型 -->
                            </el-form-item>
                            <el-form-item label="基地名称：">
                                <template v-if="baseName">
                                    {{baseName}}
                                </template>
                                <span v-else style="color: red;">
                                        请先选择基地
                                    </span>
                            </el-form-item>
                            <el-form-item label="描述：" prop="description">
                                <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入内容"
                                    v-model="landFencing.description"
                                />
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="fencingDialog = false">取 消</el-button>
                    <el-button type="primary" v-if="!isSeeDetail" @click="handleSaveFence('landFencing')">确 定
                    </el-button>
                </div>
            </el-dialog>

            <!-- <div class="editMapButtons" v-if="isShowEditButton">
                <el-button size="mini" plain @click="changeEditStatus">{{isEdit?'关闭编辑': '开启编辑'}}</el-button>
                <el-button size="mini" plain @click="changeDraggerStatus">{{isDraggable?'关闭拖动': '开启拖动'}}</el-button>
            </div> -->
        </div>

    </div>

</template>
<script>
    // 全局的函数
    function getPathOption (pathArray) {
        return pathArray.map(element => {
            return [element.lng, element.lat]
        })
    }

    export default {
        props: {
            baseName: String,
            // 基地坐标，如果没选择的时候，展示公司坐标
            baseCoordinate: {
                type: Array,
                default: () => [],
            },

            outPolygon: {
                type: Array,
                default: () => {
                }
            },
            outLandFencing: {
                type: Object,
                default: () => null
            },
            allPolygon: {
                type: Array,
                default: () => {
                }
            }
        },
        data () {
            this.map = null // 地图对象
            this.polygon = null // 多边形的实体对象
            this.polyEditor = null // 多边形编辑器对象

            return {
                isEdit: true, // 定义为当前这边多边形是否处于编辑状态
                isDraggable: true, // 默认可以拖动
                isShowEditButton: false,
                fencingDialog: false,
                isSeeDetail: false, // 是否为查看弹窗信息

                polygonPath: [],// 修改的polygon 数组坐标值
                landFencing: {
                    description: '',
                    // baseName: '兰溪基地',
                    name: '',
                    type: '地块围栏'
                },

                rules: {
                    name: [{ required: true, message: '请输入围栏名称', trigger: 'change' },
                        {
                            validator: (rules, value, callback) => {
                                if (value.length > 10) {
                                    callback(new Error('最长10个字符'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }],
                    description: [{
                        validator: (rules, value, callback) => {
                            if (value.length > 300) {
                                callback(new Error('最长300个字符'))
                            } else {
                                callback()
                            }
                        }, trigger: 'change'
                    }]
                },
            }
        },
        computed: {
            fenceDialogTitle () {
                return this.isSeeDetail ? '查看地块围栏' : '地块围栏添加/修改'
            },
            isHavePolygonPath () {
                return this.polygonPath.length > 0
            },
        },
        mounted () {
            const map = this.map = new AMap.Map('landMap-container', {
                zoom: 15,//级别
                center: this.baseCoordinate.length === 2 ? this.baseCoordinate : undefined, // 中心点坐标
                // layers: [new AMap.TileLayer.Satellite()],
                // viewMode:'3D'//使用3D视图
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

            AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
                var autoOptions = {
                    city: '北京', //城市，默认全国
                    input: 'keyword'//使用联想输入的input的id
                }
                let autocomplete = new AMap.Autocomplete(autoOptions)
                var placeSearch = new AMap.PlaceSearch({
                    city: '北京',
                    map: map
                })
                AMap.event.addListener(autocomplete, 'select', function (e) {
                    //TODO 针对选中的poi实现自己的功能
                    placeSearch.setCity(e.poi.adcode)
                    placeSearch.search(e.poi.name)
                })
            })

            this.landFencing = JSON.parse(JSON.stringify(this.outLandFencing))
            if (this.outPolygon.length > 0) {
                this.polygonPath = JSON.parse(JSON.stringify(this.outPolygon))
                this.addPolygon(this.polygonPath)

                // 将新增的状态改为，待编辑状态
                this.isShowEditButton = false
                this.polyEditor.close()
                this.polygon.setOptions({
                    draggable: false,
                    cursor: 'hand'
                })
            }

            if (this.allPolygon) {
                this.DrawLands(this.allPolygon.map(ele => ele.coordinate))
            }
        },
        methods: {
            /* 添加围栏模态框 */
            handleCreateFence () {
                if (!this.baseName) {
                    this.$message.warning('请先选择基地')
                    return
                }
                this.fencingDialog = true
            },
            handleLookFence () {
                this.isSeeDetail = true
                this.fencingDialog = true
            },
            handleSaveFence (formName) {
                // 调用接口
                this.$refs[formName].validate(valid => {
                    // 通过了那就可以新建一个地块个给他进行编辑
                    // 这里就应该弹出相应的弹窗
                    if (valid) {
                        this.fencingDialog = false
                        if (this.polygonPath.length === 0) {
                            this.addPolygon()
                        } else {
                            this.$confirm('是否去编辑围栏的具体形状和位置？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.openEdit()
                            }).catch(() => {
                                this.saveLandDetail()
                            })
                        }
                    }
                })
            },

            /* 地图的方法 */
            // 添加围栏方法
            addPolygon (polygonPath) {
                this.isShowEditButton = true

                // 默认生成四个点的形状
                if (!polygonPath) {
                    const center = this.map.getCenter()
                    let path = [
                        [center.lng, center.lat],
                        [center.lng + 0.023, center.lat],
                        [center.lng + 0.023, center.lat + 0.023],
                        [center.lng, center.lat + 0.023],
                    ]
                    polygonPath = path
                }
                this.polygonPath = polygonPath

                const map = this.map
                const polygon = this.polygon = new AMap.Polygon({
                    path: polygonPath,
                    strokeColor: '#FF33FF',
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    zIndex: 60,
                    draggable: true,
                    cursor: 'Move'
                })
                map.add(polygon)
                // 缩放地图到合适的视野级别
                map.setFitView([polygon])

                map.plugin(['AMap.PolyEditor'], () => {
                    const polyEditor = this.polyEditor = new AMap.PolyEditor(map, polygon)
                    polyEditor.open()
                    polygon.on('dragging', event => {
                        //    _this.polygonPath = getPathOption(event.target.getPath());
                    })
                    polyEditor.on('addnode', event => {
                        console.log('触发事件：addnode')
                    })

                    polyEditor.on('adjust', event => {
                        console.log('触发事件：adjust')
                    })

                    polyEditor.on('removenode', event => {
                        console.log('触发事件：removenode')
                    })

                    polyEditor.on('end', value => {
                        console.log('触发事件： end')
                        this.polygonPath = getPathOption(value.target.getPath())
                        // event.target 即为编辑后的多边形对象
                    })
                })
            },

            // 编辑围栏
            openEdit () {
                this.isShowEditButton = true
                this.polyEditor.open()
                this.polygon.setOptions({
                    draggable: true,
                    cursor: 'Move'
                })
                this.map.setFitView([this.polygon])
            },

            // 保存围栏
            savePolygon () {
                this.isShowEditButton = false
                this.polyEditor.close()
                this.polygon.setOptions({
                    draggable: false,
                    cursor: 'hand'
                })
                this.saveLandDetail()
            },

            // 删除围栏
            deletePolygon () {
                this.$confirm('是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.map.remove(this.polygon)
                    this.map.setZoomAndCenter(18, this.baseCoordinate)

                    this.polyEditor.close()
                    this.polygonPath = []
                    this.isShowEditButton = false
                    this.landFencing.name = ''
                    this.landFencing.description = ''
                    // this.$refs['landFencing'].resetFields();
                    // this.landFencing = {};
                    this.saveLandDetail()
                })
            },

            // 画多余的多边形（用来画出所有的电子围栏）
            drawPolygon (path) {
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
            },
            DrawLands (Polygons) {
                if (Array.isArray(Polygons)) {
                    Polygons.forEach(ele => {
                        if (typeof ele === 'string') {
                            ele = JSON.parse(ele)
                        }
                        if (Array.isArray(ele)) {
                            this.drawPolygon(ele)
                        } else {
                            console.log('path-类型不符合')
                        }
                    })
                }
            },

            // 更新外部数据
            saveLandDetail () {
                const landFencing = this.landFencing
                landFencing.coordinate = this.polygonPath
                this.$emit('closeAndSave', landFencing)
            },

            back () {
                // this.$emit('closeAndSave',{});
                // showlandSetDialog
                this.$parent.$parent.showlandSetDialog = false
            }
        },
    }
</script>
<style lang="scss" scoped>
    #landMap-container {
        width: 100%;
        height: 600px;
    }

    .content-wrapper {
        position: relative;
    }

    #tip {
        // background-color: #ddf;
        color: #333;
        // border: 1px solid silver;
        // box-shadow: 3px 4px 3px 0px silver;
        position: absolute;
        top: 30px;
        right: 35px;
        border-radius: 5px;
        overflow: hidden;
        line-height: 20px;
    }

    #tip input[type="text"] {
        border: 1px solid silver;
        box-shadow: 3px 4px 3px 0px silver;
        height: 25px;
        border: 0;
        padding-left: 5px;
        width: 280px;
        border-radius: 3px;
        outline: none;
    }

    .editMapButtons {
        display: flex;
        flex-direction: column;
        position: absolute;
        position: absolute;
        right: 35px;
        bottom: 30px;

        .el-button {
            margin: 0;
        }

        .el-button + .el-button {
            margin-top: 10px;
        }
    }
</style>
