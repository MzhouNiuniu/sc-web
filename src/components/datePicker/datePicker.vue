<template>
    <el-date-picker v-model="date" type="daterange" range-separator="至" size="small" value-format="yyyy-MM-dd" class="datePicker"></el-date-picker>
</template>

<script>
    export default {
        name: "date-picker",
        data(){
            return{
                date:'',
                dateStart:'',
                dateEnd:'',
            }
        },
        mounted(){
            this.dateFormat()
        },
        watch:{
            date(val){
                if(val == null){
                    this.date = [this.dateStart,this.dateEnd]
                }
                this.$emit('input',val)
            }
        },
        methods:{
            dateFormat: function (){
                let now = new Date();
                let yy = now.getFullYear();      //年
                let mmStart = now.getMonth();
                let mmEnd = now.getMonth() + 1;     //月
                let dd = now.getDate();          //日
                let year = yy + "-";
                if(mmStart < 10) mmStart = "0" + mmStart;
                if(mmEnd < 10) mmEnd = "0" + mmEnd;
                this.dateStart = year + mmStart + "-";
                this.dateEnd = year + mmEnd + "-";
                if(dd < 10) dd = "0" + dd;
                this.dateStart += dd
                this.dateEnd += dd
                this.date = [this.dateStart,this.dateEnd]
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
