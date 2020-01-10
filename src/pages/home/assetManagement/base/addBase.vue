<template>
    <div>
        <el-form ref="landDetail" :rules="rules" :model="landDetail" label-width="140px">
            <p class="wrapper-title"><span>基地信息</span></p>
            <div class="content-wrapper">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="基地名称：" prop="name">
                            <el-input v-model="landDetail.name" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="24">
                            <el-form-item label="基地地址：" prop="position">
                                <el-input type="textarea"
                                          :autosize="{ minRows: 2, maxRows: 4}"
                                          v-model="landDetail.position" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="坐标：" prop="coordinate">
                            <el-input v-model="landDetail.coordinate" placeholder="请输入内容" disabled>
                                <el-button slot="append" @click="showLocalDialog = true"
                                           icon="el-icon-location-outline"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </div>
        </el-form>
        <br>

        <el-dialog title="设置位置" :visible.sync="showLocalDialog" width="70%" :close-on-click-modal="false"
                   v-if="showLocalDialog">
            <locat-map @closeAndSave="saveAddress" :coordinate="landDetail.coordinate"
                       :CoordinateType="CoordinateType"></locat-map>
        </el-dialog>

        <div class="updata-button">
            <el-button type="info" @click="back">返回</el-button>
            <el-button type="primary" @click="saveLandDetail">保存</el-button>
        </div>
    </div>
</template>
<script>
    const landDescribeLimit = {
        validator: (rules, value, callback) => {
            if (value && value.length > 100) {
                callback(new Error('最长100个汉字/字母/数字'))
            } else {
                callback()
            }
        }, trigger: 'change'
    }

    function getPathOption (pathArray) {
        return pathArray.map(element => {
            return [element.lng, element.lat]
        })
    }

    import MultipleUploadImgs from '@/components/new-upLoadImg/MultipleUploadImgs'
    import BaseLandSelect from '@/components/service/BaseLandSelect'
    import someMap from '../LandManagement/component/map'
    import locatMap from '../SeedlingManagement/component/map'
    import landMapSet from '../LandManagement/landMapSet'

    export default {
        components: {
            MultipleUploadImgs,
            BaseLandSelect,
            someMap,
            locatMap,
            landMapSet,
        },
        name: 'addland',
        data () {
            return {
                CoordinateType: { controller: false, massif: true, nursery: false, },
                terrainOption: [],
                landOwnerOption: [],
                landSourcesOption: [],
                soilTypeOption: [],
                showLocalDialog: false,
                landDetail: {
                    name: '',
                    position: '',
                    coordinate: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入地块名', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value.length > 30) {
                                    callback(new Error('最长30个字符！'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }],
                    position: [
                        { required: true, message: '请输入地址', trigger: 'change' },
                        {
                            required: true, validator: (rules, value, callback) => {
                                if (value.length > 50) {
                                    callback(new Error('长度小于等于50'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    coordinate: { required: true, message: '请选择坐标', trigger: 'change' },

                },

            }
        },
        methods: {
            saveAddress ({ address, coordinate }) {
                console.log()
                this.landDetail.position = address
                this.landDetail.coordinate = coordinate.toString()
                this.showLocalDialog = false
            },
            saveLandDetail () {
                this.$refs.landDetail.validate(async (valid) => {
                    if (valid) {
                        const res = await this.http.postJson(this.$route.query.id ? this.api.base.editBase : this.api.base.addBase, this.landDetail)
                        if (res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '新增成功！'
                            })
                            this.back()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    } else {
                        // this.$message({
                        //     type: 'warning',
                        //     message: '请完善信息'
                        // })
                    }
                })
            },
            async getBaseInfoById (id) {
                const res = await this.http.get(this.api.base.getBaseInfoById, { id })
                Object.assign(this.landDetail, res.fmpBase)

            },

            back () {
                this.$router.replace('/home/base')
            },
        },
        mounted () {
        },
        async created () {

            if (this.$route.query.id) {
                // 暂时先copy
                if (!this.$hasPerms('base-update')) {
                    this.$message.error('亲爱的用户，您好！由于您没有该权限，故无法进行该项操作')
                    this.$router.back()
                    return
                }

                this.getBaseInfoById(this.$route.query.id)
            } else {
                // 暂时先copy
                if (!this.$hasPerms('base-add')) {
                    this.$message.error('亲爱的用户，您好！由于您没有该权限，故无法进行该项操作')
                    this.$router.back()
                    return
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .updata-button {
        margin-top: 1rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    #container {
        width: 930px;
        height: 700px;
        display: inline-block;
    }

</style>
