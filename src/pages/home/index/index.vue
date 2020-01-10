<template>
  <div>
    <div class="home-titleBox">
      <div class="title-label time-CountDown" v-if="homeData.titleList.systemRunShow==false">
        <span class="time-count-Icon icon1"></span>
        <div class="back_icon1">
          <p class="title-label-des">系统剩余运行时间</p>
          <p class="title-label-con">
            <!-- 99年364天23小时59分59秒 -->
            {{afterTime}}
          </p>
        </div>
      </div>
      <div class="title-label weather" v-if="homeData.titleList.weatherShow==false">
        <span class="time-count-Icon icon2"></span>
        <div class="back_icon2">
          <p class="title-label-des">今日天气</p>
          <p class="title-label-con">{{weatherType}}</p>
        </div>
      </div>
      <div class="title-label temperature" v-if="homeData.titleList.temperatureShow==false">
        <span class="time-count-Icon icon3"></span>
        <div class="back_icon3">
          <p class="title-label-des">今日温度</p>
          <p class="title-label-con">{{low}}-{{high}}</p>
        </div>
      </div>
      <div
        class="title-label homework"
        v-if="homeData.titleList.homeworkShow==false"
        @click="$router.push('/home/waterFertilizer/work')"
      >
        <span class="time-count-Icon icon4"></span>
        <div class="back_icon4">
          <p>水肥作业</p>
        </div>
      </div>
      <div
        class="title-label jobSheetWork"
        v-if="homeData.titleList.jobSheetWorkShow==false"
        @click="$router.push('/home/FarmThing/WorkOrder')"
      >
        <span class="time-count-Icon icon4"></span>
        <div class="back_icon4">
          <p>工单作业</p>
        </div>
      </div>
    </div>

    <div class="content-wrapper" v-if="homeData.chartList.massifChartShow==false">
      <div class="massif-title-box">
        <span>{{homeData.chartList.massifChartName}}</span>
        <span>总数量：{{massifInfo.totalAmount}}棵&nbsp;&nbsp;&nbsp;&nbsp;总面积：{{massifInfo.totalArea}}亩</span>
      </div>
      <land-chart :chartData="massifChart" :isChange="isChange"></land-chart>
    </div>
    <br />

    <div class="chartBox">
      <div class="content-wrapper" v-if="homeData.chartList.seedlingChartShow==false">
        <p class="home-title">{{homeData.chartList.seedlingChartName}}</p>
        <seeding-chart :chartData="seedlingChart" :isChange="isChange"></seeding-chart>
      </div>
      <div class="content-wrapper" v-if="homeData.chartList.controllerChartShow==false">
        <p class="home-title">水肥控制器运行数据</p>
        <control-chart :chartData="controllerChart" :isChange="isChange"></control-chart>
      </div>
      <div class="content-wrapper" v-if="homeData.chartList.assetChangeChartShow==false">
        <p class="home-title">资产变更数据</p>
        <assetChange-Chart :chartData="assetChangeChart" :isChange="isChange"></assetChange-Chart>
      </div>
    </div>
  </div>
</template>
<script>
import controlChart from "@/components/chart/controlChart";
import landChart from "@/components/chart/landChart";
import seedingChart from "@/components/chart/seedingChart";
import assetChangeChart from "@/components/chart/assetChangeChart";
import axios from "axios";
import $ from "jquery";

import { formatAfterTime } from "@/utils";
export default {
  name: "index",
  data() {
    return {
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
      localCity: ""
    };
  },
  components: {
    controlChart,
    landChart,
    seedingChart,
    assetChangeChart
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
      if (newVal.name == "homePage") {
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
        this.massifInfo.totalAmount=chartData.massifInfo.totalAmount;
        this.massifInfo.totalArea=chartData.massifInfo.totalArea;
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
    //首页配置信息获取
    async getFmpIndexConfig() {
      const res = await this.http.get(this.api.system.getFmpIndexConfig);
      if (res && res.code === 200) {
        this.indexConfigId = res.indexConfig.id;
        if (res.indexConfig.indexJson) {
          this.homeData = JSON.parse(res.indexConfig.indexJson);
        }
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
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

.content-wrapper {
  margin-top: 0;
  margin-bottom: 5px;
}
.home-titleBox {
  display: flex;
  width: 100%;
  // border: 1px solid red;
  /*height: 8.125rem;*/
  position: relative;
}
.title-label {
  // border: 1px solid green;
  height: 8.125rem;
  // height: 100%;
  box-sizing: border-box;
  border-radius: 0.625rem;
  display: flex;
  padding: 1.375rem 0.825rem;
  margin-right: 1.25rem;
  margin-bottom: 1.6rem; // 大约一个 <br/>
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
  background-image: url("../../../assets/img/home/time1.png");
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
  background-image: url("../../../assets/img/home/time2.png");
}
.weather {
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
}
.icon2 {
  background-image: url("../../../assets/img/home/day1.png");
  width: 5rem;
  height: 5.575rem;
  margin-top: -0.15rem;
}
.back_icon2 {
  background-image: url("../../../assets/img/home/day2.png");
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
  background-image: url("../../../assets/img/home/temper1.png");
  width: 3.125rem;
  height: 4.875rem;
}
.back_icon3 {
  background-image: url("../../../assets/img/home/temper2.png");
}
.homework {
  width: 23.75rem;
  height: 8.125rem;
  position: relative;
  cursor: pointer;
  transition: all 0.5s;

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
.homework:hover,.jobSheetWork:hover {
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -o-transform: scale(1.1);
  box-shadow: 3px 3px 3px 1px #2285dc57;
}
.jobSheetWork {
  width: 23.75rem;
  height: 8.125rem;
  position: relative;
cursor: pointer;
  transition: all 0.5s;
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
  background-image: url("../../../assets/img/home/homework.png");
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

.home-title {
  font-size: 1.5rem;
  font-family: SourceHanSansSC-Medium;
  font-weight: 500;
  color: rgba(28, 28, 28, 1);
}
.massif-title-box {
  @extend .home-title;
  display: flex;
  justify-content: space-between;
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
</style>
