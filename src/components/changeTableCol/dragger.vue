<template>
    <div>
        <p class="changeCol-title">已显示（点击×不显示，√ 显示，左右拖动设置排列顺序）</p>
        <ul class="myButtonBox" id="showLabels" @dragover="allowDrop($event)" @drop="drop($event)"
            @dragstart="drag($event)">
            <li class="ele" draggable="true" v-for="item in showLabels" :key="item.name">{{item.name}} <i
                @click="removeLabel(item)" class="el-icon-close close"></i></li>
        </ul>
        <p class="changeCol-title">未显示</p>
        <ul class="myButtonBox noSortBox">
            <li class="ele fixele" v-for="(item,index) in noShowlabels" :key="index" v-if="!item.disabled">
                {{item.name}}
                <i @click="addLabel(item)" class="el-icon-check check"></i>
            </li>
        </ul>
        <div class="changeCol-foot-button">
            <el-button type="primary" @click="saveSort"> 保存</el-button>
            <el-button plain @click="close"> 取消</el-button>
        </div>
    </div>
</template>
<script>
    // todo 重构，应该分为显示字段、不显示字段，数据由组件处理

    export default {
        props: {
            value: {
                type: Array,
                default: () => []
            },
            allLabels: {
                type: Array,
                /**
                 * @param {boolean} disabled - 如果不想展示某个字段，可以使用这个属性（目前与饿了么表格的表头属性无冲突）
                 * */
                default: () => []
            },
            showLength: {
                type: Number,
                default: 6
            }
        },
        data () {
            return {
                currentTarget: null,
                noShowlabels: [],
                showLabels: [],
                sortText: [],
                time: null
            }
        },
        methods: {
            allowDrop (ev) {
                ev.preventDefault()
            },
            drag (ev) {
                ev.dataTransfer.setData('Text', ev.target.innerText)
                this.currentTarget = ev.target
            },
            drop (ev) {
                ev.preventDefault()
                var data = ev.dataTransfer.getData('Text')
                var target = ev.target
                if (target.nodeName === 'LI' && target !== this.currentTarget) {
                    //_index是实现的获取index
                    if (this._index(this.currentTarget) < this._index(target)) {
                        target.parentNode.insertBefore(this.currentTarget, target.nextSibling)
                    } else {
                        target.parentNode.insertBefore(this.currentTarget, target)
                    }
                }
            },
            _index (el) {
                var index = 0
                if (!el || !el.parentNode) {
                    return -1
                }
                while (el && (el = el.previousElementSibling)) {
                    index++
                }
                return index
            },
            removeLabel (item) {
                this.showLabels.splice(this.showLabels.indexOf(item), 1)
                this.noShowlabels.push(item)
            },
            addLabel (item) {
                if (this.showLabels.length >= this.showLength) {
                    this.$message({
                        type: 'warning',
                        message: '超过列表展示上限！'
                    })
                    return
                }
                this.noShowlabels.splice(this.noShowlabels.indexOf(item), 1)
                this.showLabels.push(item)
            },
            updateSortlabel () {
                this.sortText = [].map.call(document.querySelector('#showLabels').children, item => {
                    return item.innerText.trim()
                })
            },
            saveSort () {
                this.updateSortlabel()

                // 每次重新计算，节省内存
                const nameMapOfAllLabels = this.allLabels.reduce((acc, item) => (acc[item.name] = item, acc), {})

                /* get columns */
                const selectColumnList = this.sortText.map(item => nameMapOfAllLabels[item])
                this.$emit('input', selectColumnList)
                this.close()
            },
            close () {
                this.$emit('closeDialog')
            }
        },
        created () {
            // 原来的组件设计，内部维护自身的状态，点击保存才更新父组件状态
            if (!this.value.length) {
                this.showLabels = []
                this.noShowlabels = this.allLabels.slice()
                console.log(1)
                return
            }

            const enableLabels = []
            const nameMapOfCurrentEnableLabels = this.value.reduce((acc, item) => (enableLabels.push(item), acc[item.name] = item, acc), {})
            this.showLabels = enableLabels
            const disabledLabels = []
            this.allLabels.forEach(item => {
                if (nameMapOfCurrentEnableLabels[item.name]) {
                    return
                }
                disabledLabels.push(item)
            })

            this.noShowlabels = disabledLabels
        }
    }
</script>
<style lang="scss" scoped>
    .myButtonBox {
        list-style: none;
        font-size: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }

    .ele {
        font-size: 16px;
        width: 100px;
        height: 40px;
        border: 1px solid #999;
        background: #409EFF;
        margin: 2px 0;
        border-radius: 10px;
        color: white;
        cursor: move;
        margin: 10px;
        line-height: 40px;
        text-align: center;
        transition: all 2s;
        position: relative;
    }

    .fixele {
        cursor: default;

    }

    .noSortBox {
        // border: 1px solid red;
    }

    .close {
        color: #d0cba8;
        position: absolute;
        font-size: 12px;
        cursor: pointer;
        right: 5px;
        top: 3px;
    }

    .check {
        color: #31ff00;
        position: absolute;
        font-size: 12px;
        cursor: pointer;
        right: 5px;
        top: 2px;
    }

    .changeCol-title {
        border-bottom: 2px #eee solid;
        padding: 10px;
    }

    .changeCol-foot-button {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 1rem;

        .el-button {
            width: 100px;
            margin-left: 1rem;
        }
    }
</style>
