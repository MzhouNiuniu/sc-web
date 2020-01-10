import echarts from 'echarts'

export default {
    data () {
        this.myChart = null
        this.resizeTimer = null
        return {}
    },
    methods: {
        autoResize () {
            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => {
                this.myChart.resize()
            }, 100)
        },
    },
    mounted () {
        // this.myChart = echarts.init(this.$el)
        window.addEventListener('resize', this.autoResize)
    },
    destroyed () {
        window.removeEventListener('resize', this.autoResize)
    },
}
