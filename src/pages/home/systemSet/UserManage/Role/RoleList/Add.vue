<template>
    <el-dialog
        :title="`${data ? '编辑' : '新建'}角色`"
        :visible="open"
        width="500px"
        v-bind="$attrs"
        v-on="$listeners"

        :close-on-click-modal="false"
    >
        <el-form ref="form" :model="model" :rules="rules" v-if="open">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="model.roleName" placeholder="角色名称" :maxlength="10"/>
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
                <el-input type="textarea" v-model="model.remark" placeholder="角色描述" :maxlength="30"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: 'AddRole',
        inject: ['$roleBridge'],
        props: {
            open: Boolean,
            data: Object,
        },
        data () {
            return {
                model: this.getDefaultModel(),
                rules: {
                    roleName: {
                        required: true,
                        message: '请输入角色名称',
                    },
                    remark: {
                        required: true,
                        message: '请输入角色描述',
                    },
                },
            }
        },
        methods: {
            getDefaultModel () {
                return {
                    roleName: '',
                    remark: '',
                }
            },
            save () {
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        return
                    }

                    if (!this.data) {
                        this.http.postJson(this.api.system.role.create, this.model).then(res => {
                            if (res.code !== 200) {
                                this.$message.error(res.message)
                                return
                            }

                            this.$emit('success', 'create')
                        })
                    } else {
                        // 修改角色（修改时需要把当前拥有的权限传过去，不然权限列表就变空了。。。）
                        this.$store.dispatch('log', ['角色权限', '修改'])
                        this.http.postJson(this.api.system.role.edit, {
                            ...this.model,
                            roleCode: this.data.roleCode,
                            roleId: this.data.roleId,
                            organizationId: this.data.organizationId,
                            menus: this.$roleBridge.getSelectedMenus(),
                        }).then(res => {
                            if (res.code !== 200) {
                                this.$message.error(res.message)
                                return
                            }

                            this.$emit('success', 'edit')
                        })
                    }
                })
            },
        },
        watch: {
            open (isOpen) {
                if (!isOpen) {
                    return
                }

                const { data } = this

                if (this.data) {
                    this.model.roleName = data.roleName
                    this.model.remark = data.remark
                } else {
                    this.model = this.getDefaultModel()
                }
            },
        },
    }
</script>

<style scoped lang="scss">

</style>
