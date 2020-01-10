<template>
    <el-dialog
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                 label-width="80px">
            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="dataForm.type">
                    <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="menuName">
                <el-input v-model="dataForm.menuName" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentName">
                <el-popover
                    ref="menuListPopover"
                    placement="bottom-start"
                    trigger="click">
                    <el-tree
                        :data="menuList"
                        :props="menuListTreeProps"
                        node-key="menuId"
                        ref="menuListTree"
                        @current-change="menuListTreeCurrentChangeHandle"
                        :default-expand-all="true"
                        :highlight-current="true"
                        :expand-on-click-node="false">
                    </el-tree>
                </el-popover>
                <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true"
                          placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.type === 1||3" label="菜单路由" prop="url">
                <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
                <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
                <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0"
                                 label="排序号"></el-input-number>
            </el-form-item>
            <el-form-item v-if="dataForm.type == 0" label="菜单图标" prop="icon">
                <el-row>
                    <el-col :span="22">
                        <!--<el-popover-->
                            <!--ref="iconListPopover"-->
                            <!--placement="bottom-start"-->
                            <!--trigger="click"-->
                            <!--popper-class="mod-menu__icon-popover">-->
                            <!--<div class="mod-menu__icon-list">-->
                                <!--<el-button-->
                                    <!--v-for="(item, index) in iconList"-->
                                    <!--:key="index"-->
                                    <!--@click="iconActiveHandle(item)"-->
                                    <!--:class="{ 'is-active': item === dataForm.icon }">-->
                                    <!--<icon-svg :name="item"></icon-svg>-->
                                <!--</el-button>-->
                            <!--</div>-->
                        <!--</el-popover>-->
                        <el-input v-model="dataForm.icon"
                                  placeholder="菜单图标名称" class="icon-list__input"></el-input>
                    </el-col>
                    <el-col :span="2" class="icon-list__tips">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">请用element ui 自带图片 名字请一致 详情 请点击此<a
                                href="http://element.eleme.io/#/zh-CN/component/icon"
                                target="_blank" style="color: red;">element ui  icons</a>描述
                            </div>
                            <i class="el-icon-warning"></i>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
    import {treeDataTranslate} from '@/utils'
    import Icon from '@/icons'

    export default {
        data() {
            var validateUrl = (rule, value, callback) => {
                if (this.dataForm.type === 1 && !/\S/.test(value)) {
                    callback(new Error('菜单URL不能为空'))
                } else {
                    callback()
                }
            }
            return {
                visible: false,
                dataForm: {
                    id: 0,
                    type: 1,
                    typeList: ['目录', '菜单', '按钮', '展示'],
                    menuName: '',
                    parentId: 0,
                    parentName: '',
                    url: '',
                    perms: '',
                    orderNum: 0,
                    icon: '',
                    iconList: []
                },
                dataRule: {
                    menuName: [
                        {required: true, message: '菜单名称不能为空', trigger: 'blur'}
                    ],
                    parentName: [
                        {required: true, message: '上级菜单不能为空', trigger: 'blur'}
                    ],
                    url: [
                        {validator: validateUrl, trigger: 'blur'}
                    ]
                },
                menuList: [],
                menuListTreeProps: {
                    label: 'menuName',
                    children: 'children'
                }
            }
        },
        created() {
            console.log('加载')
            // this.iconList = Icon.getNameList()
            //
            // console.log(Icon)
        },
        methods: {
            init: async function (id) {
                this.dataForm.id = id || 0
                const data = await this.http.get(this.api.system.menu.list, {appMark :'efeee287-a2a6-4cda-b3fc-3c2c4e750cfb'})
                this.menuList = treeDataTranslate(data, 'menuId')
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })

                if (!this.dataForm.id) {
                    // 新增
                    this.menuListTreeSetCurrentNode()
                } else {
                    // 修改
                    const data = await this.http.get(`${this.api.system.menuInfo}/${this.dataForm.id}`, this.http.adornParams())
                    console.log(data)
                    this.dataForm.id = data.menu.menuId
                    this.dataForm.type = data.menu.type
                    this.dataForm.menuName = data.menu.menuName
                    this.dataForm.parentId = data.menu.parentId
                    this.dataForm.url = data.menu.url
                    this.dataForm.perms = data.menu.perms
                    this.dataForm.orderNum = data.menu.orderNum
                    this.dataForm.icon = data.menu.icon
                    this.menuListTreeSetCurrentNode()
                }
            },
            // 菜单树选中
            menuListTreeCurrentChangeHandle(data, node) {
                this.dataForm.parentId = data.menuId
                this.dataForm.parentName = data.menuName
            },
            // 菜单树设置当前选中节点
            menuListTreeSetCurrentNode() {
                this.$nextTick(() => {
                    this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
                    this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['menuName']
                })

            },
            // 图标选中
            iconActiveHandle(iconName) {
                this.dataForm.icon = iconName
            },
            // 表单提交
            dataFormSubmit() {
                const that = this
                console.log(that.dataForm)
                this.$refs['dataForm'].validate(async function (valid) {

                    if (valid) {
                        const params = that.http.adornData({
                            'menuId': that.dataForm.id || undefined,
                            'type': that.dataForm.type,
                            'menuName': that.dataForm.menuName,
                            'parentId': that.dataForm.parentId,
                            'url': that.dataForm.url,
                            'perms': that.dataForm.perms,
                            'orderNum': that.dataForm.orderNum,
                            // 'icon': that.dataForm.icon,
                            'appmark' :'efeee287-a2a6-4cda-b3fc-3c2c4e750cfb'
                        })
                        const data = await that.http.postJson(`${that.api.system.menu}/${!that.dataForm.id ? 'save' : 'update'}`, params)

                        if (data && data.code === 200) {
                            that.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    that.visible = false
                                    that.$emit('refreshDataList')
                                }
                            })
                        } else {
                            that.$message.error(data.msg)
                        }

                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .mod-menu {
        .menu-list__input,
        .icon-list__input {
            > .el-input__inner {
                cursor: pointer;
            }
        }
        &__icon-popover {
            max-width: 370px;
        }
        &__icon-list {
            max-height: 180px;
            padding: 0;
            margin: -8px 0 0 -8px;
            > .el-button {
                padding: 8px;
                margin: 8px 0 0 8px;
                > span {
                    display: inline-block;
                    vertical-align: middle;
                    width: 18px;
                    height: 18px;
                    font-size: 18px;
                }
            }
        }
        .icon-list__tips {
            font-size: 18px;
            text-align: center;
            color: #e6a23c;
            cursor: pointer;
        }
    }
</style>
