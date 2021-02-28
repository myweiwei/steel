// pages/mine/message/comment/comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if (app.globalData.token != '') {
      that.getList();
    }
    else {
      app.getUser(that.getList);
    }
  },
  getList: function () {
    var that = this;
    app.wxRequest('get', 'comment/commentToMe', {}, function (data) {
      that.setData({ datalist: data.data.data })
    })
  },
  toPycItemInfo:function(e){
    let item = e.currentTarget.dataset.bean;
    console.log(item)
    wx.navigateTo({
      url: '/pages/pyq/pyqItemInfo/pyqItemInfo?dynamicId='+item.dynamicId
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