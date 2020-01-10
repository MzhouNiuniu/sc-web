<template>
    <div>
        <p class="wrapper-title">
            <span>苗木管理</span>
        </p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input
                        placeholder="请输入关键字"
                        v-model="condition"
                        class="input-with-select seedling_input"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="searchKeyWord"></el-button>
                    </el-input>
                    <el-select v-model="ageNum" @change="changeSelect(2, ageNum)" class="input-with-select">
                        <el-option label="请选择株龄" value/>
                        <el-option
                            v-for="item in PlantAgeOption"
                            :key="item.sfKey"
                            :label="item.sfValue"
                            :value="item.sfKey"
                        ></el-option>
                    </el-select>
                    <el-select v-model="massif" @change="changeSelect(1, massif)" class="input-with-select">
                        <el-option label="请选择地块" value/>
                        <el-option
                            v-for="(item, index) in landOption"
                            :key="index"
                            :label="item.name"
                            :value="item.name"
                        />
                    </el-select>
                </div>
                <div class="option-button">
                    <el-button
                        v-allow="'nursery-add'"
                        type="primary"
                        @click="$router.push('/home/addSeedling')"
                    >新建
                    </el-button>
                    <el-button v-allow="'nursery-delete'" type="primary" @click="deleteSeedling">删除</el-button>
                    <el-button v-allow="'nursery-import'" type="primary" @click="excelDialogVisible = true">导入
                    </el-button>
                    <el-button v-allow="'nursery-change'" type="primary" @click="changeSeedling">变更</el-button>
                    <el-button v-allow="'nursery-export'" type="primary" @click="downExcel">导出</el-button>
                    <el-button v-allow="'nursery-exportQrcode'" type="primary" @click="downloadImgs">导出二维码</el-button>
                    <el-button
                        v-allow="'nursery-setListColumns'"
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
                        v-for="(item, index) in showKeys "
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width"
                    >
                        <template slot-scope="scope">
                              <span
                                  class="clickATag"
                                  v-if="item.key === 'number'"
                                  @click="handleCurrentTableRow(scope.row)"
                              >
                                  {{scope.row.number || '/'}}
                              </span>
                            <span v-else>
                                {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}
                            </span>
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
                title="导入苗木"
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
                            download="苗木信息批量录入模版.xls"
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
                        :limit="1"
                        :file-list="fileList"
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
                    :showLength="6"
                    v-model="showKeys"
                ></dragger>
            </el-dialog>
            <el-dialog
                title="苗木变更"
                :visible.sync="changeSeedlingVisible"
                width="30%"
                :close-on-click-modal="false"
                v-if="changeSeedlingVisible"
            >
                <change-seedling
                    :seedlingIds="selectSeedlings.map(item => item.id)"
                    @saveClose="reloadTable"
                    @closeDialog="changeSeedlingVisible = false"
                ></change-seedling>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import pagination from '@/components/pagination/pagination.vue'
    import dragger from '@/components/changeTableCol/dragger.vue'
    import { toExcel } from '@/utils/excel.js'
    import { checkPageLimit } from '@/utils'
    // 单个二维码下载和批量二维码下载。 传入对应的url
    import { singleImgByName, handleBatchDownload } from '@/utils/downImgsZip.js'
    import changeSeedling from './component/changeSeedling'
    import { setOptionLog } from '../util/index'
    import { debounce } from '@/utils'
    import mixinFieldsConfig from './mixinFieldsConfig'

    export default {
        components: {
            pagination,
            dragger,
            changeSeedling
        },
        mixins: [mixinFieldsConfig],
        data () {
            return {
                downTemplate: 'static/template/苗木信息批量录入模版.xls',
                allLabels: [
                    {
                        name: '苗木编号',
                        key: 'number',
                        width: '180px'
                    },
                    {
                        name: '苗木名称',
                        key: 'nurseryStockName',
                        width: ''
                    },
                    {
                        name: '株龄',
                        key: 'age',
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
                        name: '坐标',
                        key: 'coordinate',
                        width: 188
                    },

                    // 二期新增4个字段
                    {
                        name: '林权证号',
                        key: 'forestOwnershipCertifi',
                        width: 240, // 22字符
                        disabled: true
                    },
                    {
                        name: '权益人',
                        key: 'equityPerson',
                        width: 186, // 9字符
                        disabled: true
                    },
                    {
                        name: '守护人',
                        key: 'keeper',
                        width: 186, // 9字符
                        disabled: true
                    },
                    {
                        name: '守护时间',
                        key: 'keepTime', // keepTime是合成字段（keepStartTime + keepEndTime）
                        width: 250, // 23字符
                        disabled: true
                    },

                    {
                        name: '传记',
                        key: 'biography',
                        width: '400px'
                    },
                    {
                        name: '责任人',
                        key: 'responsible',
                        width: ''
                    },
                    {
                        name: '单位',
                        key: 'unitKey',
                        width: ''
                    },
                    {
                        name: '添加时间',
                        key: 'createTime',
                        width: ''
                    },
                    {
                        name: '栽种时间',
                        key: 'plantTime',
                        width: ''
                    },
                    {
                        name: '位置',
                        key: 'position',
                        width: '400px'
                    }
                ],
                params: {
                    condition: '',
                    massif: '',
                    ageNum: '',
                    pageNo: 1,
                    pageSize: 8
                },
                condition: '',
                ageNum: '',
                massif: '',
                landOption: [],
                PlantAgeOption: [],
                tableData: [],
                total: 200,
                selectSeedlings: [], // 被选中的苗木信息
                uploadExcel: null, // 上传的excel文件对象
                excelDialogVisible: false,
                changeColShowVisible: false,
                changeSeedlingVisible: false,
                // 页面上正在展示的字段
                showKeys: [
                    // 默认字段
                    {
                        name: '苗木编号',
                        key: 'number',
                        width: '180px',
                    },
                    {
                        name: '苗木名称',
                        key: 'nurseryStockName'
                    },
                    {
                        name: '株龄',
                        key: 'age'
                    },
                    {
                        name: '基地名称',
                        key: 'baseName'
                    },
                    {
                        name: '地块名称',
                        key: 'massifName'
                    },
                    {
                        name: '坐标',
                        key: 'coordinate'
                    }
                ],
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
                this.getNurseryStockList(this.params)
            },
            handleCurrentTableRow (currentRow) {
                this.$router.push({
                    path: '/home/seeOrEditSeedling',
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
                        message: '尚未选择苗木！'
                    })
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.http.delete(
                        this.api.seedling.deleteNurseryStock,
                        {
                            ids
                        }
                    )
                    if (res && res.code === 200) {
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
                        this.getNurseryStockList(this.params)
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
                        message: '您尚未选择苗木！'
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
                    imgs.push({
                        name: ele.qrCode2Name,
                        url: ele.qrCode2Url
                    })
                })
                handleBatchDownload(imgs, '苗木二维码压缩包.zip')
                setOptionLog('苗木管理', '导出二维码')
            }),
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
                const condition = this.condition
                const massif = this.massif
                const ageNum = this.ageNum
                const res = await this.http.get(this.api.seedling.exportNurseryStock, {
                    ids: ids,
                    condition,
                    massif,
                    ageNum
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
                // const excelData = (this.selectSeedlings.length > 0
                //   ? this.selectSeedlings
                //   : this.tableData
                // ).map((item, index) => ((item.index = index + 1), item)); // 多选的情况下，序号从1开始

                // 导出表格的字段是固定不变的，不根据是否隐藏字段进行调整。
                // 字段隐藏，导出的表格，该字段的数据为空；字段不隐藏，导出的表格，该字段的数据带出
                //            0         1           2            3          4         5       6        7          8           9           10         11        12         13         14
                const th = [
                    '序号',
                    '苗木编码',
                    '苗木名称',
                    '基地名称',
                    '地块名称',
                    '株龄',
                    '坐标',
                    '责任人',
                    '添加时间',
                    '栽种时间',
                    '林权证号',
                    '权益人',
                    '守护人',
                    '守护开始时间',
                    '守护截止时间',
                    '传记',
                    '二维码网址链接1',
                    '二维码网址链接2'
                ]
                const filterVal = [
                    'index',
                    'number',
                    'nurseryStockName',
                    'baseName',
                    'massifName',
                    'age',
                    'coordinate',
                    'responsible',
                    'createTime',
                    'plantTime',
                    'forestOwnershipCertifi',
                    'equityPerson',
                    'keeper',
                    'keepStartTime',
                    'keepEndTime',
                    'biography',
                    'qrCode1Url',
                    'qrCode2Url'
                ]

                // from mixin
                const { fieldsConfig } = this
                if (!fieldsConfig.forestOwnershipCertifi.enable) {
                    filterVal[10] = '#'
                }
                if (!fieldsConfig.equityPerson.enable) {
                    filterVal[11] = '#'
                }
                if (!fieldsConfig.keeper.enable) {
                    filterVal[12] = '#'
                }
                if (!fieldsConfig.keepTime.enable) {
                    filterVal[13] = '#'
                }
                if (!fieldsConfig.keepTime.enable) {
                    filterVal[14] = '#'
                }
                if (!fieldsConfig.biography.enable) {
                    filterVal[15] = '#'
                }

                const data = excelData.map(v => filterVal.map(k => v[k]))
                const [fileName, fileType, sheetName] = ['苗木导出列表', 'xlsx', '苗木']

                toExcel({ th, data, fileName, fileType, sheetName })
            },
            // 获取苗木列表
            async getNurseryStockList (params) {
                const res = await this.http.get(
                    this.api.seedling.getNurseryStockList,
                    params
                )
                if (res && res.code === 200) {
                    const { pageNo, pageSize } = this.params
                    res.data.list.forEach((item, index) => {
                        item.index = (pageNo - 1) * pageSize + index + 1
                        item.keepStartTime &&
                        item.keepEndTime &&
                        (item.keepTime = item.keepStartTime + ' 至 ' + item.keepEndTime)
                    })

                    this.tableData = res.data.list
                    this.total = +res.data.total
                } else {
                    this.$message({
                        type: 'error',
                        message: '错误，请联系管理员！'
                    })
                }
            },
            searchKeyWord () {
                this.params.condition = this.condition
                this.params.pageNo = 1
                this.getNurseryStockList(this.params)
            },
            changeSelect (type, value) {
                if (type === 1) {
                    this.params.massif = value
                } else if (type === 2) {
                    this.params.ageNum = value
                }
                this.params.pageNo = 1
                this.getNurseryStockList(this.params)
            },
            async nurseryStockDropDown () {
                const res = await this.http.get(
                    this.api.seedling.nurseryStockDropDown,
                    {}
                )
                if (res && res.code == 200) {
                    this.PlantAgeOption = res.data.age
                    this.seedling = res.data.seedling
                    this.landOption = res.data.massifList
                } else {
                    this.$message({
                        type: 'error',
                        message: '系统错误，请联系管理员！'
                    })
                }
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
                    this.api.seedling.importNurseryStock,
                    forms
                )
                if (res && res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '上传成功！'
                    })
                    this.excelDialogVisible = false
                    this.getNurseryStockList(this.params)
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
            },
            changeSeedling: debounce(function () {
                if (this.selectSeedlings.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择苗木！'
                    })
                    return
                }
                const ids = this.selectSeedlings.map(item => item.id).toString()
                this.changeSeedlingVisible = true
            }),
            reloadTable () {
                this.changeSeedlingVisible = false
                this.getNurseryStockList(this.params)
            },
            afterGetFieldConfig (config) {
                this.allLabels.forEach(item => {
                    switch (item.key) {
                        case 'forestOwnershipCertifi':
                            item.disabled = !config.forestOwnershipCertifiShow
                            break
                        case 'equityPerson':
                            item.disabled = !config.equityPersonShow
                            break
                        case 'keeper':
                            item.disabled = !config.keeperShow
                            break
                        case 'keepTime':
                            item.disabled = !config.keepTimeShow
                            break
                        case 'biography':
                            item.disabled = !config.biographyShow
                            break
                    }
                })
            }
        },
        created () {
            this.nurseryStockDropDown()
            this.getNurseryStockList(this.params)
        },
        watch: {
            showKeys () {
                this.getNurseryStockList(this.params)
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
<style scoped lang="scss">
    @media screen and (max-width: 1440px) {
        /deep/ .input-with-select {
            width: 12rem !important;
        }

        .seedling_input {
            width: 14rem !important;
        }
    }

    @media screen and (max-width: 1366px) {
        /deep/ .input-with-select {
            width: 10rem !important;
        }

        .seedling_input {
            width: 13.5rem !important;
        }
    }

    /deep/ {
        .el-tooltip {
            width: 100% !important; // fix 超长文字，http://192.168.8.240:8088/show_bug.cgi?id=3593
        }
    }
</style>

