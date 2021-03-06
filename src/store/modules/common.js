export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    isReLogin: false, // 是否重新登陆提示
    abbrname:localStorage.getItem("abbrname"),
    abbrImgUrl:localStorage.getItem("abbrImgUrl"),
    name:localStorage.getItem("name"),
  },
  mutations: {
    SET_IS_RELOGIN (state, isReLogin) {
      state.isReLogin = isReLogin
    },
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    updateAbbrname (state, abbrname) {
      state.abbrname = abbrname
      localStorage.setItem("abbrname", abbrname)
    },
    updateAbbrImgUrl (state, abbrImgUrl) {
      state.abbrImgUrl = abbrImgUrl
      localStorage.setItem("abbrImgUrl", abbrImgUrl)
    },
    updateName (state, name) {
      state.name = name
      localStorage.setItem("name", name)
    },
  }
}
