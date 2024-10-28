const app = getApp()
const colors = require('../../../utils/colors')
const course = require('../../../utils/course')
const util = require('../../../utils/util')
const { getTermByClassname, getCourseByClassname, getCourseList } = require('../../api/courseApi')
Page({
  mixins: [require('../../../utils/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    theme: '',
    fiter: 0,
    zhou: ['', '一', '二', '三', '四', '五', '六', '日'],
    fiters: ['全部', '必修', '选修', '统考', '非统考', '自定义'],
    counts: [0, 0, 0, 0, 0, 0],
    courses: [],
    displayCourses: [],
    displayCount: 0,
    toggleDelay: false,
    tmpClass: null,
    courseTerm: null,
    terms: [],
    termIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let tmpClass = wx.getStorageSync('tmp_class')
    let courseStu = wx.getStorageSync('course_stu')
    let userId = app.getUserId()
    let courseTerm = course.getNowCourseTerm()
    this.setData({
      tmpClass: tmpClass,
      courseStu: courseStu,
      userId: userId,
      courseTerm: courseTerm
    })
    this.getTerms()
    this.getData()
    // this.getCounts()
    this.setData({
      fiter: 0
    })
  },

  // 获取课程列表
  getData: function () {
    let data = wx.getStorageSync('course_data')
    let courses_object = {}
    let courses = []
    let counts = [0, 0, 0, 0, 0, 0]
    if (data.length > 0) {

      let courseWeekly = data[0]['courseWeekly'];
      let courseWeekData = courseWeekly['CourseData'];
      for (var index_week = 0; index_week < courseWeekData.length; index_week++) {
        let item = courseWeekData[index_week]

        let course_item = {
          'course_teacher': item.teacherName,
          'course_weekly': item.courseWeekly,
          'course_week': this.data.zhou[item.currentWeek],
          'course_section': item.courseSection,
          'course_danshuang': item.isDoubleWeek,
          'course_address': (item.courseAddress),
        }

        if (courses_object[item.courseName]) {

          courses_object[item.courseName].items.push(course_item)
        } else {
          let course = {
            'course_id': item.CourseCode,
            'course_name': item.courseName,
            'course_credit': item.courseCredit,
            'course_hours': "课时",
            'course_category': "类型",
            'course_method': "方法",
            'course_teachMethod': "course_teachMethod",
            'course_type': "course_type",
            'num': index_week,
            'display': true,
            'items': [course_item]
          }
          courses_object[item.courseName] = course
        }
      }
    }
    for (let i in courses_object) {
      courses.push(courses_object[i])
    }
    console.log(courses.length)
    counts[0] = courses.length
    this.setData({
      toggleDelay: (courses.length > 0),
      colors: colors,
      courses: courses,
      displayCourses: courses,
      displayCount: courses.length,
      counts: counts
    })
    this.stopAnimation()
  },

  // 课程筛选
  fiterCourse: function (e) {
    let index = e.currentTarget.dataset.index
    let displayCourses = []
    if (index == this.data.fiter) {
      return
    }
    let courses = this.data.courses
    for (let i = 0; i < courses.length; i++) {
      let display = this.displayCourse(index, courses[i])
      if (display) {
        displayCourses.push(courses[i])
      }
      courses[i].display = display
    }
    this.setData({
      toggleDelay: displayCourses.length > 0,
      fiter: index,
      courses: courses,
      displayCourses: displayCourses,
    })
    this.stopAnimation()
  },

  // 显示课程
  displayCourse: function (index, course) {
    switch (index) {
      case 0: return true; break
      case 1:
        if (course.course_category && course.course_category.indexOf('必修课') != -1) {
          return true;
        }
        return false
      case 2:
        if (course.course_category && course.course_category.indexOf('任选课') != -1) {
          return true;
        }
        return false
      case 3:
        if (course.course_method == '统考') {
          return true
        }
        return false
      case 4:
        if (course.course_method != '统考') {
          return true
        }
        return false
      case 5:
        if (course.course_type == 2) {
          return true
        }
        return false
    }
  },

  // 获取数量
  getCounts: function () {
    let courses = wx.getStorageSync('course')
    let counts = [0, 0, 0, 0, 0, 0]
    let oldName = ''
    for (let i = 0; i < courses.length; i++) {
      let course = courses[i]
      if (course.course_name == oldName || !course.course_weekly) {
        continue
      }
      oldName = course.course_name
      if (course.course_category && course.course_category.indexOf('必修课') != -1) {
        counts[1]++
      }
      if (course.course_category && course.course_category.indexOf('任选课') != -1) {
        counts[2]++
      }
      if (course.course_method == '统考') {
        counts[3]++
      } else {
        counts[4]++
      }
      if (course.course_type == 2) {
        counts[5]++
      }
      counts[0]++
    }
    this.setData({
      counts: counts
    })
  },

  // 添加课程
  addCourse: function (e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: '/pages/course/add/add?id=' + id + '&from=list',
      })
      return
    }
    // let nowTerm = app.getConfig('nowTerm.term')

    // if (this.data.courseTerm.term != nowTerm) {
    //   app.msg("学期都结束了，你还要添加课程？")
    //   return
    // }
    wx.navigateTo({
      url: '/pages/course/add/add?from=list',
    })
  },

  stopAnimation: function () {
    if (this.data.toggleDelay) {
      setTimeout(() => {
        this.setData({
          toggleDelay: false
        })
      }, 1000)
    }
  },

  changeClass: function () {
    wx.navigateTo({
      url: '/pages/setClass/setClass',
    })
  },

  //获取学期
  getTerms: function () {
    let _this = this
    let stu_id = wx.getStorageSync('user_id')
    let classname = _this.data.tmpClass && _this.data.tmpClass.name ? _this.data.tmpClass.name : ''
    if (stu_id == '' && classname == '') {
      let term = course.getNowCourseTerm()
      _this.setData({
        terms: [term]
      })
      return
    }
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    getTermByClassname({
      stu_id: stu_id,
      classname: classname
    }).then((result) => {
      wx.hideLoading()
      let terms = result.data
      let termIndex = 0
      if (_this.data.courseTerm) {
        let termNames = []
        terms.forEach((element, index) => {
          termNames.push(element.name)
          if (element.term == _this.data.courseTerm.term) {
            termIndex = index
          }
        })
        _this.setData({
          terms: result.data,
          termIndex: termIndex
        })
        getGradeList(termNames).then((grades) => {
          grades = Object.values(grades)
          for (let i in terms) {
            terms[i].name += `(${grades[i]})`
          }
          _this.setData({
            terms: terms
          })
        })
      }
    })
  },

  //切换学期
  changeTerm: function (e) {
    let _this = this
    let index = e.detail.value
    let term = _this.data.terms[index]
    let stu_id = app.getUserId()
    let tmp_class = wx.getStorageSync('tmp_class')
    if (stu_id == '' && !tmp_class) {
      return
    }
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    let request = getCourseList({
      term: term.term
    })
    if (!stu_id || tmp_class) {
      request = getCourseByClassname({
        classname: tmp_class.name,
        term: term.term
      })
    }
    request.then((res) => {
      wx.hideLoading()
      wx.setStorageSync('course', res.data.course)
      wx.setStorageSync('course_term', term)
      let courseTerm = course.getNowCourseTerm()
      _this.setData({
        courseTerm: courseTerm
      })
      _this.getData()
      _this.getCounts()
    })
  }
})