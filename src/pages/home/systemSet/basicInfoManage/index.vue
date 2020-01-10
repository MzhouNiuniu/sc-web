<template>
  <div>
    <p class="wrapper-title">
      <span>基础信息管理</span>
    </p>
    <div class="content-wrapper">
      <div class="basic-info">
        <div class="basic-info-left">
          <el-form :model="ruleForm" ref="ruleForm" label-width="180px" :rules="rules">
            <el-form-item label="公司简称：" prop="abbrname">
              <el-input placeholder="请输入公司简称" v-model="ruleForm.abbrname" maxlength="12"></el-input>
            </el-form-item>
              <el-form-item label="生产许可证号：" prop="abbrname">
                  <el-input placeholder="请输入公司简称" v-model="ruleForm.licenseNumber" maxlength="12"></el-input>
              </el-form-item>
              <el-form-item label="公司统一社会信用代码：" prop="abbrname">
                  <el-input placeholder="请输入公司简称" v-model="ruleForm.socialCreditCode" maxlength="12"></el-input>
              </el-form-item>
              <el-form-item label="营业执照：" prop="abbrname">
                  <Multiple-upload-imgs :fileLimit="1" v-model="ruleForm.businessLicense"/>
                    <span class="labels">最多上传5张图片，每张不超过5M</span>
              </el-form-item>
            <el-form-item label="定位信息：" prop="position">
              <el-input v-model="ruleForm.coordinate" placeholder="请输入内容" disabled>
                <el-button
                  slot="append"
                  @click="showLocalDialog = true"
                  icon="el-icon-location-outline"
                ></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="公司地址：" prop="coordinate">
              <el-input v-model="ruleForm.position" placeholder="请输入内容" maxlength="50"></el-input>
            </el-form-item>
              <el-form-item label="公司介绍：" prop="orgDesc">
                  <el-input placeholder="请输入公司介绍"  type="textarea" v-model="ruleForm.orgDesc" ></el-input>
              </el-form-item>
              <el-form-item label="公司图片：" prop="picture">
                  <Multiple-upload-imgs :fileLimit="1" v-model="ruleForm.picture"/>
                  <span class="labels">最多上传5张图片，每张不超过5M</span>
              </el-form-item>
          </el-form>
        </div>
        <div class="basic-info-right">
          <!-- <headSculptureUpload v-model="picture" @changeImg="listenChange"></headSculptureUpload> -->
          <img :src="ruleForm.log" alt="loading.gif" />
          <span @click="isPictureShow=true" v-allow="'basicInfor-manage-update'">修改</span>
        </div>
      </div>
      <div class="updata-button">
        <el-button type="primary" v-allow="'basicInfor-manage-update'" @click="save">保存</el-button>
      </div>
    </div>
    <el-dialog
      title="设置位置"
      :visible.sync="showLocalDialog"
      width="70%"
      :close-on-click-modal="false"
      v-if="showLocalDialog"
    >
      <locat-map
        @closeAndSave="saveAddress"
        :coordinate="ruleForm.coordinate"
        :CoordinateType="CoordinateType"
        :areaFlag="areaFlag"
      ></locat-map>
    </el-dialog>
    <el-dialog
      title="修改logo"
      :visible.sync="isPictureShow"
      width="630px"
      :close-on-click-modal="false"
    >
      <div v-if="isPictureShow" class="pictureUpload">
        <headSculptureUpload v-model="ruleForm.log" @changeImg="listenChange" :basicinfoImgShow='true'></headSculptureUpload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MultipleUploadImgs from "@/components/new-upLoadImg/MultipleUploadImgs";
import locatMap from "@/components/service/LocatMap";
import headSculptureUpload from "@/components/new-upLoadImg/headSculptureUpload";

