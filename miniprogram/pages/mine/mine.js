// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    newvalue:'',
    priceList: ['3天（30元）','5天（50元）','7天（70元）','1个月（199元）'],
    activeIndex:0
  },
  choosePrice:function(e){
    let me=this;
    console.log(e.currentTarget.dataset.index);
    me.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  onChange:function(val){
    let me = this;
    console.log(val);
    // me.setData({
    //   show: false
    // })
  },
  onClose:function(){
    let me=this;
    me.setData({
      show:false
    })
  },
  addNew:function(){
    let me = this;
    me.setData({
      show: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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