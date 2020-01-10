<template>
    <div>
        <p class="wrapper-title">
            <span>控制器管理列表</span>
        </p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input
                        placeholder="请输入控制器/编码名称"
                        v-model="keywords"
                        class="input-with-select controls_input"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="searchKeyWord"></el-button>
                    </el-input>&nbsp;
                    &nbsp;
                    <el-select
                        v-model="massifId"
                        placeholder="请选择"
                        @change="changeSelect(massifId)"
                        class="input-with-select"
                    >
                        <el-option label="请选择地块名称" value/>
                        <el-option
                            v-for="item in PlantAgeOption"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </div>
                <div class="option-button">
                    <el-button
                        v-allow="'controller-add'"
                        type="primary"
                        @click="$router.push('/home/addController')"
                    >新增
                    </el-button>
                    <el-button v-allow="'controller-delete'" type="primary" @click="deleteSeedling">删除</el-button>
                    <el-button
                        v-allow="'controller-import'"
                        type="primary"
                        @click="excelDialogVisible = true"
                    >导入
                    </el-button>
                    <el-button v-allow="'controller-change'" type="primary" @click="changeController">变更</el-button>
                    <el-button v-allow="'controller-export'" type="primary" @click="downExcel">导出</el-button>
                    <el-button v-allow="'controller-exportQrcode'" type="primary" @click="downloadImgs">导出二维码
                    </el-button>
                    <el-button
                        v-allow="'controller-setListColumns'"
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
                    <el-table-column label="#" prop="index" width="50"></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        v-for="(item, index) in showKeys "
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
                title="导入控制器"
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
                            download="控制器导入模板.xlsx"
                        >点此下载Excel导入模板</a> )
                    </p>
                    <br/>
                    <p>注意事项：</p>
                    <div>
                        <p>1. 单次导入行数限制为50条，超出请分批导入,</p>
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
                        :file-list="fileList"
                        :limit="1"
                        :on-exceed="uploadExcelExcel"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="excelDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="importNurseryStock">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="设置列显示"
                :visible.sync="changeColShowVisible"
                width="50%"
                v-if="changeColShowVisible"
                :close-on-click-modal="false"
            >
                <dragger
                    @closeDialog="changeColShowVisible = false"
                    :allLabels="allLabels"
                    :showLength="8"
                    v-model="showKeys"
                ></dragger>
            </el-dialog>
            <el-dialog
                title="控制器变更"
                :visible.sync="changeSeedlingVisible"
                width="30%"
                :close-on-click-modal="false"
                v-if="changeSeedlingVisible"
            >
                <change-control
                    :isControl="true"
                    :controllerIds="selectSeedlings.map(item => item.id)"
                    @closeDialog="changeSeedlingVisible = false"
                    @saveClose="reloadTable"
                ></change-control>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    // 当前页面的Seedling 对象吗，从苗木那边复制过来，暂时没有更改，不影响功能，可将Seedling默认相当于控制器。

    import pagination from '@/components/pagination/pagination.vue'
    import dragger from '@/components/changeTableCol/dragger.vue'
    import { toExcel } from '@/utils/excel.js'
    import { checkPageLimit } from '@/utils'
    // 单个二维码下载和批量二维码下载。 传入对应的url
    import { singleImgByName, handleBatchDownload } from '@/utils/downImgsZip.js'
    import changeControl from './component/changeControl'
    import { setOptionLog } from '../util/index'
    import { debounce } from '@/utils'

    import axios from 'axios'

    export default {
        components: {
            pagination,
            dragger,
            changeControl
        },
        // name: 'controller',
        data () {
            return {
                downTemplate: 'static/template/控制器导入模板.xlsx',
                allLabels: [
                    {
                        name: '控制器编码',
                        key: 'number',
                        width: '180px'
                    },
                    {
                        name: '控制器名称',
                        key: 'name',
                        width: ''
                    },
                    {
                        name: '基地名称',
                        key: 'baseName',
                        width: ''
                    },
                    {
                        name: '地块名称',
                        key: 'massifName',
                        width: ''
                    },
                    {
                        name: '滴头数',
                        key: 'waterNum',
                        width: ''
                    },
                    {
                        name: '控制面积（亩）',
                        key: 'area',
                        width: ''
                    },
                    {
                        name: '坐标',
                        key: 'coordinate',
                        width: ''
                    },
                    {
                        name: 'MAC地址',
                        key: 'macAddress',
                        width: '200px'
                    },
                    {
                        name: '创建时间',
                        key: 'createTime',
                        width: '200px'
                    },
                    {
                        name: '位置',
                        key: 'position',
                        width: '300px'
                    }
                ],
                showKeys: [
                    {
                        name: '控制器编码',
                        key: 'number',
                        width: '180px'
                    },
                    {
                        name: '控制器名称',
                        key: 'name',
                        width: ''
                    },
                    {
                        name: '基地名称',
                        key: 'baseName',
                        width: '120'
                    },
                    {
                        name: '地块名称',
                        key: 'massifName',
                        width: '120'
                    },
                    {
                        name: '滴头数',
                        key: 'waterNum',
                        width: ''
                    },
                    {
                        name: '控制面积（亩）',
                        key: 'area',
                        width: '120px'
                    },
                    {
                        name: '坐标',
                        key: 'coordinate',
                        width: '180'
                    },
                    {
                        name: 'MAC地址',
                        key: 'macAddress',
                        width: '140'
                    }
                ], // 应该展示的keys
                params: {
                    keywords: '',
                    massifId: '',
                    pageNo: 1,
                    pageSize: 8,
                    stateKey: null
                },
                keywords: '',
                massifId: '',
                landOption: [],
                PlantAgeOption: [],
                tableData: [],
                total: 200,
                selectSeedlings: [], // 被选中的苗木信息
                uploadExcel: null, // 上传的excel文件对象
                excelDialogVisible: false,
                changeColShowVisible: false,
                changeSeedlingVisible: false,
                seedling: [], // 苗木的种类
                fileList: []
            }
        },
        methods: {
            handleSelectionChange (value) {
                this.selectSeedlings = value
            },
            handleCurrentChange (value) {
                this.params.pageNo = value
                this.getGroupControllerList(this.params)
            },
            handleCurrentTableRow (currentRow) {
                this.$router.push({
                    path: '/home/seeOrEditContorller',
                    query: {
                        id: currentRow.id
                    }
                })
            },
            deleteSeedling: debounce(function () {
                // 调用接口将选中的id传给后台进行删除
                const ids = this.selectSeedlings.map(item => item.id).toString()
                if (ids.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                const flag = this.selectSeedlings.every(ele => ele.stateKey === 0)
                if (!flag) {
                    this.$message({
                        type: 'warning',
                        message: '控制器状态必须都为未设定或未绑定'
                    })
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.http.delete(
                        this.api.controller.deleteController,
                        {
                            ids
                        }
                    )
                    if (res && res.code === 200) {
                        if (res.bizCode && res.bizCode === 401) {
                            this.$message({
                                type: 'error',
                                message: res.bizMsg
                            })
                            return
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.params.pageNo = checkPageLimit(
                            this.selectSeedlings,
                            this.tableData,
                            this.params.pageNo,
                            this.total
                        )
                        this.getGroupControllerList(this.params)
                        this.selectSeedlings = []
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            }),
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
            // 批量下载二维码压缩包
            downloadImgs: debounce(function () {
                if (this.selectSeedlings.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '您尚未选择控制器！'
                    })
                    return
                }
                // this.selectLands // 被勾选的地块
                // 这里去调用后台接口拿到 二维码
                const imgs = []
                this.selectSeedlings.forEach(ele => {
                    imgs.push({
                        name: ele.qrCode1Name,
                        url: ele.qrCode1Url
                    })
                })
                handleBatchDownload(imgs, '控制器二维码压缩包.zip')
                setOptionLog('控制器管理', '导出二维码')
            }, 500),

            uploadExcelExcel () {
                this.$message({
                    type: 'warning',
                    message: '当前只支持一个文件进行导入'
                })
            },
            async downExcel () {
                const ids =
                    this.selectSeedlings.length > 0
                        ? this.selectSeedlings.map(ele => ele.id).toString()
                        : null
                const keywords = this.keywords
                const massifId = this.massifId
                const res = await this.http.get(
                    this.api.controller.exportControllerList,
                    {
                        ids: ids,
                        keywords,
                        massifId
                    }
                )
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
                    '基地名称',
                    '地块名称',
                    '控制器编码',
                    '控制器名称',
                    '滴头数',
                    '控制面积（亩）',
                    '坐标',
                    '添加时间',
                    '二维码网址链接1'
                ]
                const filterVal = [
                    'index',
                    'baseName',
                    'massifName',
                    'number',
                    'name',
                    'waterNum',
                    'area',
                    'coordinate',
                    'createTime',
                    'qrCode1LinkUrl'
                ]
                const data = excelData.map(v => filterVal.map(k => v[k]))
                const [fileName, fileType, sheetName] = [
                    '控制器导出列表',
                    'xlsx',
                    '控制器'
                ]
                toExcel({ th, data, fileName, fileType, sheetName })
            },
            searchKeyWord () {
                this.params.keywords = this.keywords
                this.params.pageNo = 1
                this.getGroupControllerList(this.params)
            },
            changeSelect (value) {
                this.params.massifId = value
                this.params.pageNo = 1
                this.getGroupControllerList(this.params)
            },
            getSeedlingNameBykey (key) {
                for (const iterator of this.seedling) {
                    if (iterator.sfKey === key) {
                        return iterator.sfValue
                    }
                }
            },
            // 批量导入
            async importNurseryStock () {
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
                    this.api.controller.exportController,
                    forms
                )
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '上传成功！'
                    })
                    this.excelDialogVisible = false
                    this.getGroupControllerList(this.params)
                } else {
                    if (res.code === 401 && res.data && Array.isArray(res.data.list)) {
                        const errorList = res.data.list
                        if (errorList) {
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
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                }
            },
            // 获取下拉列表
            async getDropDownList (params) {
                const res = await this.http.get(
                    this.api.controller.getControllerDropDownList,
                    {
                        flag: 2
                    }
                )
                if (res && res.code === 200) {
                    this.PlantAgeOption = res.data.list || this.PlantAgeOption // 此接口有可能出现null
                }
            },
            // 获取列表
            async getGroupControllerList (params) {
                const res = await this.http.get(
                    this.api.controller.getGroupControllerList,
                    params
                )
                if (res && res.code === 200) {
                    const { pageNo, pageSize } = this.params
                    res.data.obj.list.forEach((item, index) => {
                        item.index = (pageNo - 1) * pageSize + index + 1
                    })

                    this.tableData = res.data.obj.list
                    this.total = +res.data.obj.total
                }
            },
            changeController: debounce(function () {
                if (this.selectSeedlings.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择控制器！'
                    })
                    return
                }
                const flag = this.selectSeedlings.every(ele => ele.stateKey === 0)
                if (!flag) {
                    this.$message({
                        type: 'warning',
                        message: '控制器状态必须都为未设定或未绑定'
                    })
                    return
                }
                const ids = this.selectSeedlings.map(item => item.id).toString()
                this.changeSeedlingVisible = true
            }, 300),
            reloadTable () {
                this.changeSeedlingVisible = false
                this.getGroupControllerList(this.params)
            }
        },
        created () {
            this.getDropDownList()
            this.getGroupControllerList(this.params)
        },
        watch: {
            showKeys() {
               this.getGroupControllerList(this.params);
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
    }

    /deep/ .el-button {
        // font-size: 0.8rem;
        padding: 0.75rem 1.25rem;
    }

    .excel-title {
        font-size: 18px;
        font-weight: 600;

        a {
            text-decoration: underline;
            cursor: pointer;
        }
    }
</style>
<style scoped>
    @media screen and (max-width: 1440px) {
        /deep/ .input-with-select {
            width: 12rem !important;
        }

        .controls_input {
            width: 19rem !important;
        }
    }
</style>

