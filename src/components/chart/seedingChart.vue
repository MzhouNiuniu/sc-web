<template>
    <div id="seedingChart">

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
            let option = {
                color: ['#FF4501', '#FF9752', '#56FF03', '#ADFA86', '#1B7CFE', '#597FFF', '#411FFD', '#9D2EFC'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    bottom: 0,
                    left: 'center',
                    itemGap: 30,
                    data: this.chartData.legend || []
                },
                series: [
                    {
                        name: '苗木数据',
                        type: 'pie',
                        radius: '40%',
                        center: ['50%', '40%'],
                        selectedMode: 'single',
                        data: this.chartData.Data,
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
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
            this.myChart = echarts.init(document.getElementById('seedingChart'))
            this.myChart.setOption(option)
        },
        watch: {
            isChange () {
                this.myChart.setOption({
                    legend: {
                        data: this.chartData.legend
                    },
                    series: [{
                        data: this.chartData.Data
                    }]
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    #seedingChart {
        width: 100%;
        height: 25.25rem;
        margin-top: 1rem;
    }
</style>
