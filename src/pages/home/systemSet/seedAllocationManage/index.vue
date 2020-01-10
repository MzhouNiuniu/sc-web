<template>
  <div>
    <el-form label-width="140px">
      <p class="wrapper-title">
        <span>苗木管理配置</span>
      </p>
      <div class="content-wrapper">
        <el-row>
          <el-col :span="8">
            <el-form-item label="苗木编号：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="苗木名称：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基地名称：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="地块名称：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="株龄：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="坐标：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="责任人：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="添加时间：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="栽种时间：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="位置：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="权益人：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="el-check-box">
            <el-checkbox v-model="nurseryConfig.equityPersonShow">隐藏</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-form-item label="林权证号：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="el-check-box">
            <el-checkbox v-model="nurseryConfig.forestOwnershipCertifiShow">隐藏</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="守护人：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="el-check-box">
            <el-checkbox v-model="nurseryConfig.keeperShow">隐藏</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-form-item label="守护时间：">
              <el-input readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="el-check-box">
            <el-checkbox v-model="nurseryConfig.keepTimeShow">隐藏</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <br />
      <p class="wrapper-title">
        <span>详细信息</span>
      </p>
      <div class="content-wrapper">
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片：">
              <Multiple-upload-imgs :authenStatus="authenStatus"></Multiple-upload-imgs>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="传记：">
              <el-checkbox v-model="nurseryConfig.biographyShow">隐藏</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label>
              <el-input type="textarea" readonly="readonly" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="updata-button">
      <el-button type="primary" @click="save">保存修改</el-button>
      <el-button type="primary" @click="resetCheck">重置</el-button>
    </div>
  </div>
</template>
<script>
import MultipleUploadImgs from "@/components/new-upLoadImg/MultipleUploadImgs";
import { showConvert } from "@/utils";
export default {
  components: { MultipleUploadImgs },
  name: "seedAllocationManage",
  data() {
    return {
      nurseryConfig: {
        id: "",
        equityPersonShow: false,
        forestOwnershipCertifiShow: false,
        keeperShow: false,
        keepTimeShow: false,
        biographyShow: false
      },
      authenStatus: true
    };
  },
  methods: {
    //获取苗木配置
    async getNurseryConfigByOrganizationId() {
      const res = await this.http.get(
        this.api.system.getNurseryConfigByOrganizationId
      );
      if (res && res.code === 200) {
        let data=res.nurseryConfig;
        this.nurseryConfig.id = data.id;
        this.nurseryConfig.equityPersonShow = showConvert(
          data.equityPersonShow
        );
        this.nurseryConfig.forestOwnershipCertifiShow = showConvert(
          data.forestOwnershipCertifiShow
        );
        this.nurseryConfig.keeperShow = showConvert(
          data.keeperShow
        );
        this.nurseryConfig.keepTimeShow = showConvert(
          data.keepTimeShow
        );
        this.nurseryConfig.biographyShow = showConvert(
          data.biographyShow
        );
        sessionStorage.setItem('nurseryConfig', JSON.stringify(this.nurseryConfig));
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    //苗木配置信息保存
    async save() {
      const params = {
        id: this.nurseryConfig.id,
        equityPersonShow: showConvert(this.nurseryConfig.equityPersonShow),
        forestOwnershipCertifiShow: showConvert(this.nurseryConfig.forestOwnershipCertifiShow),
        keeperShow: showConvert(this.nurseryConfig.keeperShow),
        keepTimeShow: showConvert(this.nurseryConfig.keepTimeShow),
        biographyShow: showConvert(this.nurseryConfig.biographyShow)
      };
      const res = await this.http.postJson(this.api.system.editNurseryConfig,params);
      if (res && res.code === 200) {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        sessionStorage.setItem('nurseryConfig', JSON.stringify(this.nurseryConfig));
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    //苗木管理重置功能
    resetCheck() {
      this.nurseryConfig =JSON.parse(sessionStorage.getItem('nurseryConfig'))||"";
    }
  },
  created() {
    this.getNurseryConfigByOrganizationId();
  }
};
</script>
<style lang="scss" scoped>
.updata-button {
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.content-wrapper {
  position: relative;
}
.el-check-box {
  line-height: 40px;
  padding-left: 10px;
}
</style>
