// const { getAreaInfo, setAreaInfo, setDisplayTime } = require('../../api/user')

const {TIMES,getTimeSlot} = require('../../../utils/course-time')
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areas:['西校区','北校区'],
    timeList: {
      num:['一', '二', '三', '四', '五', '六', '七','八', '九', '十', '十一', '十二'],
      timeSlot : util.deepCopyArray(getTimeSlot())
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getData()
  },

  // getData:function(){
  //   var that = this
  //   wx.showLoading({
  //     title: '正在加载',
  //     mask: true
  //   })
  //   getAreaInfo().then((data) => {
  //     wx.hideLoading()
  //     that.setData({
  //       area:data.data.area,
  //       areas:data.data.areas,
  //       status:data.data.display,
  //     })
  //   }).catch((message) => {
  //     app.msg(message)
  //   })
  // },

  //设置校区
  setArea:function(e){
    var that = this
    var area = Number(e.detail.value) + 1
    setAreaInfo({area})
      .then((data) =>{
        app.msg(data.message,'success')
        that.setData({
          area: area
        })
        wx.setStorageSync('user_area', area)
    }).catch((message) => {
      app.msg(message)
    })
  },

  switchStatus:function(e){
    var that = this
    if(that.data.area == 0){
      app.msg("请先设置校区")
      that.setData({
        status:that.data.status
      })
      return
    }
    var status = e.detail.value ? 1 : 0
    setDisplayTime({status})
      .then((data) => {
        app.msg(data.message,'success')
        that.setData({
          status: status
        })
        wx.setStorageSync('display_course_time', status)
      })
      .catch((message) => {
        app.msg(message)
      })
  }
})