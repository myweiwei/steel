// pages/index/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2081452170,4060223007&fm=26&gp=0.jpg',
    time:'1小时',
    price:"30元",
    isAnonymous:false,
    isSolution:1,
    commentContent:"",
    teacherId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
      icon:options.icon,
      teacherId:options.userId
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