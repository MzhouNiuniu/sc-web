<template>
    <div style="display:inline-block ">
        <el-button type="text" size="small"
                   @click="toShow" >修改
        </el-button>
    </div>
</template>

<script>

    export default {
        props:['item','url'],
        data() {
            return {
            }
        },
        created(){
        },
        methods: {
            toShow(){
                this.$router.push({path:this.url,query:{id:this.item.id}})
            }
        }
    }
</script>
