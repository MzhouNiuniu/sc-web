<template>
    <div>
        <div ref="editor" style="text-align:left" ></div>
    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
      name: 'editor',
        props:{
            showContent:'',
            index:'',
            showDefault:null,
        },

      data () {
        return {
          editorContent: '',
            editor:''
        }
      },
      methods: {
        getContent: function () {
            console.log(this.editorContent)
            console.log(this.showDefault)
        },
      },
        watch:{
            'showContent'(val,oldVal){
                this.editor.txt.html(val)
            },
        },
        mounted() {
            var editor = new E(this.$refs.editor)
            editor.customConfig.onchange = (html) => {
                this.editorContent = html
                this.$emit('editorContent',{showContent:this.editorContent,index:this.index})

            }
            this.editor=editor
            editor.customConfig.uploadFileName = 'file'
            editor.customConfig.debug = true
            editor.customConfig.uploadImgMaxLength = 50
            editor.customConfig.pasteFilterStyle = false
            editor.customConfig.uploadImgHeaders = {
                    'Authorization': 'Bearer ' + window.$getToken()
            }
            editor.customConfig.uploadImgServer = this.api.fileServer.uploadFile;
            editor.customConfig.zIndex = 1
            editor.create()
            if(this.showDefault){
                this.editor.$textElem.attr('contenteditable', false)
            }else{
                this.editor.$textElem.attr('contenteditable', true)
            }
            this.editor.txt.html(this.showContent)
        }
    }
</script>

<style scoped>
</style>
