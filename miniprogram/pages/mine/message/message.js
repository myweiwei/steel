// pages/mine/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followCount:0,
    supportCount:0,
    commentCount:0
  },
  toInfo:function(e){
    let me = this;
    let targetUrl = e.currentTarget.dataset.to == 'fan' ? '/message/setFollowAlreadyRead' : e.currentTarget.dataset.to == 'comment' ? '/message/setCommentAlreadyRead' :'/message/setSupportAlreadyRead';
    let arg = e.currentTarget.dataset.to + '/' + e.currentTarget.dataset.to;
    let url = "/pages/mine/message/" + arg;
    app.wxRequest('post', targetUrl, {}, function (res) {
      
      wx.navigateTo({
        url: url,
      })
    })
  },
  getCount: function () {
    let me = this;
    app.wxRequest('get', '/message/unreadCount', {}, function (res) {
      me.setData({
        followCount: res.data.data.followCount,
        supportCount: res.data.data.supportCount,
        commentCount: res.data.data.commentCount
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.followCount != undefined && options.supportCount != undefined && options.commentCount != undefined){
      this.setData({
        followCount: options.followCount,
        supportCount: options.supportCount,
        commentCount: options.commentCount
      })
    }
    else {
      var that = this;
      that.setData({
        baseUrl: app.globalData.baseUrl
      })
      if (app.globalData.token != '') {
        that.getCount();
      }
      else {
        app.getUser(that.getCount);
      }
    }
    
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
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if (app.globalData.token != '') {
      that.getCount();
    }
    else {
      app.getUser(that.getCount);
    }
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