//index.js
const app = getApp()

Page({
  data: {
    latitude:'',
    longitude:'',
    baseUrl:'',
    background: [],
    indicatorDots: false,
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
    val:'',
    curCity:"",
    statusBarHeight:0
  },
  getLocation: function () {
    console.log("getLocation...");
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocationFunc();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocationFunc();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocationFunc();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocationFunc: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("进来了");
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude

        console.log("wei:" + latitude);
        console.log(longitude);
        vm.setData({longitude:res.longitude,latitude:res.latitude});
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  getLocal: function (latitude, longitude){
    let that=this;
    const url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=FTqHSN5H275UH2yIbPnMlE7qHBnb7etT&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`;
    const ak = 'FTqHSN5H275UH2yIbPnMlE7qHBnb7etT';
    //小程序的ajax请求需要在后台安全域名配置增加 开发测试中在详情里勾选-不校验合法域名即可
    if (app.globalData.currCity) {
      this.setData({
        curCity: app.globalData.currCity
      })
    }
    else {
      wx.request({
        url,
        data: {},
        success: function (res) {
          if (res.data.status == "0") {
            console.log(res.data)
            res.data.result.addressComponent.city = res.data.result.addressComponent.city.replace('市', '')
            that.setData({
              curCity: res.data.result.addressComponent.city
            });
            wx.hideLoading()
          } else {
            that.setData({
              curCity: '未知',
            });
            wx.hideLoading()
          }
        }
      })
    }
  },
  toInfo:function(e){
    let me=this;
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/teacherInfo/teacherInfo?id='+id
    })
  },
  chooseAddress:function(e){
    let me=this;
    wx.navigateTo({
      url: '/pages/switchCity/switchCity?curr=' + e.currentTarget.dataset.curr
    })
  },
  onChange:function(val){
    let me=this;
    me.setData({
      val: val.detail
    })
  },
  submit:function(){
    let me=this;
    app.wxRequest('get', '/personal/teacherInfoByUserId/', {}, function (data) {
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
  onLoad: function(option) {
    console.log(app.globalData.currCity);
    if (app.globalData.currCity){
      this.setData({
        curCity:app.globalData.currCity
      })
    }
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
    app.wxRequest('get', '/other/banners', {}, function (data) {
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
    app.wxRequest('get', '/consult/teachers', {}, function (data) {
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
    console.log(app.globalData);
    me.setData({
      statusBarHeight: app.globalData.statusBarHeight
    })
    me.getBanner();
    me.getTeacher();
    console.log("invoke location");
    me.getLocation()
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
      that.getLocation()
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
  },
  goEnterprise:function(){
    var me = this;
    wx.navigateTo({
      url: '/pages/enterprise/enterprise?longtitude=' + me.data.longitude + "&latitude=" + me.data.latitude
    })
  }

})
