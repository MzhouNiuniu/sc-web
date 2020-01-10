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
            <div class="updata-button">
                <el-button   :type="artData.isOpen === 1? 'primary' : 'info'" :disabled="artData.irriTime !== 0 || artData.isOpen === 1" @click="openControl(1)">{{artData.irriTime === 0? null: artData.irriTime}} 开启</el-button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button   :type="artData.isOpen === 1? 'info' : 'primary'" :disabled="artData.irriTime !== 0 || artData.isOpen !== 1" @click="openControl(2)">{{artData.irriTime === 0? null: artData.irriTime}}停止</el-button>
            </div>
            <div class="updata-button">
                <el-button type="primary" @click="artificialController({controllerId: artData.id, type: 2})" > 关闭人工设定</el-button>
            </div>
            <span class="opti">{{num}}</span>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => {}
        }
    },
    data() {
        return {
            tableData: [],
            artData: {},
            timer1: null,
            timer2: null,
            num: 99999
        }
    },
    methods: {
        async artificialController(params) {
            console.log(new Date().getTime());
           const res = await this.http.get(this.api.GroupControler.artificialController, params);
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
                else {
                    this.writeLocalStrory(this.artData, 1);
                    this.afterWriteSetTime(this.artData);
                    this.setInter();
                    console.log(new Date().getTime());
                    this.$emit('reloadTable');
                    let message = ''
                    if(params.type === 1) {
                        //    message = '人工设定状态开启'
                    } else {
                        //    message = '人工设定状态关闭'
                        this.$emit('closeDialog');
                    }
                }
               
           } else {
            //    this.$message({
            //        type: 'error',
            //        message: res.message
            //    })
           }
        },
        async openOrStopController(params) {
            const res = await this.http.get(this.api.GroupControler.openOrStopController, params);
            if(res && res.code === 200) {
                this.writeLocalStrory(this.artData, 2);
                this.afterWriteSetTime(this.artData);
                this.setInter();
                let message = ''
                if(params.type === 1) {
                    message = '开启灌溉';
                    this.artData.isOpen = 1
                } else {
                    message = '关闭灌溉';
                    this.artData.isOpen = 0
                }
                this.$emit('reloadTable');
                this.$message({
                    type: 'success',
                    message
                })
           } else {
               this.$message({
                   type: 'error',
                   message: res.message
               })
           }
        },
        openControl(type) {
            if(this.artData.isOpen === type) {
                return
            }
            if(!this.artData.isOpen&& type === 2) {
                return
            }
            this.openOrStopController({
                    controllerId: this.artData.id,
                    type
                })
        },
        // 写入每次操作的时间到缓存中
        writeLocalStrory(val, type) {
            // type 1 为对应  artStatusTi （人工设定状态），2 代表 artIrriTi（灌溉状态）
            // 表示将对应的 id的操作时间写入
            let artTime = localStorage.getItem('artTime') || '{}';
            artTime = JSON.parse(artTime);
            if(type === 1) {
                artTime[val.id] ? (artTime[val.id].artStatusTi = new Date().getTime() ) : (artTime[val.id] = { artStatusTi : new Date().getTime() } );
            } else if (type === 2) {
                artTime[val.id] ? (artTime[val.id].artIrriTi = new Date().getTime() ) : (artTime[val.id] = { artIrriTi : new Date().getTime() } );
            }
            localStorage.setItem('artTime', JSON.stringify(artTime));
        },
        afterWriteSetTime(val) {
            let artTime = localStorage.getItem('artTime') || '{}';
            artTime = JSON.parse(artTime);
            if(artTime[val.id]) {
                    const timeOb = artTime[val.id];
                    val.artStatusTi = timeOb.artStatusTi || 0;
                    val.artIrriTi = timeOb.artIrriTi || 0;
                } else {
                    // id 对应的值没有说明，还没有操作过这个人工按钮
                    val.artStatusTi = 0;
                    val.artIrriTi = 0;
                }
                val.statusTime = val.artStatusTi === 0 ? 0 : (new Date().getTime() - val.artStatusTi >= 15000? 0 : 15000 - (new Date().getTime() - val.artStatusTi) );
                val.irriTime = val.artIrriTi === 0 ? 0 : (new Date().getTime() - val.artIrriTi >= 15000? 0 : 15000 - (new Date().getTime() - val.artIrriTi) );

                val.statusTime = Math.floor(val.statusTime/1000);
                val.irriTime = Math.floor(val.irriTime/1000);
        },
        setInter() {
            const _this = this;
            if(_this.artData.statusTime <= 0) {
            } else {
                _this.artData.statusTime --;
                _this.num--;
            }
            if(_this.artData.irriTime <= 0) {
                } else {
                    _this.artData.irriTime --;
                    _this.num--;
                }
            if(this.timer1) {
                clearInterval(this.timer1)
            }
            if(this.timer2) {
                clearInterval(this.timer2)
            }
            this.timer1 = setInterval(() => {
            if(_this.artData.statusTime <= 0) {
                clearInterval(_this.timer1);
            } else {
                _this.artData.statusTime --;
                _this.num--;
            }
            }, 1000);
            this.timer2 = setInterval(() => {
                if(_this.artData.irriTime <= 0) {
                    clearInterval(_this.timer2);
                } else {
                    _this.artData.irriTime --;
                    _this.num--;
                }
            },1000)
        }
    },
    created() {
        this.tableData = this.data;
        this.artData = this.tableData[0];
        this.afterWriteSetTime(this.artData);
        if(this.artData.stateKey !== 3) {
                this.artificialController({
                controllerId: this.artData.id,
                type: 1
            });
        };
        this.setInter();
    },
     beforeDestroy() {
        console.log('人工设定弹窗被关闭了！');
        clearInterval(this.timer1);
        clearInterval(this.timer2);
    }
}
</script>
<style lang="scss" scoped>
.updata-button{
        margin-top: 1rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    .opti{
        opacity: 0;
    }
</style>