export default {
  components: {
    MultipleUploadImgs,
    locatMap,
    headSculptureUpload
  },
  name: "basicInfoManage",
  data() {
    return {
      showLocalDialog: false,
      CoordinateType: { controller: false, massif: true, nursery: false },
      areaFlag: true,
        rules:{
            picture: [{
                required: true, validator: (rules, value, callback) => {
                    if (!Array.isArray(value) || value.length === 0) {
                        callback(new Error('请上传图片！'))
                    } else {
                        callback()
                    }
                }, trigger: 'change'
            }],
            orgDesc:{
                required:true
            }
        },
      ruleForm: {
        abbrname: "",
        position: "",
        coordinate: "",
        log: "",
          licenseNumber:'',
          socialCreditCode:'',
          businessLicense:'',
          orgDesc:'',
        partyAddressEntities: [
          {
            addrType: 2,
            isDefault: 0,
            province: "",
            city: "",
            counties: ""
          }
        ]
      },
        pictures:[],

      isPictureShow: false,
      picture: "http://images.oraro.net/20190724/1563961036054.png",
      prePicture: "http://images.oraro.net/20190724/1563961036054.png"
    };
  },
  created() {
    this.companyInfo();
  },
  methods: {
    saveAddress({ address, coordinate, province, city, counties }) {
      this.ruleForm.position = address;
      this.ruleForm.coordinate = coordinate.toString();
      this.ruleForm.partyAddressEntities[0].province = province || "";
      this.ruleForm.partyAddressEntities[0].city = city || "";
      this.ruleForm.partyAddressEntities[0].counties = counties || "";
      this.showLocalDialog = false;
    },
    async companyInfo() {
      const res = await this.http.get(this.api.system.companyInfo);
      if (res && res.code === 200) {
          if(res.data.obj.businessLicense){
              this.ruleForm.businessLicense=JSON.parse(res.data.obj.businessLicense)
          }
          if(res.data.obj.picture){
              this.ruleForm.picture=JSON.parse(res.data.obj.picture)
          }
          this.ruleForm.orgDesc = res.data.obj.orgDesc;
          this.ruleForm.licenseNumber = res.data.obj.licenseNumber;
        this.ruleForm.abbrname = res.data.obj.abbrname;
          this.ruleForm.socialCreditCode = res.data.obj.socialCreditCode;
        this.ruleForm.position = res.data.obj.position;
        this.ruleForm.coordinate = res.data.obj.coordinate;
        this.ruleForm.log = res.data.obj.log ? res.data.obj.log : this.picture;
        if (res.data.obj.partyAddressEntities[0]) {
          this.ruleForm.partyAddressEntities =
            res.data.obj.partyAddressEntities;
        }

      }
    },
    async save() {
      const params = JSON.parse(JSON.stringify(this.ruleForm));
        params.businessLicense= JSON.stringify(params.businessLicense)
        params.picture=JSON.stringify(params.picture)
      const res = await this.http.postJson(
        this.api.system.updateCompany,
        params
      );
      if (res && res.code === 200) {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.$store.commit('common/updateAbbrname', this.ruleForm.abbrname||"")
        this.$store.commit('common/updateAbbrImgUrl', this.ruleForm.log||"")
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    listenChange(value) {
      this.isPictureShow = value;
    }
  },
  watch: {
    "ruleForm.log": {
      handler: function() {
        this.isPictureShow = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
    .labels{
        color: #ccc;
    }
.basic-info {
  display: flex;

  .basic-info-left {
    flex-grow: 1;

    .el-input {
      max-width: 500px;
    }
  }

  .basic-info-right {
    width: 200px;
    text-align: center;

    img {
      max-width: 200px;
      max-height: 200px;
      display: block;
    }

    span {
      font-size: 14px;
      line-height: 40px;
      color: #0000ff;
      cursor: pointer;
    }
  }
}

.pictureUpload {
  /deep/ .imgBox {
    img {
      max-width: 200px;
      max-height: 200px;
    }
  }
}

.updata-button {
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
 /deep/ .el-dialog__body{
  padding: 30px 10px;
}
/deep/ .el-textarea__inner{
        width: 500px;
    font-family: '';
    }
</style>
