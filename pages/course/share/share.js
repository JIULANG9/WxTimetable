const app = getApp()

const { getTermByClassname, getCourseListByStuId } = require('../../api/courseApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: true,
    share: true, //分享页面 or 查看分享页面
    userInfo: '',
    term: 0,
    termIndex: 0,
    terms: [],
    uuid: '',
    term_name: "",
    SharedFieldName: 'SharedCourseData'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title: `点击查看WENJIE课表`,
      path: `/pages/course/course`,
      imageUrl: "/pages/assets/imgs/other/login.png"
    }
  },

  //获取分享人的信息
  getUserInfo: function () {

  },

  //获取学期
  getTerms: function () {
    let _this = this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
  },

  changeTerm: function (e) {
    let index = e.detail.value
    this.setData({
      termIndex: index,
      term: this.data.terms[index].term,
      term_name: this.data.terms[index].name,
    })
  },
})