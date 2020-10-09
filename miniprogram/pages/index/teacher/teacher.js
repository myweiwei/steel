// pages/index/teacher/teacher.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherList:[],
    goodAt:''
  },
  onChange:function(val){
    let me=this;
    me.setData({
      goodAt:val.detail
    })
  },
  onClick:function(){
    let me=this;
    me.getTeacher();
  },
  getTeacher: function () {
    let me = this;
    app.wxRequest('get', '/ea-service-consult/consult/teachers', { goodAt: me.data.goodAt}, function (data) {
      if (data.statusCode == 200) {
        console.log(data);
        me.setData({
          teacherList: data.data.data
        })
      }
      else {
      }
    })
  },
  toZx: function (e) {
    let me = this;
    app.wxRequest('get', '/consult/createRestroom/' + e.currentTarget.dataset.id, {}, function (data) {
      if (data.data.status != 200) {
        wx.showToast({
          title: data.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
      else {
        wx.navigateTo({
          url: '/pages/consult/restroom/restroom?userId=' + data.data.data.userId + '&restroomId=' + data.data.data.restroomId
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if (app.globalData.token == '') {
      app.getUser(that.getTeacher);
    }
    else {
      that.getTeacher()
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