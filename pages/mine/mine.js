// pages/mine/mine.js

Page({
  mixins: [require('../../utils/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    theme: '',
    theme_list_show: false,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    theme_list: [
      {
        color: 'light',
        colorName: '白色',
        colorCode: ''
      },
      {
        color: 'dark',
        colorName: '黑色',
        colorCode: ''
      },
      {
        color: 'green',
        colorName: '绿色',
        colorCode: ''
      },
      {
        color: 'pink',
        colorName: '粉色',
        colorCode: ''
      },
      {
        color: 'blue',
        colorName: '蓝色',
        colorCode: ''
      }
    ],

  },
  changeTheme: function () {
    console.log(this.data);
    getApp().themeChanged(this.data.theme === 'light' ? 'dark' : 'light');
  },

  showThemeList: function () {
    this.setData({
      theme_list_show: true,
    })
  },
  hideThemeList: function () {
    this.setData({
      theme_list_show: false,
    })
  },
  SelecThemeColor: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index

    let color = this.data.theme_list[index].color
    console.log(color)

    getApp().themeChanged(color);
    wx.setStorageSync('themeColor', color)
    this.setData({
      theme_list_show: false,
    })
  },

  deleteAllData: function () {
    wx.showModal({
      title: '温馨提示',
      content: '真的要清除缓存吗？',
      success: function (res) {
        wx.clearStorageSync();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let userInfoData = wx.getStorageSync('userInfo')
    if (userInfoData) {
      this.setData({
        userInfo: userInfoData
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})