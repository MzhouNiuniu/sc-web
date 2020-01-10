<template>
    <div>
        <el-form ref="changeSeedlingParams" :rules="rules" :model="changeSeedlingParams" label-width="140px">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="变更方式：" prop="modeKey">
                        <el-select v-model="changeSeedlingParams.modeKey" placeholder="请选择">
                            <el-option
                                v-for="item in changeWaysOption"
                                :key="item.sfKey"
                                :label="item.sfValue"
                                :value="item.sfKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="changeSeedlingParams.modeKey === 'into'">
                <el-col :span="20">
                    <el-form-item label="基地：" prop="nowBaseId">
                        <BaseLandSelect
                            v-model="changeSeedlingParams.nowBaseId"
                            @change="handleBaseLandChange"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="changeSeedlingParams.modeKey === 'into'" :key="changeSeedlingParams.modeKey">
                <el-col :span="20">
                    <el-form-item label="地块：" prop="nowMassifId">
                        <el-select v-model="changeSeedlingParams.nowMassifId" placeholder="请选择">
                            <el-option
                                v-for="item in landsOption"
                                :key="item.name"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="changeSeedlingParams.modeKey === 'loss'" :key="changeSeedlingParams.modeKey">
                <el-col :span="20">
                    <el-form-item label="流失原因：" prop="reasonsKey">
                        <el-select v-model="changeSeedlingParams.reasonsKey" placeholder="请选择">
                            <el-option
                                v-for="item in lossReasonOpt"
                                :key="item.sfKey"
                                :label="item.sfValue"
                                :value="item.sfKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="描述：" prop="description">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 2}"
                            placeholder="请输入内容"
                            v-model="changeSeedlingParams.description"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="updata-button">
            <el-button type="info" @click="$emit('closeDialog')">取消</el-button>
            <el-button :disabled="isDisabled" type="primary" @click="saveEdit('changeSeedlingParams')">保存</el-button>
        </div>
    </div>
</template>
<script>
    import BaseLandSelect from '@/components/service/BaseLandSelect'

    export default {
        components: {
            BaseLandSelect,
        },
        props: {
            seedlingIds: {
                type: Array,
                default: () => {
                }
            },
            isControl: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                changeWaysOption: [],
                landsOption: [],
                lossReasonOpt: [],
                changeSeedlingParams: {
                    modeKey: '',
                    ids: '',
                    nowBaseId: '',
                    nowMassifId: '',
                    description: '',
                    reasonsKey: ''
                },
                rules: {
                    modeKey: [{ required: true, message: '请选择变更方式', trigger: 'change' }],
                    nowBaseId: [{ required: true, message: '请选择基地', trigger: 'change' }],
                    nowMassifId: [{ required: true, message: '请选择地块', trigger: 'change' }],
                    reasonsKey: [{ required: true, message: '请选择流失原因', trigger: 'change' }],
                    description: [{
                        validator: (rules, value, callback) => {
                            if (value.length > 100) {
                                callback(new Error('最长100个汉字/字母/数字'))
                            } else {
                                callback()
                            }
                        }, trigger: 'change'
                    }]
                },
                isDisabled: false
            }
        },
        methods: {
            saveEdit (name) {
                // 验证苗木表单
                this.$refs[name].validate(async valid => {
                    if (valid) {
                        const params = JSON.parse(JSON.stringify(this.changeSeedlingParams))
                        params.ids = this.seedlingIds
                        if (params.modeKey === 'sell') {
                            delete params.nowBaseId
                            delete params.nowMassifId
                            delete params.reasonsKey
                        }
                        if (params.modeKey === 'loss') {
                            delete params.nowBaseId
                            delete params.nowMassifId
                        }
                        if (params.modeKey === 'into') {
                            delete params.reasonsKey
                        }
                        const res = await this.http.postJson(this.api.seedling.changeNurseryStock, params)
                        if (res.code == 200) {
                            if (res.bizCode && res.bizCode === 401) {
                                this.$message({
                                    type: 'error',
                                    message: res.bizMsg
                                })
                                return
                            }
                            this.$message({
                                type: 'success',
                                message: '变更成功！'
                            })
                            this.$emit('saveClose')
                        } else if (res && res.code === 1001) {
                            this.$alert(res.message + '，请返回列表，重新选择', '提示', {
                                confirmButtonText: '返回',
                                callback: action => {
                                    this.$emit('saveClose')
                                },
                                showClose: false
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    }
                })
            },
            async getlandOptionByBaseId (id) {
                const res = await this.http.get(this.api.seedling.massifInfoByBaseId, {
                    id
                }, true)
                if (res.code == 200) {
                    return res.data.list
                } else {
                    return []
                }
            },
            async handleBaseLandChange () {
                this.landsOption = await this.getlandOptionByBaseId(this.changeSeedlingParams.nowBaseId)
                this.changeSeedlingParams.nowMassifId = ''
            },
            async getChangeWay () {
                const res = await this.http.get(this.api.Massif.dropDown, {})
                if (res.code == 200) {
                    this.changeWaysOption = res.data.changeMode
                }
            },
            async getLossReason () {
                const res = await this.http.get(this.api.seedling.lossReason, {})
                if (res.code == 200) {
                    this.lossReasonOpt = res.data.list
                }
            }
        },
        created () {
            this.getChangeWay()
            this.getLossReason()
        }
    }
</script>
<style lang="scss" scoped>
    .updata-button {
        text-align: center;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
</style>
