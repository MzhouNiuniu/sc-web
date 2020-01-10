<template>
    <div class="wordOrder">
        <div class="title">
            工单配置管理
            <el-button type="primary" @click="submit" style="float: right;margin-top: 20px;">保存</el-button>
        </div>
        <el-row :gutter="20" style="margin-top: -10px;">
            <el-col
                v-for="(item,index) in workOrders" :key="index"
                :span="8"
            >
                <div class="menu">
                    <div class="menuTitle">
                        <div class="reset" @click="reset(item.id)">重置</div>
                        <div class="title">
                            作业工单&ensp;—&ensp;{{item.workTypeName}}
                            <el-checkbox v-model="item.state">启用</el-checkbox>
                        </div>
                    </div>
                    <el-form :disabled="!item.state" label-position="left" label-width="68px">
                        <el-form-item label="作业类型">
                            <el-input placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="基地名称">
                            <el-input placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="地块名称">
                            <el-input placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="苗木名称">
                            <el-input placeholder="请输入内容"></el-input>
                            <el-radio-group v-model="item.nurseryNameShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="苗木编码">
                            <el-input placeholder="请输入内容"></el-input>
                            <el-radio-group v-model="item.nurseryNumberShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="苗木坐标">
                            <el-input placeholder="请输入内容"></el-input>
                            <el-radio-group v-model="item.nurseryCoordinateShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="面积 (亩)">
                            <el-input placeholder="请输入内容"></el-input>
                            <el-radio-group v-model="item.areaShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="数量 (棵)">
                            <el-input placeholder="请输入内容"></el-input>
                            <el-radio-group v-model="item.numShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="重量 (kg)">
                            <el-input placeholder="请输入内容"></el-input>
                            <el-radio-group v-model="item.weightShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="图片" style="display: block;">
                            <imgUpload :authenStatus="true"></imgUpload>
                            <el-radio-group v-model="item.picShow">
                                <el-radio :label="0">不展示</el-radio>
                                <el-radio :label="1">展示(非必填)</el-radio>
                                <el-radio :label="2">展示(必填)</el-radio>
                            </el-radio-group>
                        </el-form-item>


                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import imgUpload from '@/components/new-upLoadImg/MultipleUploadImgs'

    export default {
        components: {
            imgUpload
        },
        data () {
            return {
                workOrders: '',
            }
        },
        methods: {
            async getFmpWorkOrderConfigInfoList () {
                const res = await this.http.get(this.api.system.getFmpWorkOrderConfigInfoList)
                this.workOrders = res.workOrders
            },
            async reset (id) {
                const res = await this.http.get(this.api.system.getFmpWorkOrderConfigInfoList)
                res.workOrders.forEach((item) => {
                    if (item.id == id) {
                        this.workOrders.forEach((items, index) => {
                            if (items.id == id) {
                                Object.assign(this.workOrders[index], item)
                                this.$forceUpdate()
                            }
                        })
                    }

                })
            },
            async submit () {
                const res = await this.http.postJson(this.api.system.editFmpWorkOrderConfigBatch, this.workOrders)

                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '修改失败'
                    })
                }

            }
        },
        created () {
            this.getFmpWorkOrderConfigInfoList()
        }
    }
</script>
<style lang="scss" scoped>
    .wordOrder {
        min-width: 1156px;

        background: #fff;
        padding-left: 20px;
        padding-right: 20px;


        .title {
            color: #000000;
            font-size: 20px;
            font-weight: 500;
            height: 75px;
            line-height: 75px;

        }

        .menu {
            margin-top: 10px;
            padding-bottom: 4px;
            border: 1px solid #DCDFE6;
            border-radius: 4px;

            .menuTitle {
                display: flex;
                margin-bottom: 2px;

                .reset {
                    width: 70px;
                    height: 40px;
                    line-height: 40px;
                    color: #ffffff;
                    background: #368DFE;
                    font-size: 14px;
                    text-align: center;
                    cursor: pointer;
                }

                .title {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    height: 40px;
                    line-height: 40px;
                    background: #D8D8D8;
                    font-size: 18px;
                    flex: 1;
                }
            }
        }

    }

    /deep/ {
        .el-form {
            padding: 4px 10px 0;
        }

        .el-form-item {
            margin-bottom: 16px;
        }

        .el-form-item__label {
            white-space: nowrap;
        }

        .el-form-item__content {
            line-height: 1;
        }

        .el-radio-group {
            white-space: nowrap;
            margin-top: 4px;

            .el-radio {
                margin-right: 10px;
            }
        }
    }
</style>
