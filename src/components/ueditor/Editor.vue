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
            disabled:{
                type: Boolean,
                default:false,
            },
            showContent:{
                default:"",
            }
        },
      data () {
        return {
          editorContent: '',
        }
      },
        watch:{
            'showContent'(val,oldVal){
                this.editor.txt.html(val)
            }
        },

      methods: {
      },
      mounted() {
          var editor = new E(this.$refs.editor)
          editor.customConfig.onchange = (html) => {
              this.editorContent = html
              console.log(this.disabled)
          }
          editor.customConfig.uploadFileName = 'file'
          editor.customConfig.debug = true
          editor.customConfig.uploadImgMaxLength = 50
          editor.customConfig.pasteFilterStyle = false
          editor.customConfig.uploadImgServer = this.api.fileServer.uploadwang
          editor.customConfig.zIndex = 1
          editor.create()
          this.editor=editor
          console.log(this.showContent)
          if(this.disabled){
              this.editor.$textElem.attr('contenteditable', false)
          }

      }
    }
</script>

<style scoped>
</style>
