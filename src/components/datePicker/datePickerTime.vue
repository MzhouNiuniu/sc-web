<template>
    <el-date-picker v-model="date" type="daterange" range-separator="至" size="small" start-placeholder="开始日期" end-placeholder="结束日期":picker-options="expireTimeOption" class="datePicker"></el-date-picker>

</template>

<script>
    export default {
        name: "date-picker",
        props:{
            value: {
                default: ''
            }
        },
        data(){
            return{
                date:'',
                dateStart:'',
                dateEnd:'',
                expireTimeOption:{
                    disabledDate(date) {
                        // return date.getTime() <= Date.now()-86400000;
                    }
                }
            }
        },
        mounted(){
            this.dateFormat()
        },
        watch:{
            value(value){
                this.date = value
            },
            date(val){
                if(val == null){
                    this.date = [this.dateStart,this.dateEnd]
                }
                this.$emit('input',val)
            }
        },
        methods:{
            dateFormat: function (){
                // let now = new Date();
                // let yy = now.getFullYear();      //年
                // let mmStart = now.getMonth();
                // let mmEnd = now.getMonth() + 1;     //月
                // let dd = now.getDate();          //日
                // let year = yy + "-";
                // if(mmStart < 10) mmStart = "0" + mmStart;
                // if(mmEnd < 10) mmEnd = "0" + mmEnd;
                // this.dateStart = year + mmStart + "-";
                // this.dateEnd = year + mmEnd + "-";
                // if(dd < 10) dd = "0" + dd;
                // this.dateStart = this.dateStart + dd + ' 00:00:00'
                // this.dateEnd = this.dateEnd + dd + ' 23:59:59'
                // this.date = [this.dateStart,this.dateEnd]
                this.$emit('input',this.date)
            },
        }
    }
</script>

<style scoped>
    .datePicker{
        vertical-align: bottom;
    }
</style>
