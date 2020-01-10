<template>
  <div>
    <div class="home-titleBox">
      <div class="title-label time-CountDown">
        <span class="time-count-Icon icon1"></span>
        <div class="back_icon1">
          <p class="title-label-des">系统剩余运行时间</p>
          <p class="title-label-con">
            <!-- 99年364天23小时59分59秒 -->
            {{afterTime}}
          </p>
        </div>
        <span class="title-forbidden">
          <el-checkbox v-model="homeData.titleList.systemRunShow">禁用</el-checkbox>
        </span>
      </div>
      <div class="title-label weather">
        <span class="edit" @click="isEditAddressShow = true">编辑</span>
        <span class="time-count-Icon icon2"></span>
        <div class="back_icon2">
          <p class="title-label-des">今日天气</p>
          <p class="title-label-con">{{weatherType}}</p>
        </div>
        <span class="title-forbidden">
          <el-checkbox v-model="homeData.titleList.weatherShow">禁用</el-checkbox>
        </span>
      </div>
      <div class="title-label temperature">
        <span class="time-count-Icon icon3"></span>
        <div class="back_icon3">
          <p class="title-label-des">今日温度</p>
          <p class="title-label-con">{{low}}-{{high}}</p>
        </div>
        <span class="title-forbidden">
          <el-checkbox v-model="homeData.titleList.temperatureShow">禁用</el-checkbox>
        </span>
      </div>
      <div class="title-label homework">
        <span class="time-count-Icon icon4"></span>
        <div class="back_icon4">
          <p>水肥作业</p>
        </div>
        <span class="title-forbidden">
          <el-checkbox v-model="homeData.titleList.homeworkShow">禁用</el-checkbox>
        </span>
      </div>
      <div class="title-label jobSheetWork">
        <span class="time-count-Icon icon4"></span>
        <div class="back_icon4">
          <p>工单作业</p>
        </div>
        <span class="title-forbidden">
          <el-checkbox v-model="homeData.titleList.jobSheetWorkShow">禁用</el-checkbox>
        </span>
      </div>
    </div>
    <br />
    <div class="content-wrapper">
      <p class="home-title">
        <span>{{homeData.chartList.massifChartName}}</span>
        <span class="home-title-edit" @click="chartNameShow('massifChartName')">编辑</span>
        <span class="home-title-forbidden">
          <el-checkbox v-model="homeData.chartList.massifChartShow">禁用</el-checkbox>
        </span>
      </p>
      <land-chart :chartData="massifChart" :isChange="isChange"></land-chart>
    </div>
    <br />

    <div class="chartBox">
      <div class="content-wrapper">
        <p class="home-title">
          <span>{{homeData.chartList.seedlingChartName}}</span>
          <span class="home-title-edit" @click="chartNameShow('seedlingChartName')">编辑</span>
          <span class="home-title-forbidden">
            <el-checkbox v-model="homeData.chartList.seedlingChartShow">禁用</el-checkbox>
          </span>
        </p>
        <seeding-chart :chartData="seedlingChart" :isChange="isChange"></seeding-chart>
      </div>
      <div class="content-wrapper">
        <p class="home-title">
          <span>水肥控制器运行数据</span>
          <span class="home-title-forbidden">
            <el-checkbox v-model="homeData.chartList.controllerChartShow">禁用</el-checkbox>
          </span>
        </p>
        <control-chart :chartData="controllerChart" :isChange="isChange"></control-chart>
      </div>
      <div class="content-wrapper">
        <p class="home-title">
          <span>资产变更数据</span>
          <span class="home-title-forbidden">
            <el-checkbox v-model="homeData.chartList.assetChangeChartShow">禁用</el-checkbox>
          </span>
        </p>
        <assetChange-Chart :chartData="assetChangeChart" :isChange="isChange"></assetChange-Chart>
      </div>
    </div>
    <div class="updata-button">
      <el-button type="primary" @click="save('')">保存修改</el-button>
      <el-button type="primary" @click="resetCkeck">重置</el-button>
    </div>
    <el-dialog
      title="所在城市编辑"
      :visible.sync="isEditAddressShow"
      width="30%"
      :close-on-click-modal="false"
      @closed="resetAddress"
    >
      <div v-if="isEditAddressShow">
        <el-row ref="homeData.titleList.address" class="address">
          <el-col :span="7" class="title">
            <el-col :span="24">省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
            <el-col :span="24">市&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
            <el-col :span="24">区/县</el-col>
          </el-col>
          <el-col :span="17" class="content">
            <v-distpicker
              :province="homeData.titleList.address.province"
              :city="homeData.titleList.address.city"
              :area="homeData.titleList.address.area"
              @selected="addressSelected"
            ></v-distpicker>
          </el-col>
        </el-row>
        <div class="updata-button">
          <el-button type="primary" @click="citySubmit">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title
      :visible.sync="isChartNameShow"
      width="30%"
      :close-on-click-modal="false"
      @closed="resetChartName"
    >
      <div v-if="isChartNameShow">
        <el-form label-width="100px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="图表名称:">
                <el-input v-model="chartName" maxlength="15" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="updata-button">
          <el-button type="primary" @click="chartNameSubmit">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <div id="container"></div>
  </div>
