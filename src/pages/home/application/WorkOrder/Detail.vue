<template>
    <div>
        <p class="wrapper-title">
            <span>工单详情</span>
        </p>
        <el-form label-width="90px" label-position="left" size="small">
            <el-row>
                <!-- 改成循环 -->
                <el-col v-if="getIsDefine('number')">
                    <el-form-item label="工单编号:">
                        <span>{{detail.number}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('workType')">
                    <el-form-item label="作业类型">
                        <span>{{detail.workTypeName}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('baseName')">
                    <el-form-item label="基地名称">
                        <span>{{detail.baseName}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('massifName')">
                    <el-form-item label="地块名称">
                        <span>{{detail.massifName}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('nurseryName')">
                    <el-form-item label="苗木名称">
                        <span>{{detail.nurseryName}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('nurseryNumber')">
                    <el-form-item label="苗木编码">
                        <span>{{detail.nurseryNumber}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('nurseryCoordinate')">
                    <el-form-item label="苗木坐标">
                        <span>{{detail.nurseryCoordinate}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('area')">
                    <el-form-item label="面积（亩）">
                        <span>{{detail.area}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('num')">
                    <el-form-item label="数量（棵）">
                        <span>{{detail.num}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('weight')">
                    <el-form-item label="重量（KG）">
                        <span>{{detail.weight}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('operator')">
                    <el-form-item label="操作人">
                        <span>{{detail.operator}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('jobNumber')">
                    <el-form-item label="工号">
                        <span>{{detail.jobNumber}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('createTime')">
                    <el-form-item label="填单时间">
                        <span>{{detail.createTime}}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="getIsDefine('pics')">
                    <el-form-item label="图片">
                        <template v-if="!detail.pics">
                            /
                        </template>
                        <div v-else class="picture-container">
                            <img :src="item" alt="" v-for="(item,index)  in detail.pics" :key="index">
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <div style="text-align: center;">
                <router-link to="WorkOrder">
                    <el-button type="info">返回</el-button>
                </router-link>
            </div>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'WorkOrderDetail',
        data () {
            this.id = this.$route.query.id
            return {
                detail: {
                    pics: ['11']
                },
            }
        },
        methods: {
            getIsDefine (key) {
                if (this.detail[key] || this.detail[key] === 0) {
                    return true
                } else {
                    if (key !== 'pics') {
                        this.detail[key] = '/'
                    }

                    return true
                }
                // return this.detail[key] || this.detail[key] === 0
            },
            async loadDetail () {
                let res = await this.http.get(this.api.workOrder.detail, { id: this.id })

                if (!res.workOrder) {
                    this.handleError()
                    return
                }

                res = res.workOrder

                try {
                    res.pics = JSON.parse(res.pics)

                    if (!res.pics.length) {
                        delete res.pics
                    } else {
                        res.pics = res.pics.slice(0, 9)
                    }
                } catch (e) {
                    delete res.pics
                }

                this.detail = res
            },
            back () {
                this.$router.replace('/home/WorkOrder')
            },
            handleError () {
                this.$message.error('数据不存在')
                this.back()
            },
        },
        created () {
            if (!this.id) {
                this.handleError()
                return
            }
            this.loadDetail()
        },
    }
</script>
<style lang="scss" scoped>
    /deep/ {
        .el-form {
            margin-top: 10px;
            width: 900px;
            background: #fff;
            padding: 14px 20px;
        }

        .el-form-item__content {
            text-align: right;
        }
    }

    .picture-container {
        text-align: left;

        img {
            width: 18%;
            margin-right: 2%;
            max-width: 200px;
            max-height: 200px;
        }
    }
</style>
