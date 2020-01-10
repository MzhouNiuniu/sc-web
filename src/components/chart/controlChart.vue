<template>
    <div id="controlChart">

    </div>
</template>
<script>
    import echarts from 'echarts'
    import chartFrame from './chartFrame'

    var placeHolderStyle = {}
    var color = [['#FF9752', '#FF4501',], ['#8CFD54', '#51FC04'], ['#597FFF', '#442BFE'], ['#F6D261', '#FBBF30'], ['#5FA7FE', '#2884FE']]
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
        watch: {
            isChange () {

                this.chartData.Data.forEach((ele, index) => {
                    ele.itemStyle = {}
                    ele.itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: color[index][0]
                    }, {
                        offset: 1,
                        color: color[index][1]
                    }])
                    //                 {
                    //     type: 'linear',
                    //     x: 0,
                    //     y: 1,
                    //     x2: 0,
                    //     y2: 1,
                    //     colorStops: [{
                    //         offset: 0, color: color[index][0] // 0% 处的颜色
                    //     }, {
                    //         offset: 1, color: color[index][1] // 100% 处的颜色
                    //     }],
                    // }
                })
                this.myChart.setOption({
                    legend: {
                        data: this.chartData.legend
                    },
                    series: [{
                        data: this.chartData.Data
                    }]
                })
            }
        },
        mounted () {
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                color: ['#FF4501', '#51FC04', '#442BFE', '#FBBF30', '#2884FE'],
                legend: {
                    bottom: '10%',
                    left: 'center',
                    data: this.chartData.legend || [],
                    itemGap: 30,

                },
                series: [
                    {
                        name: '控制器数据',
                        type: 'pie',
                        radius: ['20%', '40%'],
                        center: ['50%', '40%'],
                        avoidLabelOverlap: false,
                        label: {
                            emphasis: {
                                show: false
                            },
                            normal: {
                                show: false,
                                formatter: ' {b|  {b}  |  }{per| {c} }  ',
                                backgroundColor: '#eee',
                                borderColor: '#1B7CFE',
                                borderWidth: 1,
                                borderRadius: 4,
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    b: {
                                        fontSize: 16,
                                        lineHeight: 33,
                                        color: '#5B6181'
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#1B7CFE',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                        labelLine: {
                            length: 30,
                            length2: 30,
                            lineStyle: {
                                type: 'dashed',
                                width: 3
                            }
                        },
                        data: this.chartData.Data || [],
                    },
                    {
                        name: 'Line 2',
                        type: 'pie',
                        animation: false,
                        clockWise: false,
                        radius: ['45%', '46%'],
                        center: ['50%', '40%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                shadowBlur: 40,
                                shadowColor: '#F3F7FF',
                                color: '#F3F7FF'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        data: [{
                            value: 100,
                            name: '02',
                            itemStyle: {
                                emphasis: {
                                    color: '#F3F7FF'
                                }
                            }
                        }, {
                            value: 0,
                            name: 'invisible',
                            itemStyle: {
                                normal: {
                                    color: '#F3F7FF',//未完成的圆环的颜色
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    color: '#F3F7FF'//未完成的圆环的颜色
                                }
                            }
                        }
                        ]
                    },
                    {
                        name: 'Line 2',
                        type: 'pie',
                        animation: false,
                        clockWise: false,
                        radius: ['15%', '16%'],
                        center: ['50%', '40%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                shadowBlur: 40,
                                shadowColor: '#F3F7FF',
                                color: '#F3F7FF'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        data: [{
                            value: 100,
                            name: '02',
                            itemStyle: {
                                emphasis: {
                                    color: '#F3F7FF'
                                }
                            }
                        }, {
                            value: 0,
                            name: 'invisible',
                            itemStyle: {
                                normal: {
                                    color: '#F3F7FF',//未完成的圆环的颜色
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    color: '#F3F7FF'//未完成的圆环的颜色
                                }
                            }
                        }
                        ]
                    }
                ]
            }
            this.myChart = echarts.init(document.getElementById('controlChart'))
            this.myChart.setOption(option)
        }
    }
</script>
<style lang="scss" scoped>
    #controlChart {
        width: 100%;
        height: 25.25rem;
        margin-top: 1rem;
    }
</style>
