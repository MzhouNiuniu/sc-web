<template>
    <div id="assetChangeChart"></div>
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
            this.myChart = echarts.init(document.getElementById('assetChangeChart'))
            let option = {
                color: ['#FF4501'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['控制器', '苗木']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: this.chartData.assetChangeName.reverse() || []
                },
                series: [
                    {
                        name: '控制器',
                        type: 'bar',
                        data: [],
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: '#FF9752'
                                },
                                {
                                    offset: 1,
                                    color: '#FF4501'
                                }
                            ])
                        }
                    },
                    {
                        name: '苗木',
                        type: 'bar',
                        data: [],
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: '#5DA6FE'
                                },
                                {
                                    offset: 1,
                                    color: '#348BFE'
                                }
                            ])
                        }
                    }
                ]
            }
            this.myChart.setOption(option)
        },
        watch: {
            isChange () {
                this.myChart.setOption({
                    yAxis: {
                        type: 'category',
                        data: this.chartData.assetChangeName || []
                    },
                    series: [
                        {
                            data: this.chartData.controllerData || []
                        },
                        {
                            data: this.chartData.seedingData || []
                        }
                    ]
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    #assetChangeChart {
        width: 100%;
        height: 28.75rem;
        margin-top: 1rem;
    }
</style>
