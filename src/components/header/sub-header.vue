<template>
  <div class="header-wrapper">
    <div class="logo-wrapper" style="text-align: center">
      <!--<img :src="abbrImgUrl" class="abbrImg" @error="handleThumbError" />-->
      <span class="abbrname">书辰后台管理系统</span>
    </div>
    <div class="user-wrapper">
      <div class="user">
        <!--<img :src="imgUrl" class="thum" @error="handleThumbError" />-->
        <span>您好：{{userName}}</span>
        <span class="vertical">|</span>
        <span @click="quit" class="exit">退出登录</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "admins",
      defaultImgUrl: "http://images.oraro.net/20190724/1563961036054.png"
    };
  },
  mounted() {
      this.userName=JSON.parse(this.$cookies.get('userInfo')).userName
    // this.userName = this.$cookies.get("userName");
  },
  methods: {
    quit: function() {
        this.$cookies.remove('userInfo')
        this.$router.push('/login')
    },

    // 容错
    handleThumbError(event) {
      event.target.src = this.defaultImgUrl;
    }
  },
  computed: {
    // imgUrl() {
    //   return this.$store.state.user.info.image || Date.now() + "none.png";
    // },
    // abbrImgUrl(){
    //     return this.$store.state.common.abbrImgUrl || Date.now() + "none.png";
    // },
    // abbrname(){
    //     return this.$store.state.common.abbrname || this.$store.state.common.name || "";
    // }

  }
};
</script>

<style scoped>
.header-wrapper {
  display: flex;
  height: 70px;
}

.logo-wrapper {
  display: flex;
  width: 220px;
  height: 70px;
  background: #1776c9;
  text-align: center;
  line-height: 70px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
    text-align: center;
    justify-content: center;
}
.logo-wrapper .abbrImg{
  border-radius: 5px;
  width: 34px;
  height: 34px;
  margin:18px 5px 0 5px;
  vertical-align: middle;
}
.logo-wrapper .abbrname {
  width: 160px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.logo {
  display: block;
  width: 70%;
  margin: 15px auto;
}

.user-wrapper {
  flex: 1;
  background: #2285dc;
}

.user {
  float: right;
  color: #fff;
  font-size: 14px;
  padding: 18px 20px;
}

.user .thum {
  display: inline;
  border-radius: 5px;
  width: 34px;
  height: 34px;
  vertical-align: middle;
}

.user span {
  vertical-align: middle;
}

.user .vertical {
  margin: 0px 15px;
}

.exit {
  cursor: pointer;
}
</style>
