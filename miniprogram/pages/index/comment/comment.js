// pages/index/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon:'',
    time:'',
    price:"",
    isAnonymous:false,
    isSolution:1,
    commentContent:"",
    teacherId:'',
    score:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
      icon: unescape(options.icon),
      teacherId:options.userId,
      time:options.time,
      price:options.cost
    })
  },
  addPj:function(val){
    let me=this;
    me.setData({
      commentContent:val.detail.value
    })
  },
  solute:function(e){
    let me=this;
    me.setData({
      isSolution: Number(e.currentTarget.dataset.id)
    })
  },
  onScoreChange:function(val){
    this.setData({
      score:val.detail
    })
  },
  onCheckChange:function(val){
    this.setData({
      isAnonymous: val.detail
    })
  },
  submit:function(){
    let me = this;
    app.wxRequest('post', '/ea-service-consult/consult/comment/', {
      teacherId:me.data.teacherId,
      isSolution:me.data.isSolution,
      isAnonymous:me.data.isAnonymous,
      commentContent: me.data.commentContent
    }, function (data) {
      wx.showToast({
        title: "感谢您的评价",
        icon: 'none',
        duration: 4000,
        success: function () {
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }, 1000);
        }
      })
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