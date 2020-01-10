<template>
    <div class="mod-role">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
            </el-table-column>
            <el-table-column
                prop="roleId"
                header-align="center"
                align="center"
                width="80"
                label="ID">
            </el-table-column>
            <el-table-column
                prop="roleName"
                header-align="center"
                align="center"
                label="角色名称">
            </el-table-column>
            <el-table-column
                prop="remark"
                header-align="center"
                align="center"
                label="备注">
            </el-table-column>
            <el-table-column
                prop="createTime"
                header-align="center"
                align="center"
                width="180"
                label="创建时间">
            </el-table-column>
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
                    <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
      created () {
        console.log('11')
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList:  async function () {
        this.dataListLoading = true
          let params={
              'pageNo': this.pageIndex,
              'pageSize': this.pageSize,
              'roleName': this.dataForm.roleName,
              appMark :'efeee287-a2a6-4cda-b3fc-3c2c4e750cfb'
          }
         const data= await this.http.get(this.api.system.roleList,params)
          if (data && data.code === 200) {
              this.dataList = data.data.obj.list
              this.totalPage = Number(data.data.obj.total)
          } else {
              this.dataList = []
              this.totalPage = 0
          }
          this.dataListLoading = false
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
       delete: async function(ids) {
            const params=this.http.adornData(ids, false)
            const data= await this.http.postJson(this.api.sys.roleDelete,params)
            if (data && data.code === 0) {
                this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                        this.getDataList()
                    }
                })
            } else {
                this.$message.error(data.msg)
            }

        },
      // 删除
      deleteHandle (id) {

        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {this.delete(ids)}).catch(() => {})
      }
    }
  }
</script>

<style scoped lang="scss">
    .wrapper-title {
        border-left: 4px solid #2285dc;
        padding-left: 10px;
        color: #383838;
        font-size: 14px;
    }
    .mod-role {
        margin: 15px 0;
        background: #fff;
        padding: 20px;
    }
</style>
