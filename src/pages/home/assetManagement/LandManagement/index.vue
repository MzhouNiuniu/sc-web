<template>
    <div>
        <p class="wrapper-title">
            <span>地块管理</span>
        </p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="请输入关键字" v-model="condition" class="input-with-select">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-select
                        v-model="areaNum"
                        placeholder="请选择面积"
                        @change="changeSelectArae"
                        class="input-with-select"
                    >
                        <el-option
                            v-for="item in areaOption"
                            :key="item.sfKey"
                            :label="item.sfValue"
                            :value="item.sfKey"
                        ></el-option>
                    </el-select>
                </div>
                <div class="option-button">
                    <el-button v-allow="'massif-add'" type="primary" @click="$router.push('/home/addland')">新建
                    </el-button>
                    <el-button v-allow="'massif-delete'" type="primary" @click="deleteLands">删除</el-button>
                    <el-button v-allow="'massif-Import'" type="primary" @click="excelDialogVisible = true">导入
                    </el-button>
                    <el-button v-allow="'massif-export'" type="primary" @click="downExcel">导出</el-button>
                    <el-button v-allow="'massif-exportQrcode'" type="primary" @click="downloadImgs">导出二维码</el-button>
                    <el-button
                        v-allow="'massif-setListColumns'"
                        type="primary"
                        @click="changeColShowVisible = true"
                    >设置列表字段
                    </el-button>
                </div>
            </div>
            <br/>
            <section>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="#" prop="index" width="50"/>
                    <el-table-column
                        show-overflow-tooltip
                        v-for="(item, index) in showKeys"
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width?item.width:'auto'"
                    >
                        <template slot-scope="scope">
              <span
                  @click="handleCurrentTableRow(scope.row)"
                  class="clickATag"
                  v-if="item.key === 'number'"
              >{{scope.row.number || '/'}}</span>
                            <span v-else>{{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    :totalNum="total"
                    :currentPage="params.pageNo"
                    @handleCurrentChange="handleCurrentChange"
                ></pagination>
            </section>
            <el-dialog
                title="导入地块"
                :visible.sync="excelDialogVisible"
                width="50%"
                :close-on-click-modal="false"
                @closed="uploadExcel = null"
            >
                <div v-if="excelDialogVisible">
                    <p class="excel-title">
                        一、按照导入模板的格式准备导入数据 (
                        <a
                            :href="downTemplate"
                            target="_blank"
                            download="地块信息批量录入模版.xls"
                        >点此下载Excel导入模板</a> )
                    </p>
                    <br/>
                    <p>注意事项：</p>
                    <div>
                        <p>1. 单次导入行数限制为30条，超出请分批导入,</p>
                        <p>2. 数据必须按照规定的表格模板进行填写。</p>
                    </div>
                    <br/>
                    <p class="excel-title">二、选择需要导入的Excel文件</p>
                    <br/>
                    <el-upload
                        class="upload-demo"
                        :on-change="handlePreview"
                        :on-remove="deleteFile"
                        :auto-upload="false"
                        :action="'123'"
                        :limit="1"
                        :file-list="fileList"
                        :on-exceed="uploadExcelExcel"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="excelDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="importSfMassif">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="设置列显示"
                :visible.sync="changeColShowVisible"
                width="50%"
                :close-on-click-modal="false"
                v-if="changeColShowVisible"
            >
                <dragger
                    @closeDialog="changeColShowVisible = false"
                    :allLabels="allLabels"
                    :showLength="7"
                    v-model="showKeys"
                ></dragger>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import pagination from '@/components/pagination/pagination.vue'
    import dragger from '@/components/changeTableCol/dragger.vue'
    import { toExcel } from '@/utils/excel.js'
    import axios from 'axios'
    import { checkPageLimit } from '@/utils'
    // import { setOptionLog }  from '@'
    // 单个二维码下载和批量二维码下载。 传入对应的url
    import { singleImgByName, handleBatchDownload } from '@/utils/downImgsZip.js'
    import { setOptionLog } from '../util/index'
    import { debounce } from '@/utils'

    export default {
        components: {
            pagination,
            dragger
        },
        // name: 'LandManagement',
        data () {
            return {
                // downTemplate: '',
                downTemplate: 'static/template/地块信息批量录入模版.xls',
                allLabels: [
                    {
                        name: '地块编号',
                        key: 'number',
                        width: '140px'
                    },
                    {
                        name: '地块名称',
                        key: 'name',
                        width: ''
                    },
                    {
                        name: '基地名称',
                        key: 'baseName',
                        width: '130px'
                    },
                    {
                        name: '位置',
                        key: 'position',
                        width: '300px'
                    },
                    {
                        name: '面积（亩）',
                        key: 'area',
                        width: '100px'
                    },
                    {
                        name: '年产量(kg)',
                        key: 'annualProduction',
                        width: '',
                    },
                    {
                        name: '责任人',
                        key: 'responsible',
                        width: '150px'
                    },
                    {
                        name: '坐标',
                        key: 'coordinate',
                        width: '200px'
                    },
                    {
                        name: '地形',
                        key: 'terrainKey',
                        width: ''
                    },
                    {
                        name: '海拔',
                        key: 'altitude',
                        width: ''
                    },
                    {
                        name: '土壤类型',
                        key: 'soilTypeKey',
                        width: ''
                    },
                    {
                        name: '坡度',
                        key: 'slope',
                        width: ''
                    },
                    {
                        name: '土地权属',
                        key: 'landOwnershipKey',
                        width: ''
                    },
                    {
                        name: '土地来源',
                        key: 'landSourceKey',
                        width: ''
                    },
                    {
                        name: '年限',
                        key: 'yearsLimit',
                        width: ''
                    },
                    {
                        name: '土地详情',
                        key: 'landDetails',
                        width: '300px'
                    },
                    {
                        name: '东至',
                        key: 'east',
                        width: '200px'
                    },
                    {
                        name: '南至',
                        key: 'south',
                        width: '200px'
                    },
                    {
                        name: '西至',
                        key: 'west',
                        width: '200px'
                    },
                    {
                        name: '北至',
                        key: 'north',
                        width: '200px'
                    }

                    // {
                    //     name: '预计年产量',
                    //     key: 'plan',
                    //     width: '',
                    //     width: '200px'
                    // },
                ],
                params: {
                    condition: '',
                    areaNum: '',
                    pageNo: 1,
                    pageSize: 8
                },
                condition: '',
                areaNum: '',
                areaOption: [],
                tableData: [],
                total: 200,
                selectLands: [], // 被勾选中的地块
                excelDialogVisible: false,
                changeColShowVisible: false,
                uploadExcel: null, // 上传excel的文件对象
                showKeys: [
                    {
                        name: '地块编号',
                        key: 'number',
                        width: '140px'
                    },
                    {
                        name: '地块名称',
                        key: 'name',
                        width: ''
                    },
                    {
                        name: '基地名称',
                        key: 'baseName',
                        width: '130px'
                    },
                    {
                        name: '位置',
                        key: 'position',
                        width: '300px'
                    },
                    {
                        name: '面积（亩）',
                        key: 'area',
                        width: '100px'
                    },
                    {
                        name: '年产量(kg)',
                        key: 'annualProduction',
                        width: '',
                    },
                    {
                        name: '责任人',
                        key: 'responsible',
                        width: '150px'
                    }
                ], // 要展示的 对应字段
                fileList: []
            }
        },
        created () {
            this.getMassifList(this.params)
            this.getDropDown()
        },
        activated () {
            this.getMassifList(this.params)
        },
        methods: {
            // 勾选哪些项
            handleSelectionChange (value) {
                this.selectLands = value
            },
            // 批量删除地块
            deleteLands: debounce(function () {
                const ids = this.selectLands.map(item => item.id)
                if (ids.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择地块！'
                    })
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const ids = this.selectLands.map(ele => ele.id).toString()
                    const res = await this.http.delete(this.api.Massif.deleteMassif, {
                        ids: ids
                    })
                    if (res && res.code === 200) {
                        if (res.bizCode && res.bizCode === 401) {
                            this.$message({
                                type: 'error',
                                message: res.bizMsg
                            })
                            return
                        }
                        this.params.pageNo = checkPageLimit(
                            this.selectLands,
                            this.tableData,
                            this.params.pageNo,
                            this.total
                        )
                        this.getMassifList(this.params)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.selectLands = []
                    } else if (res && res.code === 401) {
                        this.$message.error(res.message)
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            }),
            // 分页
            handleCurrentChange (value) {
                this.params.pageNo = value
                this.getMassifList(this.params)
            },
            // 点击查看列表
            handleCurrentTableRow (currentRow) {
                this.$router.push({
                    path: '/home/seeOrEditLand',
                    query: {
                        id: currentRow.id
                    }
                })
            },
            // 观察excel文件，
            handlePreview (value) {
                if (
                    value.raw.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    value.raw.type === 'application/vnd.ms-excel'
                ) {
                    this.uploadExcel = value.raw
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请上传.xlsx 或 .xls 类型的文件'
                    })
                    this.fileList = []
                }
            },
            deleteFile () {
                this.uploadExcel = null
            },
            handleClose () {
            },
            handleChange () {
            },
            // 导入excel超出
            uploadExcelExcel () {
                this.$message({
                    type: 'warning',
                    message: '当前只支持一个文件进行导入'
                })
            },
            // 批量下载二维码压缩包
            downloadImgs: debounce(function () {
                if (this.selectLands.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '您尚未选择地块！'
                    })
                    return
                }
                // this.selectLands // 被勾选的地块
                // 这里去调用后台接口拿到 二维码
                const imgs = []
                this.selectLands.forEach(ele => {
                    imgs.push({
                        name: ele.qrCode1Name,
                        url: ele.qrCode1Url
                    })
                    imgs.push({
                        name: ele.qrCode2Name,
                        url: ele.qrCode2Url
                    })
                })
                handleBatchDownload(imgs, '地块二维码压缩包.zip')
                setOptionLog('地块管理', '导出二维码')
            }),
            // 导出excel
            async downExcel () {
                const ids =
                    this.selectLands.length > 0
                        ? this.selectLands.map(ele => ele.id).toString()
                        : null
                const condition = this.condition
                const areaNum = this.areaNum
                const res = await this.http.get(this.api.Massif.exportSfMassifList, {
                    ids: ids,
                    condition,
                    areaNum
                })
                let excelData = null
                if (res && res.code === 200) {
                    excelData = res.data.list
                    excelData.forEach((ele, index) => {
                        ele.index = index + 1
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                    return
                }
                const th = [
                    '序号',
                    '地块编码',
                    '地块名称',
                    '面积（亩）',
                    '责任人',
                    '预计年产量',
                    '实际年产量',
                    '基地名称',
                    '位置',
                    '坐标',
                    '地形',
                    '海拔',
                    '土壤类型',
                    '坡度°',
                    '土地权属',
                    '土地来源',
                    '土地权属开始日期',
                    '土地权属结束日期',
                    '土地详情',
                    '东至',
                    '南至',
                    '西至',
                    '北至',
                    '二维码网址链接1',
                    '二维码网址链接2'
                ]
                const filterVal = [
                    'index',
                    'number',
                    'name',
                    'area',
                    'responsible',
                    'plan',
                    'annualProduction',
                    'baseName',
                    'position',
                    'coordinate',
                    'terrainKey',
                    'altitude',
                    'soilTypeKey',
                    'slope',
                    'landOwnershipKey',
                    'landSourceKey',
                    'yearsStart',
                    'yearsEnd',
                    'landDetails',
                    'east',
                    'south',
                    'west',
                    'north',
                    'qrCode1Url',
                    'qrCode2Url'
                ]
                const data = excelData.map(v => filterVal.map(k => v[k]))
                const [fileName, fileType, sheetName] = ['地块表格', 'xlsx', '地块']
                toExcel({ th, data, fileName, fileType, sheetName })
            },
            // 获得列表数据
            async getMassifList (params) {
                const res = await this.http.get(this.api.Massif.getMassifList, params)
                if (res.code === 200) {
                    const { pageNo, pageSize } = this.params
                    res.data.list.forEach((item, index) => {
                        item.index = (pageNo - 1) * pageSize + index + 1
                        item.yearsLimit = item.yearsStart + '至' + item.yearsEnd
                    })

                    this.tableData = res.data.list
                    this.total = +res.data.total
                }
            },
            // 改变选中的值进行查询
            changeSelectArae (value) {
                this.params.pageNo = 1
                // this.params.condition = '';
                this.params.areaNum = this.areaNum
                this.getMassifList(this.params)
            },
            // 搜索关键词
            searchKey () {
                this.params.pageNo = 1
                this.params.condition = this.condition
                this.getMassifList(this.params)
            },
            async getDropDown () {
                const res = await this.http.get(this.api.Massif.dropDown, {})
                if (res && res.code === 200) {
                    this.areaOption = res.data.area
                    this.areaOption.unshift({
                        sfValue: '请选择面积',
                        sfKey: ''
                    })
                } else {
                    return []
                }
            },
            beforeAvatarUpload () {
            },
            // 批量导入
            async importSfMassif () {
                if (!this.uploadExcel) {
                    this.$message({
                        type: 'warning',
                        message: '还没有选择上传文件！'
                    })
                    return
                }
                var forms = new FormData()
                forms.append('file', this.uploadExcel)
                const res = await this.http.postFormData(
                    this.api.Massif.importSfMassif,
                    forms
                )
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '上传成功！'
                    })
                    this.excelDialogVisible = false
                    this.getMassifList(this.params)
                } else {
                    if (res.code === 401 && res.data && Array.isArray(res.data.list)) {
                        const errorList = res.data.list
                        if (errorList) {
                            this.$alertTable(
                                [
                                    {
                                        width: 60,
                                        label: '行号',
                                        prop: 'rowNum',
                                    },
                                    {
                                        label: '错误信息',
                                        prop: 'errorMsg',
                                    },
                                ],
                                errorList,
                                {
                                    title: '导入失败',
                                },
                            )
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                }
            }
        },
        watch: {
            showKeys() {
               this.getMassifList(this.params);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .searchAndButtonBox {
        display: flex;
        justify-content: space-between;

        > div {
            display: flex;
            justify-content: space-between;
        }
    }

    .excel-title {
        font-size: 18px;
        font-weight: 600;

        a {
            text-decoration: underline;
            cursor: pointer;
        }
    }

    .input-with-select {
        margin-right: 1rem;
        width: 15rem;
    }

    .clickATag {
        cursor: pointer;
        text-decoration: underline;
    }

    .option-button {
        display: block !important;
    }

    /deep/ .el-input__inner {
        height: 2.75rem;
        line-height: 2.75rem;
        // font-size: 0.8rem;
        // font-size: 1rem;
    }

    /deep/ .el-button {
        // font-size: 0.8rem;
        padding: 0.75rem 1.25rem;
    }
</style>


