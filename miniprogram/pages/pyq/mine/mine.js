// pages/pyq/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,  //状态栏高度
    titleBarHeight:0  //标题栏高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
  // 获取设备信息
  wx.getSystemInfo({
    success: e => {   // { statusBarHeight: 20, ... }，单位为 px
       // 获取右上角胶囊的位置信息
       let info = wx.getMenuButtonBoundingClientRect()  // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
       let CustomBar = info.bottom  - info.top +(info.top-e.statusBarHeight)*2
       me.setData({
        statusBarHeight:e.statusBarHeight,
        titleBarHeight:CustomBar
       })
       console.log(me.data.statusBarHeight)
       console.log(me.data.titleBarHeight)
    }
  })  
  },

 onBack(){
  wx.navigateBack({
    complete: (res) => {},
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