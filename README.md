**代码比较乱，加班重构ing...**

# 本项目可直接运行

## 十分简洁的课程表微信小程序

**联系方式**
- 微信:ISSWENJIE
- 邮箱:2021226556@qq.com

> 需自行搭建 小程序后端系统\
> 由于比较小程序简单，本人使用NocoBase部署的后端

**付费服务**
1. 部署后端系统
2. 爬取学校课表数据
3. 上架微信小程序
- ...

**温馨提醒**
1. 本项目仅适用学习交流
2. 本项目不在任何平台出售,如有发现请积极举报
3. 如果帮到你了麻烦您点个**Star**

[bilibili 介绍视频](https://www.bilibili.com/video/BV1wk1MYjEET/?vd_source=7162b01c3ffe40a076ac764cd7c66535)

### 界面截图
![截图](/screenshot/001.png)
![截图](/screenshot/002.png)
![截图](/screenshot/003.png)

### 使用方法

#### 1. 配置接口
接口文件:`pages/api/courseApi.js` 
假数据文件:`pages/api/testData.js` 

#### 2. 设置日期

修改`pages/course/course.js`文件里面的data变量

```js
 data: {
    ...
    firstDate: "2024/08/26",//开学第一天
    lastClassDate: "2024/12/27"//最后一节课时间
  },
```

#### 3. 打开微信小程序开发工具 编译运行即可


