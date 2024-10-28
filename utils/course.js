const util = require('./util')


// 判断课程是否在当前周
function checkCourseInWeek(week, courseWeekly, isDoubleWeek) {
  //删除最后末字符
  courseWeekly = courseWeekly.substring(0, courseWeekly.length - 1);
  let weeklys = courseWeekly.split("-")
  let startWeeklys = weeklys[0]
  let endWeeklys = weeklys[1]
  if (isDoubleWeek) {
    if (week % 2 == 1) {
      return false;
    }
  }
  if (week >= startWeeklys && week <= endWeeklys) {
    return true;
  } else {
    return false;
  }
}
function getCouressArray() {
  let course_data = wx.getStorageSync('course_data');
  return course_data['courseWeekly']['CourseData']
}

function deleteCourse(course) {
  let course_data = wx.getStorageSync('add_elective_course_data');
  for (let i = 0; i < course_data.length; i++) {
    // course.courseName
    var courseData = course_data[i]
    var section = course.jie + "-" + (Number(course.jie) + 1)

    if ((course.fullName == courseData.courseName) &&
      (course.address == courseData.courseAddress) &&
      (section == courseData.courseSection)) {
      course_data.splice(i, 1)
      wx.setStorageSync('add_elective_course_data', course_data)
      return true
    }
  }
  return false
}


//判断对象是否相等
function isObjectValueEqual(a, b) {
  console.log(JSON.stringify(a))
  console.log(JSON.stringify(b))
  console.log(JSON.stringify(a) === JSON.stringify(b))
  return JSON.stringify(a) === JSON.stringify(b)
}

//获取当前学期名称
function getNowTerm() {
  let nowTerm = util.getConfig('nowTerm')
  if (nowTerm === false) {
    return null
  }
  return {
    term: nowTerm.term,
    name: term2Name(nowTerm.term),
    term_date: nowTerm.date
  }
}
//根据学期代号获取名称
function term2Name(term) {
  if (!term) return ''
  let year = parseInt(term / 10)
  let num = term % 10
  return `${year} - ${year + 1}学年 第${num + 1}学期`
}

//获取当前课表学期
function getNowCourseTerm() {
  let cache = wx.getStorageSync('course_term')
  if (!cache || !cache.term) {
    let term = this.getNowTerm()
    wx.setStorageSync('course_term', term)
    return term
  }
  return cache
}

//将课表学期切到当前学期
function setCourseToNowTerm() {
  let term = getNowTerm()
  wx.setStorageSync('course_term', term.term)
}

module.exports = {
  getNowTerm: getNowTerm,
  term2Name: term2Name,
  getNowCourseTerm: getNowCourseTerm,
  setCourseToNowTerm: setCourseToNowTerm,
  checkCourseInWeek: checkCourseInWeek,
  getCouressArray: getCouressArray,
  deleteCourse: deleteCourse
}