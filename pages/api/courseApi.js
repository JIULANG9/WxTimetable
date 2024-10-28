const testData = require('./testData')

const Authorization = ''
const BaseUrl = ""

function getRequestheader() {
  return { // 设置请求头
    'content-type': 'application/json', // 默认值
    'Authorization': Authorization
  }
}

function getCourseData(classCode, callback) {
  // wx.request({
  //   url: BaseUrl + 'app_syllabus:get',
  //   method: 'get', //请求的方式
  //   header: getRequestheader(),
  //   data: { //发送到服务器的数据
  //     pageSize: '20',
  //     filterByTk: classCode,
  //   },
  //   success: (res) => {
  //     const course_data = res.data.data.course
  //     console.log(course_data)
  //     callback(course_data)
  //   }
  // })

  const res = testData.courseDataJson()
  callback(res)
}

function analysisCourseData(callback) {
  var course_data = wx.getStorageSync('course_data');
  let elective_course_tmp = wx.getStorageSync('add_elective_course_data', "")
  if (elective_course_tmp) {
    addElectiveCourse(course_data)
  }
  callback(course_data)

  //判断课表是否有更新
  // wx.request({
  //   url: BaseUrl + 'app_syllabus_config:list',//请求的接口地址，必须基于https协议
  //   method: 'get', //请求的方式
  //   header: getRequestheader(),
  //   data: { //发送到服务器的数据
  //     pageSize: '10',
  //     page: 1,
  //     filter: { "$and": [{ "key": { "$eq": "update_course_data" } }] },
  //   },
  //   success: (res) => {
  //     const config_value = res.data.data[0].value
  //     if (course_data == "") {
  //       wx.setStorageSync('update_course_data', config_value);
  //       return
  //     }

  //     var storage_is_update_course_data = wx.getStorageSync('update_course_data', "0");
  //     if (storage_is_update_course_data != config_value) {

  //       var classCode = wx.getStorageSync('classCode');
  //       getCourseData(classCode, function (callback_new_course_data) {
  //         console.log("课表有更新");
  //         var new_course_data = callback_new_course_data
  //         wx.setStorageSync('course_data', callback_new_course_data);

  //         addElectiveCourse(new_course_data)
  //         wx.setStorageSync('update_course_data', config_value);
  //         callback(new_course_data)
  //       });
  //     }
  //   },
  //   catch(e) {
  //     callback(course_data)
  //   }
  // })
}

function getAcceptTerms(callback) {
  // wx.request({
  //   url: BaseUrl + 'app_syllabus_speciality:list?pageSize=10&appends[]=class&filter={}',//请求的接口地址，必须基于https协议
  //   method: 'get', //请求的方式
  //   header: getRequestheader(),
  //   data: { //发送到服务器的数据
  //     pageSize: '20',
  //     'appends[]': "class",
  //     filter: {},
  //   },
  //   success: (res) => {
  //     console.log(res.data)
  //     callback(res.data)
  //   }
  // })

  const res = { "data": [{ "id": 1, "name": "护理", "class": [{ "id": 1, "specialityID": 1, "className": "二班", "pos": 2, "courseID": 1, }, { "id": 2, "specialityID": 1, "className": "三班", "pos": 3, "courseID": 2, "createdById": 1, "updatedById": 1 }] }], "meta": { "count": 1, "page": 1, "pageSize": 20, "totalPage": 1 } }
  callback(res)
}

function addElectiveCourse(new_course_data) {
  var CourseData = new_course_data[0].courseWeekly.CourseData
  let elective_course = wx.getStorageSync('add_elective_course_data', '')
  if (elective_course) {

    for (let i = 0; i < elective_course.length; i++) {
      const element = elective_course[i];
      CourseData.push(element)
    }
  }
}

function checkHomeShowDialogMessage(callback) {
  const currentVersion = wx.getStorageSync('homepage_dialog_message_version')
  // wx.request({
  //   url: BaseUrl + 'app_syllabus_config:list',//请求的接口地址，必须基于https协议
  //   method: 'get', //请求的方式
  //   header: getRequestheader(),
  //   data: { //发送到服务器的数据
  //     pageSize: '10',
  //     page: 1,
  //     filter: { "$and": [{ "key": { "$eq": "app_homepage_dialog_message" } }] },
  //   },
  //   success: (res) => {
  //     const dialog_message_data = res.data.data[0]
  //     const config_value = dialog_message_data.value
  //     if (currentVersion != config_value) {
  //       wx.setStorageSync('homepage_dialog_message_version', config_value);
  //       callback(dialog_message_data)
  //     }
  //   }
  // })

  let res = { "data": [{ "id": 2, "createdAt": "2024-09-13T14:21:50.785Z", "updatedAt": "2024-10-28T10:02:49.417Z", "key": "app_homepage_dialog_message", "des": "更新通知", "value_json": null, "value": "13", "content": "v1.0.16\n1.提升打开速度\n2.解决调课后，数据不及时更新的问题", "createdById": 1, "updatedById": 1 }], "meta": { "count": 1, "page": 1, "pageSize": 10, "totalPage": 1 } }
  const dialog_message_data = res.data[0]
  const config_value = dialog_message_data.value
  if (currentVersion != config_value) {
    wx.setStorageSync('homepage_dialog_message_version', config_value);
    callback(dialog_message_data)
  }
}


module.exports = {
  getCourseData,
  getAcceptTerms,
  analysisCourseData,
  checkHomeShowDialogMessage,
}