</template>
<script>
import controlChart from "@/components/chart/controlChart";
import landChart from "@/components/chart/landChart";
import seedingChart from "@/components/chart/seedingChart";
import assetChangeChart from "@/components/chart/assetChangeChart";
import axios from "axios";
import $ from "jquery";
import VDistpicker from "v-distpicker";

import { formatAfterTime } from "@/utils";
export default {
  name: "index",
  data() {
    return {
      indexConfigId: "",
      controllerInfo: [], // 控制器数据
      massifInfo: {}, // 地块柱形个折线
      nurseryStock: [], // 苗木饼图
      onlineTime: "", // 开始时间
      isChange: "",
      massifChart: {
        landName: [],
        seedingData: [],
        landData: []
      },
      seedlingChart: {
        legend: [],
        Data: []
      },
      controllerChart: {
        legend: [],
        Data: []
      },
      assetChangeChart: {
        assetChangeName: [],
        seedingData: [],
        controllerData: []
      },
      timer: null,
      timerResh: null,
      afterTime: "",
      weatherType: "",
      high: "",
      low: "",
      homeData: {
        titleList: {
          systemRunShow: false,
          weatherShow: false,
          temperatureShow: false,
          homeworkShow: false,
          jobSheetWorkShow: true,
          address: {
            province: "",
            city: "",
            area: "",
            areaCode: ""
          }
        },
        chartList: {
          massifChartShow: false,
          seedlingChartShow: false,
          controllerChartShow: false,
          assetChangeChartShow: false,
          massifChartName: "香榧基地地块数据",
          seedlingChartName: "香榧基地苗木数据"
        }
      },
      isEditAddressShow: false,
      isChartNameShow: false,
      chartNameType: "",
      chartName: "",
      cache: {
        provinceCache: "",
        cityCache: "",
        areaCache: "",
        areaCodeCache: ""
      },
      localCity: ""
    };
  },
  components: {
    controlChart,
    landChart,
    seedingChart,
    assetChangeChart,
    VDistpicker
  },
  mounted() {},
  created() {
    //获取首页配置信息->获取首页数据->获取天气
    this.getFmpIndexConfig().then(res => {
      this.onlineTime = localStorage.getItem("onlineTime") || 0;
      this.getHomePageDate().then(res => {
        this.getWeather();
        if (this.onlineTime) {
          this.afterTime = formatAfterTime(--this.onlineTime);
        }
        this.timer = setInterval(() => {
          if (this.onlineTime) {
            this.afterTime = formatAfterTime(--this.onlineTime);
          }
        }, 1000);
      });
    });
    this.refesh();
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == "homeManage") {
        this.getHomePageDate();
      }
    }
  },
  methods: {
    async getHomePageDate() {
      const res = await this.http.get(this.api.home.initData, {}, true);
      if (res && res.code == 200) {
        Object.assign(this, res.data); // 默认后台返回的字段和我本地的相同，
        // 处理地块chart的数据
        localStorage.setItem("onlineTime", this.onlineTime);
        const chartData = res.data;
        this.massifChart.landName = chartData.massifInfo.massifNameList;
        this.massifChart.seedingData = chartData.massifInfo.massifAmoutList;
        this.massifChart.landData = chartData.massifInfo.massifAreaList;
        this.massifChart.interval = 500;
        // 处理苗木数据
        this.seedlingChart.legend = chartData.nurseryStock.ageGroup;
        this.seedlingChart.Data = chartData.nurseryStock.treeAgeInfo;
        // 处理控制器数据
        this.controllerChart.legend =
          chartData.controllerInfo.allControllerStatus;
        this.controllerChart.Data = chartData.controllerInfo.controllerInfo;
        //资产变更数据
        this.assetChangeChart.assetChangeName = chartData.changeDataInfo.list2;
        this.assetChangeChart.seedingData =
          chartData.changeDataInfo.list3[1].value;
        this.assetChangeChart.controllerData =
          chartData.changeDataInfo.list3[0].value;
        this.isChange = new Date().toString();
        if (chartData.companyInfo.data.obj.partyAddressEntities[0]) {
          this.localCity =
            chartData.companyInfo.data.obj.partyAddressEntities[0].city;
        }
      }
      return true;
    },
    async getWeather() {
      const _this = this;
      let city = this.homeData.titleList.address.province;
      if (city.substring(city.length - 1, city.length) != "市") {
        if (city.substring(0, 2) == "香港") {
          city = "香港市";
        } else if (city.substring(0, 2) == "澳门") {
          city = "澳门市";
        } else {
          city = this.homeData.titleList.address.city;
        }
      }
      $.ajax({
        // url: "http://www.tianqiapi.com/api/?cityid=101210903&appid=1001&appsecret=5566",
        url: `http://wthrcdn.etouch.cn/weather_mini?city=${city ||
          this.localCity ||
          "南京市"}`,
        type: "get",
        async: true,
        data: {},
        dataType: "json",
        success: function(res) {
          if (res && res.data) {
            const todayWeather = res.data.forecast[0];
            _this.weatherType = todayWeather.type;
            _this.high = todayWeather.high.slice(2, todayWeather.high.length);
            _this.low = todayWeather.low.slice(2, todayWeather.low.length);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.info("error.");
        }
      });
    },
    refesh() {
      const _this = this;
      this.timerResh = setTimeout(() => {
        _this.getHomePageDate();
        _this.refesh();
      }, 30000);
    },
    //所在城市编辑
    async citySubmit() {
      if (this.cache.areaCodeCache) {
        this.homeData.titleList.address.province = this.cache.provinceCache;
        this.homeData.titleList.address.city = this.cache.cityCache;
        this.homeData.titleList.address.area = this.cache.areaCache;
        this.homeData.titleList.address.areaCode = this.cache.areaCodeCache;
        this.save("address");
        this.isEditAddressShow = false;
      } else {
        this.$message({
          type: "warning",
          message: "城市信息选择不完整"
        });
      }
    },
    //所在区域选择内容
    addressSelected(data) {
      this.cache.provinceCache = data.province.value;
      this.cache.cityCache = data.city.value;
      this.cache.areaCache = data.area.value;
      this.cache.areaCodeCache = data.area.code;
    },
    //所在城市内容清空
    resetAddress() {
      // this.homeData.titleList.address.province = "";
      // this.homeData.titleList.address.city = "";
      // this.homeData.titleList.address.area = "";
      // this.homeData.titleList.address.areaCode = "";
    },
    //首页配置信息获取
    async getFmpIndexConfig() {
      const res = await this.http.get(this.api.system.getFmpIndexConfig);
      if (res && res.code === 200) {
        this.indexConfigId = res.indexConfig.id;
        if (res.indexConfig.indexJson) {
          this.homeData = JSON.parse(res.indexConfig.indexJson);
        }
        sessionStorage.setItem('homeData', JSON.stringify(this.homeData));
        this.cache.provinceCache = this.homeData.titleList.address.province;
        this.cache.cityCache = this.homeData.titleList.address.city;
        this.cache.areaCache = this.homeData.titleList.address.area;
        this.cache.areaCodeCache = this.homeData.titleList.address.areaCode;
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    //保存首页配置
    async save(saveType) {
      let indexJson = JSON.parse(sessionStorage.getItem('homeData'))||"";;
      if (saveType == "address") {
        indexJson.titleList.address = this.homeData.titleList.address;
      } else if (saveType == "massifChartName") {
        indexJson.chartList.massifChartName = this.homeData.chartList.massifChartName;
      } else if (saveType == "seedlingChartName") {
        indexJson.chartList.seedlingChartName = this.homeData.chartList.seedlingChartName;
      } else {
        indexJson = this.homeData;
        let titleCheckList = [],
          titleList = this.homeData.titleList,
          trueNum = 0;
        titleCheckList.push(
          titleList.systemRunShow,
          titleList.weatherShow,
          titleList.temperatureShow,
          titleList.homeworkShow,
          titleList.jobSheetWorkShow
        );
        titleCheckList.map(item => {
          if (item == false) {
            trueNum++;
          }
        });
        if (trueNum > 4) {
          this.$message({
            type: "warning",
            message: "首页顶部图标最多显示4个"
          });
          return;
        }
      }
      const params = {
        id: this.indexConfigId,
        indeHtml: "1",
        indexJson: JSON.stringify(indexJson)
      };
      const res = await this.http.postJson(
        this.api.system.editFmpIndexConfig,
        params
      );
      if (res && res.code === 200) {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        sessionStorage.setItem('homeData', JSON.stringify(indexJson));
        if (saveType == "address") {
          this.getWeather();
        }
        if(!saveType){
          this.$router.push('/home');
        }
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    //清除首页配置
    resetCkeck() {
      this.homeData =JSON.parse(sessionStorage.getItem('homeData'))||"";
    },
    //图表名称打开
    chartNameShow(chartNameType) {
      this.chartNameType = chartNameType;
      if (chartNameType == "massifChartName") {
        this.chartName = this.homeData.chartList.massifChartName;
      } else if (chartNameType == "seedlingChartName") {
        this.chartName = this.homeData.chartList.seedlingChartName;
      } else {
        this.chartName = "";
      }
      this.isChartNameShow = true;
    },
    //图表名称确定
    chartNameSubmit() {
       if(this.chartName.length === 0){
           this.$message.error('名称不能为空！')
           return
       }

      if (this.chartNameType == "massifChartName") {
        this.homeData.chartList.massifChartName = this.chartName;
      } else if (this.chartNameType == "seedlingChartName") {
        this.homeData.chartList.seedlingChartName = this.chartName;
      }
      this.save(this.chartNameType);
      this.chartNameType = "";
      this.chartName = "";
      this.isChartNameShow = false;
    },
    //清空图表名称
    resetChartName() {
      this.chartNameType = "";
      this.chartName = "";
      this.isChartNameShow = false;
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.timerResh);
  }
};
</script>
<style scoped lang="scss">
.el-col {
  padding: 0 1.875rem;
  box-sizing: border-box;
  height: 100%;
}
.count-item {
  width: 100%;
  height: 100%;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2.5rem;
  box-sizing: border-box;
  h2 {
    color: #fff;
    letter-spacing: 0.125rem;
  }
  p {
    font-size: 2.25rem;
    color: #fff;
    margin-top: 0.3125rem;
  }
}
.link-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 6.25rem;
  padding-bottom: 2.5rem;
  .link-item {
    width: 11.25rem;
    height: 15.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 1.875rem;
    box-sizing: border-box;
    img {
      width: 5.5rem;
    }
    span {
      margin-top: 1.25rem;
      font-size: 1.125rem;
      color: #666;
    }
  }
  .link-item:hover {
    box-shadow: 0 0 0.625rem 0 #ccc;
    border-radius: 0.625rem;
    transform: scale(1.05);
  }
}
.home-titleBox {
  display: flex;
  width: 100%;
  // border: 1px solid red;
  height: 8.125rem;
  position: relative;
}
.title-label {
  // border: 1px solid green;
  height: 8.125rem;
  // height: 100%;
  box-sizing: border-box;
  border-radius: 0.625rem;
  display: flex;
  position: relative;
  padding: 1.375rem 0.825rem;
  margin-right: 1.25rem;
  p {
  }
  .title-forbidden {
    position: absolute;
    top: 1px;
    right: 10px;
    /deep/ .is-checked {
      .el-checkbox__inner {
        color: #fff;
        background-color: #fff;
      }
      .el-checkbox__inner::after {
        border-color: #094a8b;
      }
    }
    /deep/ .el-checkbox__label {
      color: #fff;
      padding-left: 5px;
    }
  }
}
.time-CountDown {
  width: 33.25rem;
  background: linear-gradient(
    45deg,
    rgba(40, 132, 254, 1) 0%,
    rgba(95, 167, 254, 1) 100%
  );
  span {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
  }
}
.time-count-Icon {
  width: 5.0625rem;
  height: 5rem;
  margin-top: 0.25rem;
}
.icon1 {
  background-image: url("../../../../assets/img/home/time1.png");
}
.title-label-des {
  font-size: 1.5rem;
  font-family: SourceHanSansSC-Medium;
  font-weight: 500;
  color: #f0f2fb;
  line-height: 1.5625rem;
}
.title-label-con {
  font-size: 1.35rem;
  font-family: SourceHanSansSC-Bold;
  font-weight: bold;
  color: white;
  line-height: 2.75rem;
  margin-top: 1.2rem;
}
.time-count-Icon + div {
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: right;
  margin-left: 0.5rem;
  flex: 1;
}
.back_icon1 {
  background-image: url("../../../../assets/img/home/time2.png");
}
.weather {
  position: relative;
  width: 23.75rem;
  height: 8.125rem;
  background: linear-gradient(
    44deg,
    rgba(251, 191, 48, 1) 0%,
    rgba(246, 210, 97, 1) 100%
  );
  span {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
  }
  .edit {
    position: absolute;
    top: 5px;
    left: 10px;
    font-size: 14px;
    color: #0000ff;
    cursor: pointer;
    display: none;
  }
}
.weather:hover {
  .edit {
    display: inline-block;
  }
}
.icon2 {
  background-image: url("../../../../assets/img/home/day1.png");
  width: 5rem;
  height: 5.575rem;
  margin-top: -0.15rem;
}
.back_icon2 {
  background-image: url("../../../../assets/img/home/day2.png");
}
.temperature {
  width: 23.75rem;
  height: 8.125rem;
  background: linear-gradient(
    225deg,
    rgba(129, 253, 255, 1) 0%,
    rgba(15, 176, 228, 1) 100%
  );
  span {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
  }
}
.icon3 {
  background-image: url("../../../../assets/img/home/temper1.png");
  width: 3.125rem;
  height: 4.875rem;
}
.back_icon3 {
  background-image: url("../../../../assets/img/home/temper2.png");
}
.homework {
  width: 23.75rem;
  height: 8.125rem;
  position: relative;

  //  background:linear-gradient(225deg,rgba(189,189,189,1) 0%,rgba(240,242,251,1) 100%);
  background: linear-gradient(
    45deg,
    rgba(94, 74, 244, 1) 0%,
    rgba(89, 127, 255, 1) 100%
  );
  span {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
  }
}
.icon4 {
  background-image: url("../../../../assets/img/home/homework.png");
  width: 4.375rem;
  height: 5rem;
}
.back_icon4 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.375rem;
  font-family: SourceHanSansSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin-left: 3rem !important;
  border-left: 1px solid;
}
.jobSheetWork {
  width: 23.75rem;
  height: 8.125rem;
  position: relative;

  //  background:linear-gradient(225deg,rgba(189,189,189,1) 0%,rgba(240,242,251,1) 100%);
  background: linear-gradient(
    45deg,
    rgba(94, 74, 244, 1) 0%,
    rgba(89, 127, 255, 1) 100%
  );
  span {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
  }
}
.home-title {
  font-size: 1.5rem;
  font-family: SourceHanSansSC-Medium;
  font-weight: 500;
  color: rgba(28, 28, 28, 1);
  .home-title-edit {
    margin-left: 2rem;
    color: #0000ff;
    cursor: pointer;
  }
  .home-title-forbidden {
    float: right;
    /deep/ .el-checkbox__label {
      color: #0000ff;
      padding-left: 5px;
    }
  }
}

.chartBox {
  display: flex;
  flex-flow: row wrap;
  div {
    width: 49.5%;
    margin-bottom: 16px;
  }
  div:nth-child(odd) {
    margin-right: 1%;
  }
}
.updata-button {
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.address {
  /deep/ .el-col {
  }
  .title /deep/ div {
    line-height: 40px;
    margin-bottom: 10px;
    text-align: right;
    padding-right: 0.5rem;
  }
  .content {
    padding: 0;
    /deep/ select {
      display: block;
      width: 70%;
      margin-bottom: 10px;
    }
  }
}
</style>
