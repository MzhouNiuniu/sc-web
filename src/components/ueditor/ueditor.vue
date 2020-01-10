<template>
  <div>
    <div id="editor" type="text/plain" :config='config'></div>
  </div>
</template>

<script>
  import '../../../static/ueditor/ueditor.config.js'
  import '../../../static/ueditor/ueditor.all.js'
  import '../../../static/ueditor/lang/zh-cn/zh-cn.js'

  export default {
    name: "UEditor",
    props: {
      id: {
          type: String
      },
        value: {
            default: ''
        },
    },
    data() {
      return {
          config: {
              //可以在此处定义工具栏的内容
              toolbars: [[
                  'fullscreen', 'source', '|', 'undo', 'redo', '|',
                  'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                  'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                  'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                  'directionalityltr', 'directionalityrtl', 'indent', '|',
                  'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                  'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                  'insertimage', 'emotion', 'insertvideo', 'attachment', 'pagebreak', 'template', 'background', '|',
                  'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                  'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                  'print', 'preview', 'searchreplace', 'drafts', 'help'
              ]],
              autoHeightEnabled: false,
              autoFloatEnabled: true,
              initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
              autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
              initialFrameWidth: null,
              initialFrameHeight: 450,
              UEDITOR_HOME_URL: 'static/ueditor/',
              wordCount:false,
              zIndex:1,
              enableAutoSave:false,
              saveInterval: 50000 * 50000
          },
        editor: null,
      }
    },
    mounted() {
      //初始化UE
      this.editor = UE.delEditor("editor");
      this.editor = UE.getEditor('editor',this.config);
      this.Listener()
    },
    methods:{
        Listener:function(){
            this.editor.addListener("contentChange", () => {
                this.$emit('input',this.editor.getContent())
            });
        },
        setUEContent:function(value){
            this.editor.setContent(value)
        },
      getUEContent: function(){
       return this.editor.getContent();
      },
      getContentTxt: function(){
        return this.editor.getContentTxt();
      },
        setDisabled() {
            this.editor.setDisabled('fullscreen');
        },
        // render(){
        //     this.editor.render();
        // },
        destroy(){
            this.editor.destroy();
        }
    }
  }
</script>
<style lang="scss">
     #editor{
        line-height: normal;
    }
</style>
