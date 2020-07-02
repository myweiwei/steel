// pages/pyq/pyq.js
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    percent: 100,
    value: 100,
    gradientColor: {
      '0%': '#509ffb',
      '50%': '#40e5ff',
      '100%': '#509ffb'

    },
    teacher_icon:"",
    user_icon:"",
    teacher_name: "",
    user_name: "",
    notice:"消息通知",
    roomID: '',
    template: '1v1',
    debugMode: false,
    cloudenv: 'PRO',
    evnArray: [
      { value: 'PRO', title: 'PRO' },
      { value: 'CCC', title: 'CCC' },
      { value: 'DEV', title: 'DEV' },
      { value: 'UAT', title: 'UAT' },
    ],
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    
  },
  
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(() => {
          this.setData({
            value: this.data.value - 1,
            percent: this.data.percent - 1
          })
          if (this.data.value <= 0) {
            //退出休息室
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  restroom: function (restroomId, userId){
    //连接socket，代表进入房间
    wx.connectSocket({
      url: app.globalData.socketIp + restroomId+'/'+userId,
      method: 'GET',
      success: function(){
        isConnect: true
        console.log("连接成功...")
      },
      fail: function(){
        isConnect: false
        console.log("连接失败...")
      }
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    });
 
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    });
  },
  exitRestroom:function(){
    wx.closeSocket();
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      roomID: options.restroomId
    })
    that.restroom(options.restroomId,options.userId)
    wx.onSocketMessage(function(res){
      var json = JSON.parse(res.data); 
      console.log(json.msg + "--------------------");
      
      if (json.msg == "无房间权限") {
        console.log("-----------------success");
        wx.showToast({
          title:"无房间权限",
          icon: 'none',
          duration: 4000,
          success:function(){
            setTimeout(function () {
              that.onBack()
            },1000);
          }
        })
      }
      if(json.msg == "房间已解散") {
        console.log("-----------------success");
        wx.showToast({
          title: "房间已解散",
          icon: 'none',
          duration: 4000,
          success: function () {
            setTimeout(function () {
              that.onBack()
            }, 1000);
          }
        })
      }
      if(json.msg == "用户进入了房间"){
        console.log("-----------------success");
        that.setData({
          user_icon: json.data.icon,
          user_name: json.data.name
        })
      }
      if(json.msg == "技师进入了房间"){
        console.log("-----------------success22222");
        that.setData({
          teacher_icon: json.data.icon,
          teacher_name:json.data.name

        })
      }
      if(json.msg == "用户离开了房间"){
        console.log("-----------------success22222");
        that.setData({
          user_icon: "",
          user_name: ""
        })
      }
    
      if(json.msg == "技师离开了房间"){
        console.log("-----------------success22222");
        that.setData({
          teacher_icon: "",
          teacher_name:''
        })
      }

      if(json.msg == "都进入了房间，马上开始"){
        that.setData({
          notice: "准备好！马上开始！",
          
        })
        new Promise(resolve => {
          setTimeout(resolve, 5)
        });
        console.log("go..... room");
      }

     
     
    })
  },
  goLiveroom:function(){
    let me=this;
    wx.navigateTo({
      url: '/pages/room/room',
    })
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
    let me = this;
    me.exitRestroom();
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

  },
  enterRoomID: function (event) {
    // console.log('index enterRoomID', event)
    this.setData({
      roomID: event.detail.value,
    })
  },
  selectTemplate: function (event) {
    console.log('index selectTemplate', event)
    this.setData({
      template: event.detail.value,
    })
  },
  switchDebugMode: function (event) {
    console.log('index switchDebugMode', event)
    this.setData({
      debugMode: event.detail.value,
    })
  },
  selectEnv: function (event) {
    console.log('index switchDebugMode', event)
    this.setData({
      cloudenv: event.detail.value,
    })
  },
  enterRoom: function () {
    const roomID = this.data.roomID
    const nowTime = new Date()
    if (nowTime - this.tapTime < 1000) {
      return
    }
    if (!roomID) {
      wx.showToast({
        title: '请输入房间号',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (/^\d*$/.test(roomID) === false) {
      wx.showToast({
        title: '房间号只能为数字',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (roomID > 4294967295 || roomID < 1) {
      wx.showToast({
        title: '房间号取值范围为 1~4294967295',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    const url = `/pages/room/room?roomID=${roomID}&template=${this.data.template}&debugMode=${this.data.debugMode}&cloudenv=${this.data.cloudenv}`
    this.tapTime = nowTime
    this.checkDeviceAuthorize().then((result) => {
      console.log('授权成功', result)
      wx.navigateTo({ url: url })
    }).catch((error) => {
      console.log('没有授权', error)
    })
  },
  checkDeviceAuthorize: function () {
    this.hasOpenDeviceAuthorizeModal = false
    return new Promise((resolve, reject) => {
      if (!wx.getSetting || !wx.getSetting()) {
        // 微信测试版 获取授权API异常，目前只能即使没授权也可以通过
        resolve()
      }
      wx.getSetting().then((result) => {
        console.log('getSetting', result)
        this.authorizeMic = result.authSetting['scope.record']
        this.authorizeCamera = result.authSetting['scope.camera']
        if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
          // 授权成功
          resolve()
        } else {
          // 没有授权，弹出授权窗口
          // 注意： wx.authorize 只有首次调用会弹框，之后调用只返回结果，如果没有授权需要自行弹框提示处理
          console.log('getSetting 没有授权，弹出授权窗口', result)
          wx.authorize({
            scope: 'scope.record',
          }).then((res) => {
            console.log('authorize mic', res)
            this.authorizeMic = true
            if (this.authorizeCamera) {
              resolve()
            }
          }).catch((error) => {
            console.log('authorize mic error', error)
            this.authorizeMic = false
          })
          wx.authorize({
            scope: 'scope.camera',
          }).then((res) => {
            console.log('authorize camera', res)
            this.authorizeCamera = true
            if (this.authorizeMic) {
              resolve()
            } else {
              this.openConfirm()
              reject(new Error('authorize fail'))
            }
          }).catch((error) => {
            console.log('authorize camera error', error)
            this.authorizeCamera = false
            this.openConfirm()
            reject(new Error('authorize fail'))
          })
        }
      })
    })
  },
  openConfirm: function () {
    if (this.hasOpenDeviceAuthorizeModal) {
      return
    }
    this.hasOpenDeviceAuthorizeModal = true
    return wx.showModal({
      content: '您没有打开麦克风和摄像头的权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        this.hasOpenDeviceAuthorizeModal = false
        console.log(res)
        // 点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { },
          })
        } else {
          console.log('用户点击取消')
        }
      },
    })
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
})