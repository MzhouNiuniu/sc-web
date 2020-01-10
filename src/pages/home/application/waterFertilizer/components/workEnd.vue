<template>
    <div>
        <p class="workEnd-title">控制器信息</p>
        <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        >
            <el-table-column
                prop="baseName"
                label="基地名称"
                >
            </el-table-column>
            <el-table-column
                prop="massifName"
                label="地块名称"
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="控制器名称"
                >
            </el-table-column>
            <el-table-column
                prop="stateName"
                label="当前状态"
                >
            </el-table-column>
        </el-table>
        <div>
            <p class="work-tips" v-if="!isHaveEnd">确定后，“运行中”和“空闲中”状态的控制器的作业将会被取消，是否继续设定？</p>
            <p class="work-tips" v-if="isHaveEnd">确定且完成设定后，“运行中”和“空闲中”状态的控制器的作业将会被重置，是否继续设定？</p>
        </div>
        <div class="updata-button">
                <el-button type="info" @click="$emit('closeDialog')">取消</el-button>
                <el-button type="primary" @click="saveSet">确定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => {}
        },
        isHaveEnd: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tableData: []
        }
    },
    created() {
        // this.tableData = data;
        // 按照需求进行排序展示
        let arr1 = []; // 运行中的
        let arr2 = []; // 空闲中
        if(this.data && this.data.length > 0) {
            this.data.forEach(ele => {
                if(ele.stateKey === 2) {
                    arr1.push(ele);
                } else if(ele.stateKey === 1) {
                    arr2.push(ele);
                }
            })
        }
        this.tableData = this.tableData.concat(arr1,arr2);
    },
    methods: {
        async endGroupController({ controllerIds }) {
           const res = await this.http.get(this.api.GroupControler.endGroupController, {
               controllerIds
           });
           if(res && res.code === 200) {
               if(res.bizCode&&res.bizCode === 401) {
                    this.$message({
                        type: 'error',
                        message: res.bizMsg
                    })
                    return
                } else if(res.bizCode&&res.bizCode === 1001) {
                    this.$alert(res.bizMsg,'提示',{
                        confirmButtonText: '返回',
                        callback: action => {
                            this.$emit('closeDialog');
                            this.$emit('reloadTable');
                        },
                        showClose: false
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
        async saveSet() {
            if(this.isHaveEnd) {
                this.$emit('reloadTable');
                this.$emit('closeDialog');
                return
            }
            const controllerIds = this.tableData.map(item => item.id).toString();
            const res = await this.endGroupController({
                controllerIds
            });
            if(res &&res.code === 200) {
                this.$emit('reloadTable');
                this.$emit('closeDialog');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.updata-button{
        margin-top: 1rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    .workEnd-title{
        font-size: 1.2rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        font-weight: 600;
    }
    .work-tips{
        font-size: 1.2rem;
        text-align: center;
    }
</style>
