<template>
  <div>
    <el-form ref="seedlingDetail" :rules="rules" :model="seedlingDetail" label-width="140px">
      <p class="wrapper-title">
        <span>苗木信息</span>
      </p>
      <div class="content-wrapper">
        <div class="QRCode" :style="{'backgroundImage': 'url('+seedlingDetail.qrCode1Url + ')' }">
          <span class="saveQRImg" @click="saveQRcode">保存图片</span>
        </div>
        <el-row>
          <el-col :span="10">
            <el-form-item label="苗木编号：">
              <span>{{seedlingDetail.number}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="苗木名称：">
              <span>{{seedlingDetail.nurseryStockName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="基地名称：">
              <span>{{seedlingDetail.baseName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地块名称：">
              <span>{{seedlingDetail.massifName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="株龄：">
              <span>{{seedlingDetail.age}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="坐标：">
              <div>
                <span>{{seedlingDetail.coordinate}}</span> &nbsp;
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="责任人：">
              <span>{{seedlingDetail.responsible}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="添加时间：">
              <span>{{ seedlingDetail.createTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="栽种时间：">
              <span>{{seedlingDetail.plantTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="位置：">
              <span>{{seedlingDetail.position}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" v-if="getFieldIsEnable('equityPerson')">
            <el-form-item label="权益人：">
              <span>{{seedlingDetail.equityPerson}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="getFieldIsEnable('forestOwnershipCertifi')">
            <el-form-item label="林权证号：">
              <span>{{ seedlingDetail.forestOwnershipCertifi}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="getFieldIsEnable('keeper')">
            <el-form-item label="守护人：">
              <span>{{seedlingDetail.keeper}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="getFieldIsEnable('keepTime')">
            <el-form-item label="守护时间：">
              <span>{{ seedlingDetail.keepStartTime?seedlingDetail.keepStartTime+" 至 ":""}}{{seedlingDetail.keepEndTime?seedlingDetail.keepEndTime:""}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <br />
      <p class="wrapper-title">
        <span>变更信息</span>
      </p>
      <div class="content-wrapper">
        <el-row>
          <el-col :span="10">
            <el-form-item label="变更方式：">
              <span>{{ changeInfo.change}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="原基地：">
              <span>{{ changeInfo.oldBase}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="变更前地块：">
              <span>{{ changeInfo.oldMassif}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="变更后地块：">
              <span>{{ changeInfo.nowMassif}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="流失原因：">
              <span>{{ changeInfo.reasons}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="详细：">
              <span>{{ changeInfo.description}}</span>
            </el-form-item>
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
              <img
                :src="item.url"
                width="150px"
                height="150px"
                style="margin-right:10px;"
                v-for="(item, index) in seedlingDetail.picture"
                :key="index"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" v-if="getFieldIsEnable('biography')">
            <el-form-item label="传记：" prop="biography">
              <span>{{ seedlingDetail.biography}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="updata-button">
      <el-button type="info" @click="back">返回</el-button>
      <el-button v-allow="'change-update'"  :disabled="isEdit" type="primary" @click="saveSeedling('seedlingDetail')">保存</el-button>
    </div>
  </div>
</template>
<script>
import MultipleUploadImgs from "@/components/new-upLoadImg/MultipleUploadImgs";
import { singleImgByName } from "@/utils/downImgsZip.js";
import mixinFieldsConfig from '../SeedlingManagement/mixinFieldsConfig'

export default {
  components: {MultipleUploadImgs },
  name: "seeSeedlingModify",
  mixins:[mixinFieldsConfig],
  data() {
    return {
      seedlingDetail: {
        nameKey: "",
        age: "",
        baseName: "",
        massifName: "",
        coordinate: null,
        responsible: "",
        plantTime: "",
        createTime: "",
        picture: [],
        biography: "",
        number: "",
        position: "",
        qrCode1Url:"",
        nurseryStockName:"",
        keepStartTime:"",
        keepEndTime:""
      },
      changeInfo: {},
      seedlingNameOpt: [
        {
          label: "香榧树",
          value: "1"
        },
        {
          label: "苹果树",
          value: "2"
        },
        {
          label: "小麦",
          value: "3"
        }
      ],
      rules: {
        nameKey: [{ required: true, message: "请选择苗木", trigger: "change" }],
        age: [{ required: true, message: "请输入株龄", trigger: "change" }],
        plantTime: [
          { required: true, message: "请输入时间", trigger: "change" }
        ],
        coordinate: [
          { required: true, message: "请输入坐标", trigger: "change" }
        ],
        position: [
          { required: true, message: "请输入位置", trigger: "change" },
          {
            required: true,
            validator: (rules, value, callback) => {
              if (value.length > 50) {
                callback(new Error("最长50个汉字/字母/数字"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        picture: [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!Array.isArray(value) || value.length === 0) {
                callback(new Error("请上传图片！"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        biography: [
          {
            validator: (rules, value, callback) => {
              if (value && value.length > 1000) {
                callback(new Error("最长1000个汉字/字母/数字"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      isDisabled: false,
      changeSeedlingVisible: false,
      showLocalDialog: false,
      coordinate: "",
      address: "",
      seedlingId: "",
      changeNumber: "",
      CoordinateType: { controller: false, massif: false, nursery: true },
      isEdit: false
    };
  },
  methods: {
    saveQRcode() {
      const data = {
        url: this.seedlingDetail.qrCode1Url,
        name: this.seedlingDetail.qrCode1Name
      };
      singleImgByName(data);
    },
    saveAddress({ address, coordinate }) {
      this.seedlingDetail.coordinate = coordinate.toString();
      this.coordinate = coordinate.toString();
      this.seedlingDetail.position = address;
      this.showLocalDialog = false;
    },
    async lookNurseryChange() {
      const res = await this.http.get(this.api.change.lookNurseryChange, {
        id: this.seedlingId
      });
      if (res && res.code === 200) {
        this.seedlingDetail = res.data.lookNurseryStock;
        const pics = JSON.parse(this.seedlingDetail.picture);
        this.seedlingDetail.picture =
          pics &&
          pics.map(ele => {
            return {
              url: ele
            };
          });
        this.coordinate = this.seedlingDetail.coordinate;
        this.changeInfo = res.data.changeInfo;
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    async editNurseryChange(params) {
      const res = await this.http.get(
        this.api.change.editNurseryChange,
        params
      );
      if (res && res.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功！"
        });
        this.$router.go(-1);
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    saveSeedling(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = {
            coordinate: this.seedlingDetail.coordinate,
            number: this.seedlingDetail.number,
            position: this.seedlingDetail.position
          };
          this.editNurseryChange(params);
        } else {
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
    init() {
      this.seedlingId = this.$route.query.id;
      this.changeNumber = this.$route.query.number;
      this.lookNurseryChange();
    }
  },
  created() {
    this.seedlingId = this.$route.query.id;
    this.changeNumber = this.$route.query.number;
    this.lookNurseryChange();
  },
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
.QRCode {
  width: 100px;
  height: 100px;
  position: absolute;
  right: 20px;
  z-index: 10;
  cursor: pointer;
  display: flex;
  flex-direction: column-reverse;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.saveQRImg {
  width: 100px;
  height: 30px;
  display: inline-block;
  text-align: center;
  padding: 5px;
  box-sizing: border-box;
  background: #303133;
  color: white;
  display: none;
}
.QRCode:hover {
  .saveQRImg {
    display: inline-block;
  }
}
</style>
