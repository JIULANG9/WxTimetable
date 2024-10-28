var colors = require('../../utils/colors.js')
//课表时间
const { TIMES, getTimeSlot } = require('../../utils/course-time')
const util = require('../../utils/util')
const { checkCourseInWeek } = require('../../utils/course')
const { analysisCourseData, getCourseData, getAcceptTerms, checkHomeShowDialogMessage } = require('../api/courseApi.js');
const app = getApp()
Page({
  mixins: [require('../../utils/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    theme: 'green',
    StatusBar: app.globalData.statusBar,
    customBar: app.globalData.customBar,
    zhou: ['一', '二', '三', '四', '五', '六', '日'],
    zhou_num: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周'],
    now_week: 1,
    now_day: [1, 2, 3, 4, 5, 6, 7],
    now_month: 1,
    alllCourseData: [],
    course: [],
    login: false,
    tmpClass: '',
    display_course_time: true,
    display_Courses_OnThe_HomePage: false,
    area: 0,
    course_time: [],
    course_times: util.deepCopyArray(getTimeSlot()),
    startDays: ['周日', '周一'],
    customBar: app.globalData.customBar,
    statusBar: app.globalData.statusBar,
    custom: app.globalData.custom,
    onlyThisWeek: false,
    courseGroup: {},
    showMoreCourse: false,
    myAge: 999,
    daysTolastClass: 9,
    moreCourseList: [],
    internet_course_time: false,
    fileUrl: app.globalData.fileUrl,
    courseFileUrl: '',
    clickScreenTime: 0,
    scrollTop: "",
    courseTerm: null,
    noticeDisplay: true,
    acceptTerms: false,
    courseChange: false,
    describe: "",
    Version: '1.00',
    message_version: '',
    message: '',
    messageUpdata: false,
    showFarewell: false,
    showLeavingMessage: false,
    showHomeDialogMessage: false,
    homeDialogMessageData: {},
    multiArray: [],
    schoolAndclassCode: [],
    firstDate: "2024/08/26",//开学第一天
    lastClassDate: "2024/12/27"//最后一节课时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // _this.isStop()
    //设置默认参数
    if (wx.getStorageSync('Kopacity') == '') {
      wx.setStorageSync('Kopacity', 90)
    }
    if (wx.getStorageSync('Copacity') == '') {
      wx.setStorageSync('Copacity', 12)
    }
    if (wx.getStorageSync('onlyThisWeek') === '') {
      wx.setStorageSync('onlyThisWeek', true)
    }
    // 判断班级是否变化
    var tmpClass = wx.getStorageSync('tmp_class');//临时设置班级

    //每周起始日
    var startDay = wx.getStorageSync('start_day') || 1
    var winHeight = wx.getSystemInfoSync().windowHeight;
    _this.setData({
      list_is_display: false,
      Kopacity: wx.getStorageSync('Kopacity'),
      Copacity: wx.getStorageSync('Copacity'),
      fontSize: wx.getStorageSync('fontSize'),
      winHeight: winHeight,
      onlyThisWeek: wx.getStorageSync('onlyThisWeek'),
      startDay: startDay,
      colorArrays: colors
    })

    _this.getCourseTerm()
    // var week = _this.getNowWeek();
    var week = _this.getCurrentWeek();
    var startDay = wx.getStorageSync('start_day')
    var day = _this.getDayOfWeek(week, startDay)
    // var month = _this.getMonth((week - 1) * 7);
    // var month = _this.getMonth((week - 1) * 7);
    var datess = new Date();
    var month = datess.getMonth() + 1;

    var now_week = week
    let { todayMonth, todayDay, isWeekend } = _this.getTodayDate()
    if (isWeekend) {
      now_week++
    }

    _this.setData({
      now_day: day,
      now_week: now_week,
      nowWeek: week,
      todayMonth,
      todayDay,
      tmpClass: tmpClass,
      now_month: month,
      now_month_number: month / 1, // 当前月份数字类型，用于数字运算
    })

    //距离最后一节课还剩余多少天
    var now = new Date();
    var lastClass = new Date(this.data.lastClassDate);
    this.setData({
      daysTolastClass: this.daysDifference(now, lastClass),
    })
    //课表学期
    _this.getCourseTerm()
    //获取设置，隐藏上课时间
    _this.getConfigData()

    // 判断背景图片是否存在
    _this.bgIsExist()

    //弹出更新消息
    checkHomeShowDialogMessage(function (dialog_message_data) {

      _this.setData({
        showHomeDialogMessage: true,
        homeDialogMessageData: dialog_message_data
      })
    })
  },

  //获取当前周
  getCurrentWeek() {
    //这里设置第一周/第一天的日期
    var baseDate = Date.parse(this.data.firstDate)
    var nowDate = Date.parse(new Date())

    var duringTime = nowDate - baseDate
    var weekTimestamp = 7 * 24 * 60 * 60 * 1000

    var currentWeek = 0
    var week = duringTime / weekTimestamp

    if (Number.parseFloat(week) - Number.parseInt(week) == 0) {
      currentWeek = week + 1
    } else {
      //如果week不是整数，向上取整即可
      currentWeek = Math.ceil(week)
    }
    return currentWeek
  },

  onShow: function () {
    let _this = this
    // 背景
    _this.setData({
      imageUrl: wx.getStorageSync('bg_img')
    })
    // 以 上个周数来获取数据
    var week = _this.data.now_week
    var zhou_num = _this.data.zhou_num

    this.selectWeek(week)
    //获取课表
    _this.getCourse(week, true, false);
    _this.setData({
      showMoreCourse: false,
      list_is_display: false,
      zhou_num
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share('感谢使用WENJIE课表 ~', 'course.png', this.route)
  },
  /**
   * 获取第几周后的月份
   */
  getMonth: function (days) {
    let [year, month, day] = this.getTermDate()
    var date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);//获取n天后的日期      
    var m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    return m;
  },
  /**
 * 获取第几周后的星期几的日期
 */
  getDay: function (days) {
    let [year, month, day] = this.getTermDate()
    var date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);//获取n天后的日期      
    var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();//获取当前几号，不足10补0    
    return d;
  },
  /**
   * 获取当前周
   */
  getNowWeek: function () {
    var date = new Date();
    let [year, month, day] = this.getTermDate()
    var start = new Date(year, month - 1, day);
    //计算时间差
    var left_time = parseInt((date.getTime() - start.getTime()) / 1000);
    //如果从周日算起，需要+1天
    if (this.data.startDay == 0) {
      left_time += 24 * 60 * 60
    }

    var days = parseInt(left_time / 3600 / 24);
    var week = Math.floor(days / 7) + 1;
    var result = week
    if (week > 20 || week <= 0) {
      result = this.data.now_week;
    }
    return result
  },
  /**
   * 获取课表
   */
  getCourse: function (week, first, animation) {

    var that = this;
    if (first === false && week == that.data.now_week) return

    analysisCourseData(function (data) {


      if (data == "") {
        that.setData({
          list_is_display: false,
          updatingCourse: true
        })
      }
      console.log(data)
      //将之前的课表清空
      if (typeof animation != "undefined" && animation) {
        that.toggleDelay()
      }
      let currentWeeksNumber_courseWeekly = [];
      let courses = [], courseGroup = {}

      if (data.length > 0) {
        let index_Num = 0;

        currentWeeksNumber_courseWeekly = data[0]['courseWeekly'];
        let courseWeekData = currentWeeksNumber_courseWeekly['CourseData'];
        for (var index_week = 0; index_week < courseWeekData.length; index_week++) {
          let course_data_array = courseWeekData[index_week];

          let tmp = course_data_array['courseSection'].split("-")

          var jie = tmp[0];
          if (tmp.length == 1) {
            var jieshu = 1
          } else {
            var jieshu = tmp[1] - tmp[0] + 1;
          }

          let key = course_data_array['currentWeek'] + '-' + jie
          if (courseGroup[key]) {
            courseGroup[key].push(index_Num)
          } else {
            courseGroup[key] = [index_Num]
          }
          if (jieshu == 4) {
            key = course_data_array['currentWeek'] + '-' + (Number(jie) + 2)
            if (courseGroup[key]) {
              courseGroup[key].push(index_Num)
            } else {
              courseGroup[key] = [index_Num]
            }
          }
          let display = false, thisWeek = false; //是否是当周课表
          if (checkCourseInWeek(week, course_data_array['courseWeekly'], course_data_array['isDoubleWeek'])) {
            thisWeek = true;
          }
          if (thisWeek || !that.data.onlyThisWeek) {
            display = true
          }
          var course = {
            indexNum: index_Num++,
            week: course_data_array['currentWeek'],
            thisWeek: thisWeek,
            jie: tmp[0],
            jieshu: jieshu,
            time: that.course_time_handle(course_data_array['courseSection']),
            name: course_data_array['courseName'],
            fullName: course_data_array['courseName'],
            address: course_data_array['courseAddress'],
            fullAddress: course_data_array['courseAddress'],
            num: index_week,
            zhoushu: course_data_array['courseWeekly'],
            teacher: course_data_array['teacherName'],
            credit: course_data_array['courseCredit'],
            danshuang: course_data_array['isDoubleWeek'],
            numberOfPeople: course_data_array['numberOfPeople'],
            courseNum: 1,
            display: display,
          };
          courses.push(course)
        }
        //隐藏存在冲突的课程

        for (let g in courseGroup) {
          if (courseGroup[g].length > 1) {
            let hasThisWeek = false
            var index = 0
            for (let index_Num in courseGroup[g]) {
              index = courseGroup[g][index_Num]
              if (hasThisWeek === false && courses[index].thisWeek) {
                courses[index].display = true
                hasThisWeek = index
              } else {
                courses[index].display = false
              }
            }
            if (hasThisWeek === false && !that.data.onlyThisWeek) {
              courses[index].display = true
              hasThisWeek = index
            }
            if (hasThisWeek !== false) {
              courses[hasThisWeek].courseNum = courseGroup[g].length
            }
          }
        }

        //console.log(courses.length)
        that.setData({
          course: courses,
          courseGroup: courseGroup
        })
      }
    });

  },

  selectWeek: function (week) {
    this.getCourse(week, false, true);
    this.getTrain(week);
    var month = this.getMonth((week - 1) * 7);
    this.setData({
      now_week: week,
      now_month: month,
      now_month_number: month / 1, // 当前月份数字类型，用于数字运算
    });
    var startDay = wx.getStorageSync('start_day')
    var day = this.getDayOfWeek(week, startDay)
    this.setData({
      now_day: day,
    })
  },
  /**
   * 选择周数
   */
  select: function (e) {
    var week = parseInt(e.detail.value) + 1;
    this.selectWeek(week)
  },
  /**
   * 显示课表详细内容
   */
  displayCourseInfo: function (e) {
    var indexNum = e.currentTarget.dataset.num;
    var display = e.currentTarget.dataset.display;
    var data = this.data.course[indexNum];
    //如果有多个课程则展开
    if (!display && data.courseNum > 1) {
      //获取同时间的课程
      let ids = [], courses = []
      let key = data.week + '-' + data.jie
      ids = ids.concat(this.data.courseGroup[key])
      if (data.jieshu == 4) {
        key = data.week + '-' + (Number(data.jie) + 2)
        for (let i in this.data.courseGroup[key]) {
          let val = this.data.courseGroup[key][i]
          if (ids.indexOf(val) == -1) {
            ids.push(val)
          }
        }
      }
      for (let i = 0; i < ids.length; i++) {
        let index = ids[i]
        courses.push(this.data.course[index])
      }
      this.setData({
        showMoreCourse: true,
        moreCourseList: courses
      })
      return
    }
    wx.navigateTo({
      url: "info/info?internet_course_time=" + this.data.internet_course_time + "&data=" + encodeURIComponent(JSON.stringify(data)),
    })
    this.setData({
      showMoreCourse: false
    })
  },

  /**
   * 处理课程时间
   */
  course_time_handle: function (section) {

    let section_arry = section.split("-")
    let start_section = section_arry[0]
    let end_section = section_arry[1]
    //start_time_str = "08:10","08.55"    course_times[index][0]
    let start_time = this.data.course_times[start_section - 1][0]
    let end_time = this.data.course_times[end_section - 1][1]
    return start_time + '~' + end_time
  },

  /**
   * 解析周数，将弃用
   */
  ana_week: function (week, weekly, danshuang) {
    var result = new Array();
    var temp1 = weekly.split(",");
    var temp2 = new Array();
    for (var i = 0; i < temp1.length; i++) {
      temp2[i] = temp1[i].split("-");
    }
    var k = 0;//周数
    if (danshuang == 0) {
      for (var a = 0; a < temp1.length; a++) {
        if (temp2[a].length == 2) {
          for (var start = parseInt(temp2[a][0]); start <= temp2[a][1]; start++) {
            result[k++] = start;
          }
        } else {
          result[k++] = parseInt(temp2[a][0]);
        }
      }
    } else {
      for (var a = 0; a < temp1.length; a++) {
        if (temp2[a].length == 2) {
          for (var start = parseInt(temp2[a][0]); start <= temp2[a][1]; start++) {
            if (danshuang == 1) {
              if (start % 2 != 0) {
                result[k++] = start++;
              }
            } else if (danshuang == 2) {
              if (start % 2 == 0) {
                result[k++] = start++;
              }
            }
          }
        } else {
          let weekNum = parseInt(temp2[a][0])
          if ((danshuang == 1 && weekNum % 2 == 1) || (danshuang == 2 && weekNum % 2 == 0)) {
            result[k++] = weekNum;
          }
        }
      }
    }
    for (var j = 0; j < result.length; j++) {
      if (week == result[j]) {
        return true;
      } else if (j == result.length - 1) {
        return false;
      }
    }
    return false
  },
  /**
   * 是否为实训周
   */
  getTrain: function (week) {
    var train = wx.getStorageSync('train');
    var result = new Array();
    var a = 0;
    for (var i = 0; i < train.length; i++) {
      var train_week = train[i]['train_weekly'].split("-");
      if (train_week.length == 2) {
        for (var j = parseInt(train_week[0]); j <= parseInt(train_week[1]); j++) {
          result[a++] = j;
        }
      } else {
        result[a++] = parseInt(train_week[0]);
      }
      //判断
      for (var j = 0; j < result.length; j++) {
        if (week == result[j]) {
          this.setData({
            train_course_id: train[i]['course_id'],
          });
          return;
        } else if (i == train.length - 1 && j == result.length - 1) {
          this.setData({
            train_course_id: 0,
          })
        }
      }
      var result = [];
      a = 0;
    }
  },
  /**
   * 实训周详情
   */
  train: function (e) {
    var id = e.currentTarget.dataset.id;
    var train = wx.getStorageSync('train');
    for (var i = 0; i < train.length; i++) {
      if (id == train[i]['course_id']) {
        var zhoushu = train[i]['train_weekly'];
        var name = train[i]['train_name'];
        var credit = train[i]['train_credit'];
        var train_class = train[i]['train_class'];
        var teacher = train[i]['train_teacher'];
        wx.showModal({
          title: name,
          showCancel: false,
          content: '周数：' + zhoushu + '\n\n老师：' + teacher + '\n\n类型：' + train_class + '\n\n学分：' + credit,
        })
      }
    }

  },

  //是否显示列表
  listDisplay: function () {
    var list = this.data.list_is_display;
    if (list == 0) {
      this.setData({
        list_is_display: true,
      });
    } else if (list == 1) {
      this.setData({
        list_is_display: false,
      })
    }
  },
  //设置透明度
  sliderchange: function (e) {
    var type = e.currentTarget.dataset.type;
    var data = e.detail.value;
    switch (type) {
      case "frime": this.setData({ Kopacity: data }); wx.setStorageSync('Kopacity', data); break;
      case "course": this.setData({ Copacity: data }); wx.setStorageSync('Copacity', data); break;
      case "font": this.setData({ fontSize: data }); wx.setStorageSync('fontSize', data); break;
    };
  },
  //获取当天日期，课表显示高亮
  getTodayDate: function () {
    var date = new Date();

    var month = date.getMonth();
    var day = date.getDate();
    var dayOfWeek = date.getDay(); // 获取当前日期是一周中的哪一天，0 表示周日，6 表示周六

    var isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    return {
      todayMonth: month + 1,
      todayDay: day,
      isWeekend: isWeekend
    };
  },

  closeNotice: function () {
    let now = parseInt(new Date().getTime() / 1000)
    wx.setStorageSync('notice_time_course', now)
    this.setData({
      noticeDisplay: false
    })
  },

  clickNotice: function () {
    noticeClickEvent(this.data.notice)
  },

  hideMask: function () {
    this.setData({
      list_is_display: false
    })
  },

  closeAd: function () {
    var ad = this.data.ad
    ad.display = false
    this.setData({
      ad: ad
    })
    //记录时间，24小时内不再显示广告
    wx.setStorageSync('close_ad_time', (new Date()).getTime())
  },

  toggleDelay() {
    var that = this;
    that.setData({
      toggleDelay: true
    })
    setTimeout(function () {
      that.setData({
        toggleDelay: false
      })
    }, 1000)
  },

  //处理中文标点符号，课程名称过长
  fiterCourseTitle: function (title, jieshu) {
    title = title.replace(/\uff08/, '(')
    title = title.replace(/\uff09/, ')')
    var length = 10
    if (title.length > length && jieshu < 4) {
      return title.substr(0, length) + '...'
    } else {
      return title
    }
  },

  getConfigData: function () {
  },

  //显示上课时间
  displayTime: function () {
    if (this.data.display_course_time == 0) {
      return
    }
    let times = util.deepCopyArray(TIMES)

    //先判断今天是否有课，没课显示默认的
    var week = (new Date()).getDay()
    if (week == 0 || week == 6) {
      this.setData({
        course_time: times[this.data.area - 1]
      })
      return
    }

    this.setData({
      course_time: times[this.data.area - 1]
    })
  },

  //获取一周的日期
  getDayOfWeek: function (week, startDay) {
    var day = []
    if (startDay === "0") {
      for (var i = -1; i < 6; i++) {
        var days = (week - 1) * 7 + i;
        day.push(this.getDay(days))
      }
      this.setData({
        zhou: ['日', '一', '二', '三', '四', '五', '六']
      })
    } else {
      for (var i = 0; i < 7; i++) {
        var days = (week - 1) * 7 + i;
        day.push(this.getDay(days))
      }
      this.setData({
        zhou: ['一', '二', '三', '四', '五', '六', '日']
      })
    }
    return day
  },

  //设置起始日
  setStartDay: function (e) {
    let val = e.detail.value
    this.setData({
      startDay: val
    })
    wx.setStorageSync('start_day', val)
    let week = this.data.now_week
    let day = this.getDayOfWeek(week, val)
    let zhou_num = this.data.zhou_num
    let n = zhou_num[week - 1].search(/(本周)/i);
    if (n == -1) {
      zhou_num[week - 1] = zhou_num[week - 1] + "(本周)";
    }
    let month = this.getMonth((week - 1) * 7);

    this.setData({
      startDay: val,
      now_week: week,
      now_day: day,
      zhou_num: zhou_num,
      list_is_display: 0,
      now_month: month,
      now_month_number: month / 1, // 当前月份数字类型，用于数字运算
    })
    this.getCourse(week, true, false)
  },

  displayOnlyWeek: function () {
    let result = !this.data.onlyThisWeek
    this.setData({
      onlyThisWeek: result
    })
    wx.setStorageSync('onlyThisWeek', result)
    this.getCourse(this.data.now_week, true, false);
  },
  displayClassTime: function () {
    let result = !this.data.display_course_time
    this.setData({
      display_course_time: result
    })
    wx.setStorageSync('displayClassTime', result)
    //更新课表
    this.getCourse(this.data.now_week, true, false);
  },
  displayCoursesOnTheHomePage: function () {
    let result = !this.data.display_Courses_OnThe_HomePage
    this.setData({
      display_Courses_OnThe_HomePage: result
    })
    wx.setStorageSync('displayCoursesOnTheHomePage', result)
  },
  hideMoreCourse: function () {
    this.setData({
      showMoreCourse: false
    })
  },

  /**
   * 页面跳转
   */

  // 设置背景
  setBg: function () {
    const device = wx.getSystemInfoSync()
    wx.navigateTo({
      url: `/pages/course/setBg/setBg?from=index&height=${device.windowHeight}&width=${device.windowWidth}`,
    })
  },

  // 课程管理
  courseList: function () {
    wx.navigateTo({
      url: '/pages/course/list/list',
    })
  },

  // 登录提示
  loginTips: function () {

  },

  // 分享课表
  shareCourse: function () {

    wx.navigateTo({
      url: '/pages/course/share/share?termName=' + this.data.courseTerm.name,
    })
  },

  // 设置时间
  setTime: function () {
    wx.navigateTo({
      url: '/pages/course/setTime/setTime',
    })
  },

  touchStart: function (e) {
    this.setData({
      "touch.x": e.changedTouches[0].clientX,
      "touch.y": e.changedTouches[0].clientY,
    });
  },
  touchEnd: function (e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let time = new Date().getTime()
    if (time - this.data.clickScreenTime < 500) {
      app.msg("不要操作那么快啦！")
      return
    }
    this.switchWeek(x, y)
  },
  switchWeek: function (x, y) {
    var direction = util.getTouchData(x, y, this.data.touch.x, this.data.touch.y)
    var week = this.data.now_week
    if (direction == "") {
      return
    } else if (direction == "left") {
      week++
    } else if (direction == "right") {
      week--
    }
    this.setData({
      scrollTop: 0
    })
    if (week < 1) {
      app.msg("已经是第一周啦！")
      return
    } else if (week > 20) {
      app.msg("已经是最后一周啦！")
      return
    }
    this.setData({
      clickStatus: 'finish',
      finishX: x,
      finishY: y,
      clickScreenTime: (new Date().getTime())
    })
    let _this = this
    setTimeout(function () {
      _this.setData({
        clickStatus: ''
      })
    }, 500)
    this.selectWeek(week)
  },

  getCourseTerm: function () {
    // let nowTerm = courseFn.getNowCourseTerm()
    // let thisTerm = app.getConfig('nowTerm.term')
    let userTerm = wx.getStorageSync('course_stu')
    this.setData({
      courseTerm: {
        "name": "2024 - 2025学年 第1学期",
        "term": "20242",
        "term_date": "2024-08-26"
      },
      thisTerm: "20241",
      userTerm: userTerm
    })
    wx.setStorageSync('courseTerm', this.data.courseTerm)
  },
  //获取当前学期开学时间
  getTermDate: function () {
    let date = this.data.courseTerm ? this.data.courseTerm.term_date : this.data.thisTerm.date
    if (!date) {
      date = '2024-08-26'
    }
    return date.split('-')
  },
  //下载背景
  download: function (url) {
    let _this = this
    let promise = new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function (res) {
          if (res.statusCode === 200) {
            console.log(res.tempFilePath)
            const fs = wx.getFileSystemManager()
            _this.checkMaxSize().then((result) => {
              if (result) {
                fs.saveFile({
                  tempFilePath: res.tempFilePath,
                  success(res) {
                    return resolve(res.savedFilePath)
                  },
                  fail(res) {
                    console.log(res)
                    return reject('保存失败，请联系客服解决')
                  }
                })
              }
            })

          } else {
            return reject('下载失败')
          }
        }
      })
    })
    return promise
  },
  //判断缓存文件是否>10M，预留4m空间
  checkMaxSize: function () {
    let maxSize = (10 - 2) * 1024 * 1024 / 2
    let promise = new Promise((resolve) => {
      wx.getSavedFileList({
        success(res) {
          let files = res.fileList
          let total = 0
          for (let i = 0; i < files.length; i++) {
            total = total + files[i].size
          }
          if (total > maxSize) {
            for (let i = 0; i < files.length; i++) {
              wx.removeSavedFile({
                filePath: files[i].filePath
              })
            }
          }
          return resolve(true)
        }
      })
    })
    return promise
  },
  //是否停用
  isStop: function () {
    let setting = app.getConfig('functions.course')
    this.setData({
      courseConfig: setting
    })
  },
  closeHomeDialogMessage() {
    this.setData({
      showHomeDialogMessage: false
    })
  }
  ,
  //告别
  closeFarewell() {
    wx.setStorageSync('farewell', true)
    this.setData({
      showFarewell: false,
      showLeavingMessage: true
    })
  },

  closeLeavingMessage() {
    this.setData({
      showLeavingMessage: false
    })
  },
  handleContact(e) {
    this.closeLeavingMessage()
  },
  //更新课表
  updateCourseModal() {

    this.setData({
      list_is_display: false,
      updatingCourse: true
    })
  },
  closeUpdateCourseModal() {
    this.setData({
      updatingCourse: false
    })
  },

  closeMessageUpdataModal() {
    wx.setStorageSync('message_version', this.data.message_version)
    this.setData({
      messageUpdata: false
    })
  },
  acceptTerms: function (e) {
    let _this = this
    getAcceptTerms(function (res) {
      const specialityList = res.data
      console.log(specialityList)
      let multiArray = [];
      let multiArrayId = [];
      const names = specialityList.map(item => item.name);
      multiArray.push(names);
      const nameIDs = specialityList.map(item => item.id);
      multiArrayId.push(nameIDs);

      const classNames = specialityList.flatMap(item =>
        item.class.map(cls => cls.className)
      );
      const classNameIDs = specialityList.flatMap(item =>
        item.class.map(cls => cls.id)
      );
      multiArray.push(classNames);
      multiArrayId.push(classNameIDs);

      _this.setData({
        multiArray: multiArray,
        schoolAndclassCode: multiArrayId
      });
    });


    this.setData({
      acceptTerms: true
    })
  },
  //返回两个日期相差的天数
  daysDifference(date1, date2) {
    //这里的date1、date2为日期的字符串
    //将date1,date2转换为Date对象
    var dt1 = date1.getTime();
    var dt2 = date2.getTime();
    return parseInt(Math.abs(dt1 - dt2) / 1000 / 60 / 60 / 24);//这里是计算天数,如果想获得周数则在该返回值上再除以7
  },
  bindSchoolPickerChange(e) {
    console.log(e.detail.value)

    this.setData({
      updatingCourse: false,
      courseChange: false
    })

    let change = e.detail.value
    let schoolCode = this.data.schoolAndclassCode[0][change[0]]
    let classCode = this.data.schoolAndclassCode[1][change[1]]
    console.log(schoolCode)
    console.log(classCode)

    wx.setStorageSync('schoolCode', schoolCode)
    wx.setStorageSync('classCode', classCode)
    let _this = this
    getCourseData(classCode, function (course_data) {
      console.log(course_data);
      wx.setStorageSync('course_data', course_data)
      var week = _this.data.now_week
      _this.getCourse(week, true, false);
    });
  },
  //判断背景图片是否存在
  bgIsExist: function () {
    let _this = this
    let bg_img = wx.getStorageSync('bg_img')
    if (bg_img) {
      let bg_imgs = wx.getStorageSync('bg_imgs')
      const fs = wx.getFileSystemManager()
      fs.access({
        path: bg_img,
        complete: function (res) {
          if (res.errMsg != 'access:ok') {
            //图片被删了，重新下载
            let bg_type = wx.getStorageSync('bg_type')
            let url
            if (!bg_type) {
              app.msg("课表背景图片不存在，请重新设置")
              return
            } else if (bg_type == 'diy') {
              url = _this.data.courseFileUrl + wx.getStorageSync('upload_course_bg')
            } else {
              url = _this.data.fileUrl + '/course_bg/' + bg_type + '.jpg'
            }
            if (!url) {
              return
            }
            _this.download(url).then((url) => {
              if (bg_type != 'diy') {
                bg_imgs[bg_type] = url
                wx.setStorageSync('bg_imgs', bg_imgs)
              }
              wx.setStorageSync('bg_img', url)
              _this.setData({
                imageUrl: url
              })
            }).catch((error) => {
              app.msg('课表背景文件已被删除，请重新设置')
            })
            return
          }
        }
      })
    }
  }
})