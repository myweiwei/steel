// pages/pyq/pyq.js
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    percent: 50,
    value: 80,
    gradientColor: {
      '0%': '#509ffb',
      '50%': '#40e5ff',
      '100%': '#509ffb',

    },
  },
  leaveRestroom:function(){
    wx.closeSocket();
  },
  goRestroom: function (restroomId, userId){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.goRestroom(options.restroomId,options.userId)
    wx.onSocketMessage(function(res){
      var json = JSON.parse(res.data); 
      if(json.msg == "技师进入了房间"){
        console.log("-----------------success");
        that.setData({
          teacher_icon: json.data.icon
        })
      }
      if(json.msg == "技师离开了房间"){
        console.log("-----------------success22222");
        that.setData({
          teacher_icon: ""
        })
      }
      if(json.msg == "用户进入了房间"){
        console.log("-----------------success");
        that.setData({
          user_icon: json.data.icon
        })
      }
      if(json.msg == "用户离开了房间"){
        console.log("-----------------success22222");
        that.setData({
          user_icon: ""
        })
      }
      if(json.msg == "获取到用户信息"){
        console.log("-----------------success22222");
        that.setData({
          user_icon: json.data.icon
        })
      }
      if(json.msg == "获取到技师信息"){
        console.log("-----------------success22222");
        that.setData({
          teacher_icon: json.data.icon
        })
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

  }
})