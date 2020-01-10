<template>
    <div>
        <p class="wrapper-title"><span>基地管理</span></p>
        <div class="content-wrapper">
            <div class="searchAndButtonBox">
                <div>
                    <el-input placeholder="请输入关键字" v-model="key" class="input-with-select">
                        <el-button slot="append" @click="searchKey" icon="el-icon-search"></el-button>
                    </el-input>

                </div>
                <div class="option-button">
                    <el-button type="primary" v-allow="'base-add'" @click="$router.push('/home/addBase')">
                        新建
                    </el-button>
                    <el-button type="primary" @click="toModify"   v-allow="'base-update'"   >
                        编辑
                    </el-button>
                    <el-button type="primary" @click="deleteLands" v-allow="'base-delete'">删除</el-button>

                    <!--<el-button type="primary"  @click="changeColShowVisible = true">设置列表字段</el-button>-->
                </div>
            </div>
            <br>
            <section>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        type="index"
                        width="50"
                        :index="indexMethod"
                    >
                    </el-table-column>

                    <el-table-column
                        show-overflow-tooltip
                        v-for="(item, index) in showKeys"
                        :key="index"
                        :label="item.name"
                        :prop="item.key"
                        :width="item.width?item.width:'auto'"
                    >
                        <!--<template slot-scope="scope">-->
                            <!--<span @click="handleCurrentTableRow(scope.row)" class="clickATag"-->
                                  <!--v-if="item.key === 'number'"> {{scope.row.number || '/'}}</span>-->
                            <!--<span v-else> {{(scope.row[item.key] === 0 ?'0':scope.row[item.key]) || '/'}}</span>-->
                        <!--</template>-->
                    </el-table-column>
                </el-table>

                <pagination :totalNum="total" :currentPage="params.pageNo" @handleCurrentChange="handleCurrentChange">
                </pagination>
            </section>


        </div>
    </div>
</template>
<script>
    import pagination from '@/components/pagination/pagination.vue'
    import dragger from '@/components/changeTableCol/dragger.vue'
    import {toExcel} from '@/utils/excel.js'
    import axios from 'axios'
    import {checkPageLimit} from '@/utils'
    // import { setOptionLog }  from '@'
    // 单个二维码下载和批量二维码下载。 传入对应的url
    import {singleImgByName, handleBatchDownload} from '@/utils/downImgsZip.js'
    import {setOptionLog} from '../util/index'
    import {debounce} from '@/utils'

    export default {
        components: {
            pagination, dragger
        },
        // name: 'LandManagement',
        data() {
            return {
                // downTemplate: '',
                downTemplate: 'static/template/地块信息批量录入模版.xls',
                params: {
                    key: '',
                    areaNum: '',
                    pageNo: 1,
                    pageSize: 8
                },
                key: '',
                areaNum: '',
                areaOption: [],
                tableData: [
                ],
                total: 200,
                selectLands: [], // 被勾选中的地块
                excelDialogVisible: false,
                changeColShowVisible: false,
                uploadExcel: null, // 上传excel的文件对象
                showKeys: [
                    {
                        name: '基地编号',
                        key: 'number',
                        width: '150px'

                    }, {
                        name: '基地名称',
                        key: 'name',

                    },
                    {
                        name: '基地地址',
                        key: 'position',


                    }, {
                        name: '坐标',
                        key: 'coordinate',
                        width: '200px'

                    },
                ],  // 要展示的 对应字段
                fileList: []
            }
        },
        created() {
            this.getMassifList(this.params);
            this.getDropDown();
        },
        activated() {
            this.getMassifList(this.params);
        },
        methods: {
            // 勾选哪些项
            handleSelectionChange(value) {
                this.selectLands = value;
            },
            toModify() {
                if (this.selectLands.length == 1) {
                    this.$router.push({path: '/home/addBase', query: {id: this.selectLands[0].id}})
                }
                else {
                    this.$message.error('请选择一条数据进行编辑！')
                }

            },
            // 索引的序列
            indexMethod(index) {
                const num = this.params.pageNo;
                return (num - 1) * 8 + index + 1;
            },
            // 批量删除地块
            deleteLands: debounce(async function () {
                const ids = this.selectLands.map(item => item.id).join(',');
                if (ids.length == 0) {
                    this.$message.error('至少选择一个')
                    return
                }
                this.$confirm('如果删除，则该基地的编码不可重复使用，请谨慎操作！可以修改基地的相关信息，以适应需求。确定删除吗？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '不删除',
                    type: 'warning'
                }).then(async () => {
                        try {
                            const res = await this.http.delete(this.api.base.delete, {ids});
                            if (res.code == 200) {
                                this.$message.success('删除成功')
                                this.getMassifList(this.params);
                            }
                            else {
                                this.$message.error(res.message)
                            }
                        } catch (err) {

                        }

                    }
                )
                console.log(res)

            }),
            // 分页
            handleCurrentChange(value) {
                this.params.pageNo = value;
                this.getMassifList(this.params);
            },
            // 点击查看列表
            handleCurrentTableRow(currentRow) {
                this.$router.push({
                    path: '/home/seeOrEditLand',
                    query: {
                        id: currentRow.id
                    }
                })
            },
            // 观察excel文件，
            handlePreview(value) {
                if (value.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || value.raw.type === 'application/vnd.ms-excel') {
                    this.uploadExcel = value.raw;
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请上传.xlsx 或 .xls 类型的文件'
                    })
                    this.fileList = [];
                }
            },
            deleteFile() {
                this.uploadExcel = null;
            },
            handleClose() {
            },
            handleChange() {
            },
            // 导入excel超出
            uploadExcelExcel() {
                this.$message({
                    type: 'warning',
                    message: "当前只支持一个文件进行导入"
                })
            },

            // 获得列表数据
            async getMassifList(params) {
                const res = await this.http.get(this.api.base.getBaseInfoList, params);
                if (res.code === 200) {
                    this.tableData = res.fmpBases

                    this.total = Number(res.total);
                }
            },
            // 改变选中的值进行查询
            changeSelectArae(value) {
                this.params.pageNo = 1;
                // this.params.condition = '';
                this.params.areaNum = this.areaNum;
                this.getMassifList(this.params);
            },
            // 搜索关键词
            searchKey() {
                this.params.pageNo = 1;
                this.params.key = this.key;
                this.getMassifList(this.params);
            },
            async getDropDown() {
                const res = await this.http.get(this.api.Massif.dropDown, {});
                if (res && res.code === 200) {
                    this.areaOption = res.data.area;
                    this.areaOption.unshift({
                        sfValue: '请选择面积',
                        sfKey: ''
                    })

                } else {
                    return []
                }
            },
            beforeAvatarUpload() {
            },
            // 批量导入
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


