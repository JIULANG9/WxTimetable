
const themeListeners = [];
App({
  globalData: {
    theme: 'light',
    userInfo: null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var themeColor = wx.getStorageSync('themeColor') || 'green'
    this.globalData.theme = themeColor;


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.statusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.custom = capsule;
          this.globalData.customBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.customBar = e.statusBarHeight + 50;
        }
      }
    })
  },

  themeChanged(theme) {
    this.globalData.theme = theme;
    themeListeners.forEach((listener) => {
      console.log(theme)
      listener(theme);

      // wx.setNavigationBarColor({
      //   backgroundColor: '#000000',
      //   frontColor: '#ffffff',
      // })
      // wx.setTabBarStyle({
      //   backgroundColor: '#000',
      // })

    });
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener);
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener);
    if (index > -1) {
      themeListeners.splice(index, 1);
    }
  },

  //toast
  msg: function (text, type) {
    var type = typeof type === "undefined" ? '' : type
    var icon = 'none'
    if (type != '') {
      icon = type
    }
    wx.showToast({
      title: text,
      icon: icon,
      duration: 2000
    })
  },
  getUserId: function () {
    let user_id = wx.getStorageSync('user_id')
    // return user_id == '' ? false : user_id
    return "jiulang"
  },
  //获取配置，支持使用“.”
  //key为空，返回全部
  getConfig: function (key) {
    let configs = wx.getStorageSync('configs')
    if (key) {
      let keyArr = key.split('.')
      let result = ""
      if (configs.hasOwnProperty(keyArr[0])) {
        result = configs[keyArr[0]]
      }
      if (keyArr.length == 1) {
        return result
      }
      for (let i = 1; i < keyArr.length; i++) {
        if (result.hasOwnProperty(keyArr[i])) {
          result = result[keyArr[i]]
        } else {
          return false
        }
      }
      return result
    }
    return configs
  },
  setSkin: function (that) {
    wx.getStorage({
      key: 'skin',
      success: function (res) {
        if (res) {
          that.setData({
            skin: res.data
          })
          var fcolor = res.data == 'dark-skin' ? '#ffffff' : '#000000',
            obj = {
              'normal-skin': {
                color: '#000000',
                background: '#f6f6f6'
              },
              'dark-skin': {
                color: '#ffffff',
                background: '#000000'
              },
              'red-skin': {
                color: '#8e5a54',
                background: '#f9e5ee'
              },
              'yellow-skin': {
                color: '#8c6031',
                background: '#f6e1c9'
              },
              'green-skin': {
                color: '#5d6021',
                background: '#e3eabb'
              },
              'cyan-skin': {
                color: '#417036',
                background: '#d1e9cd'
              },
              'blue-skin': {
                color: '#2e6167',
                background: '#bbe4e3'
              }
            },
            item = obj[res.data],
            tcolor = item.color,
            bcolor = item.background;

          wx.setNavigationBarColor({
            frontColor: fcolor,
            backgroundColor: bcolor,
          })

          wx.setTabBarStyle({
            color: tcolor,
            backgroundColor: bcolor,
          })
        }
      }
    })
  }
})