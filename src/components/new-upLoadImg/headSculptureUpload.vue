<template>
  <div
    v-loading="loading"
    element-loading-text="正在上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div v-if="imgUrl" class="imgBox">
      <!-- <upLoadImg ref="picUpload" :limit="1" :limitSize="5" :list="avatar"></upLoadImg> -->
      <div>
        <img :src="imgUrl" alt="图片" @error="img" />
      </div>
    </div>
    <div v-show="!imgUrl">
      <div class="cropper-box">
        <div class="cut">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            @real-time="realTime"
            :high="option.high"
            @img-load="imgLoad"
          ></vue-cropper>
        </div>
        <div
          class="show-preview"
          :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}"
        >
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </div>
    </div>
    <div class="test-button">
      <label for="uploads">
        <el-button size="small" type="primary">选择图片</el-button>
      </label>
      <!-- <el-button type="primary">上传</el-button> -->
      <input
        type="file"
        id="uploads"
        style="height: 35px;width: 90px;opacity: 0;position: absolute;cursor: pointer;line-height: 90px;"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event, 1)"
        
      />
      &nbsp;&nbsp;&nbsp;
      <span v-if="!imgUrl">
        <!-- <button @click="rotateLeft" class="btn">左转</button> -->
        <el-button @click="rotateLeft" size="small" type="primary">左转</el-button>
        <el-button @click="rotateRight" size="small" type="primary">右转</el-button>
        <!-- <el-button @click="finish('base64')" size="small" type="primary">预览</el-button> -->
        <el-button @click="down('blob')" size="small" type="primary">完成</el-button>
        <!-- <button @click="rotateRight" class="btn">右转</button> -->
        <!-- <button @click="finish('base64')" class="btn">预览</button> -->
        <!-- <a @click="down('blob')" class="btn">保存</a> -->
      </span>
      <span v-if="basicinfoImgShow" class="resetImg">
        <el-button @click="resetImg" size="small" type="primary">恢复默认</el-button>
      </span>
    </div>
    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt />
      </div>
    </div>
  </div>
</template>
<script>
import upLoadImg from "@/components/uploadImg/multiUploadImg";
import axios from "axios";
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    basicinfoImgShow: {
      type: Boolean,
      default: false
    },
    updateImg:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      loading: false,
      model: false,
      modelSrc: "",
      crap: false,
      previews: {},
      option: {
        img: "",
        size: 1,
        full: false,
        outputType: "png",
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 150,
        centerBox: false,
        high: true
      },
      show: true,
      imgUrl: "",
      uploadUrl: this.api.fileServer.uploadFile,
      isMove: false,
      defaultImgUrl: "http://images.oraro.net/20190724/1563961036054.png"
    };
  },
  methods: {
    // changeImg() {
    //   this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
    // },
    rotateLeft() {
      if (this.option.img) {
        this.$refs.cropper.rotateLeft();
      } else {
        this.$message.error("请选择图片!");
      }
    },
    rotateRight() {
      if (this.option.img) {
        this.$refs.cropper.rotateRight();
      } else {
        this.$message.error("请选择图片!");
      }
    },
    finish(type) {
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true;
          this.modelSrc = data;
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    down(type) {
      if (this.option.img) {
        // event.preventDefault()
        var aLink = document.createElement("a");
        aLink.download = "demo";
        // 输出
        if (type === "blob") {
          this.$refs.cropper.getCropBlob(data => {
            console.log(data);
            this.saveCropperImg(data);
            // this.downImg = window.URL.createObjectURL(data)
            // aLink.href = window.URL.createObjectURL(data)
            // aLink.click()
          });
        }
      } else {
        this.$message.error("请选择图片!");
      }
      //  else {
      //   this.$refs.cropper.getCropData((data) => {
      //     console.log(data);

      //     this.downImg = data
      //     aLink.href = data
      //     aLink.click()
      //   })
      // }
    },
    uploadImg(e, num) {
      //上传图片
      this.$emit("changeImg", true);
      var file = e.target.files[0];
      if (e.target.files.length === 0) return;
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是jpeg,jpg,png中的一种");
        document.getElementById("uploads").value="";
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 4MB!");
        document.getElementById("uploads").value="";
        return;
      }
      this.imgUrl = "";
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    imgLoad(msg) {},
    saveCropperImg(data) {
      // 这个用来把裁剪过后的图片上传到后台
      var forms = new FormData();
      var configs = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      forms.append("file", data);
      const _this = this;
      this.loading = true;
      axios.post(this.uploadUrl, forms, configs).then(res => {
        _this.imgUrl = res.data.data[0];
        if (res.data.code === 200) {
          _this.$emit("success", res.data.data);
          _this.$emit("input", _this.imgUrl);
          this.$emit("changeImg", false);
        }
        this.loading = false;
      });
    },
    resetImg() {
      this.$emit("changeImg", false);
      this.$emit("success", "");
      this.$emit("input", "http://images.oraro.net/20190724/1563961036054.png");
      document.getElementById("uploads").value="";
    },
    img(event) {
      event.target.src = this.defaultImgUrl;
    },
    imgCancle(){
      this.imgUrl=this.updateImg;
      document.getElementById("uploads").value="";
    }
  },
  created() {
    this.imgUrl = this.value;
  },
  activated() {
    this.imgUrl = this.value;
  },
  watch: {
    value() {
      this.imgUrl = this.value;
    }
  }
};
</script>
<style scoped>
/* * {
        margin: 0;
        padding: 0;
      } */
.imgControl {
  opacity: 0.8;
  background: #000;
  display: inline-block;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.imgBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.cropper-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.cut {
  width: 300px;
  height: 300px;
}

.c-item {
  max-width: 800px;
  margin: 10px auto;
  margin-top: 20px;
}

.content {
  margin: auto;
  max-width: 1200px;
  margin-bottom: 100px;
}

.test-button {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
  margin-top: 10px;
}
.test-button label {
  cursor: pointer;
}
.test-button .resetImg {
  flex: 1;
  text-align: right;
}
.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 20px 10px 0px 0px;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #50bfff;
  border-color: #50bfff;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.des {
  line-height: 30px;
}

code.language-html {
  padding: 10px 20px;
  margin: 10px 0px;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-x: auto;
  font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo,
    Lucida, Sans, Type, Writer, Ubuntu, Mono;
  border-radius: 5px;
  white-space: pre;
}

.show-info {
  margin-bottom: 50px;
}

.show-info h2 {
  line-height: 50px;
}

/*.title, .title:hover, .title-focus, .title:visited {
        color: black;
      }*/

.title {
  display: block;
  text-decoration: none;
  text-align: center;
  line-height: 1.5;
  margin: 20px 0px;
  background-image: -webkit-linear-gradient(
    left,
    #3498db,
    #f47920 10%,
    #d71345 20%,
    #f7acbc 30%,
    #ffd400 40%,
    #3498db 50%,
    #f47920 60%,
    #d71345 70%,
    #f7acbc 80%,
    #ffd400 90%,
    #3498db
  );
  color: transparent;
  -webkit-background-clip: text;
  background-size: 200% 100%;
  animation: slide 5s infinite linear;
  font-size: 40px;
}

.test {
  height: 500px;
}

.model {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}

.model-show {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.model img {
  display: block;
  margin: auto;
  max-width: 80%;
  user-select: none;
  background-position: 0px 0px, 10px 10px;
  background-size: 20px 20px;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
}

.c-item {
  display: block;
  user-select: none;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>

