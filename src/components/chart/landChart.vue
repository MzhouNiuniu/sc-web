<template>
    <div id="landChart">

    </div>
</template>
<script>
    import echarts from 'echarts'
    import chartFrame from './chartFrame'

    export default {
        extends: chartFrame,
        props: {
            chartData: {
                type: Object,
                default: () => {
                }
            },
            isChange: {
                type: String,
                default: ''
            }
        },
        data () {
            return {}
        },
        mounted () {
            this.myChart = echarts.init(document.getElementById('landChart'))
            let option = {
                color: ['#FF4501'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                grid: {
                    left: '6%',
                    right: '6%',
                },
                legend: {
                    data: [{
                        name: '地块面积',
                        icon: 'circle'
                    }, {
                        name: '苗木数量',
                        icon: 'circle'
                    }],
                    // left: '3%',
                    itemGap: 50
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.chartData.landName || [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        nameRotate: 90,
                        interval: 0,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false,
                            interval: 0
                        },
                        // 修改横轴的文字是否全部展示！
                        // axisLabel: {
                        //     interval:0
                        // }
                    }
                ],
                dataZoom: [{
                    type: 'slider',
                    show: true, //flase直接隐藏图形
                    xAxisIndex: [0],
                    // left: '9%', //滚动条靠左侧的百分比
                    bottom: 0,
                    // start: 0,//滚动条的起始位置
                    // end: 100, //滚动条的截止位置（按比例分割你的柱状图x轴长度）
                    startValue: 0,
                    endValue: 11,
                    zoomLock: true
                }],
                yAxis: [
                    {
                        type: 'value',
                        name: '面积',
                        min: 0,
                        // max: 250,
                        // interval: 50,
                        axisLabel: {
                            formatter: '{value} '
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                    },
                    {
                        type: 'value',
                        name: '数量',
                        min: 0,
                        // max: 25,
                        interval: 500,
                        axisLabel: {
                            formatter: '{value} '
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                    }
                ],
                series: [
                    {
                        name: '地块面积',
                        type: 'bar',
                        data: this.chartData.landData || [],
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: '#5DA6FE'
                            }, {
                                offset: 1,
                                color: '#348BFE'
                            }])
                        }
                    },
                    {
                        name: '苗木数量',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        symbolSize: 15,
                        showSymbol: false,
                        lineStyle: {
                            width: 5,
                            color: '#FF9752'
                        },
                        data: this.chartData.seedingData || []
                    }
                ]
            }
            this.myChart.setOption(option)
        },
        watch: {
            isChange () {
                let isShowDataZoom = false
                if (this.chartData.landName && this.chartData.landName.length >= 12) {
                    isShowDataZoom = true
                }
                this.myChart.setOption({
                    dataZoom: [
                        {
                            show: isShowDataZoom
                        }
                    ],
                    xAxis: {
                        data: this.chartData.landName,
                    },
                    series: [{
                        data: this.chartData.landData,
                    },
                        {
                            data: this.chartData.seedingData
                        }]
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    #landChart {
        width: 100%;
        height: 28.75rem;
        margin-top: 1rem;
    }
</style>
