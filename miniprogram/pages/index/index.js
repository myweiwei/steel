//index.js
const app = getApp()

Page({
  data: {
    baseUrl:'',
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    msgList: [
      { url: "url", title: "恭喜xxx完成任务退回200进入领奖区" },
      { url: "url", title: "恭喜xxx获得XXX奖励" },
      { url: "url", title: "恭喜xxx完成任务退回300进入领奖区" }],
    currentIndex:0,
    teacherList:[],
    val:''
  },
  onChange:function(val){
    let me=this;
    me.setData({
      val: val.detail
    })
  },
  submit:function(){
    let me=this;
    app.wxRequest('get', '/ea-service-personal/personal/teacherInfoByUserId/', {}, function (data) {
      console.log(data.data)
      wx.navigateTo({
        url: '/pages/consult/restroom/restroom?teacherId=' + data.data.data.teacherId + '&restroomId=' + me.data.val+'&userId=' + data.data.data.teacherId
      })
    })
  },
  moreProduct:function(){
    wx.navigateTo({
      url: '/pages/product/product'
    })
  },
  toPyq:function(){
    wx.navigateTo({
      url: '/pages/pyq/pyq'
    })
  },
  toZx:function(e){
    let me = this;
    app.wxRequest('get', '/ea-service-consult/consult/createRestroom/' + e.currentTarget.dataset.id, {}, function (data) {
      if (data.data.status != 200) {
        wx.showToast({
          title: data.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
      else {
        wx.navigateTo({
          url: '/pages/consult/restroom/restroom?userId=' + data.data.data.userId + '&restroomId=' + data.data.data.restroomId + '&teacherId=' + e.currentTarget.dataset.id
        })
      }
    })
  },
  toTeacher:function(){
    wx.navigateTo({
      url: '/pages/index/teacher/teacher'
    })
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getBanner:function(){
    let me = this;
    app.wxRequest('get', '/ea-service-other/other/banners', {}, function (data) {
      if (data.statusCode == 200) {
        me.setData({
          background:data.data.data
        })
      }
      else {
      }
    })
  },
  getTeacher:function(){
    let me = this;
    app.wxRequest('get', '/ea-service-consult/consult/teachers', {}, function (data) {
      if (data.statusCode == 200) {
        me.setData({
          teacherList:data.data.data
        })
      }
      else {
      }
    })
  },
  funcList:function(){
    let me=this;
    me.getBanner();
    me.getTeacher();
  },
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  onShow:function(){
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if (app.globalData.token == '') {
      app.getUser(that.funcList);
    }
    else {
      that.funcList()
    }
    
  },
  getInfo:function(){
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  }

})
