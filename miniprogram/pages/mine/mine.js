// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    newvalue:'',
    value:'',
    iconList:[
      { name: "完善信息", icon:'my_17'},
      { name: "我的关注", icon:"my_14"},
      { name: "咨询记录", icon: "my_11" },
      { name: "技师专栏", icon: "my_23" },
      { name: "充值中心", icon: "my_26" },
      { name: "关联企业", icon: "my_28" },
      { name: "意见反馈", icon: "my_33" },
      { name: "联系我们", icon: "my_36" },
      // { name: "关联企业", icon: "my_28" }
    ],
    priceList: ['3天（30元）','5天（50元）','7天（70元）','1个月（199元）'],
    activeIndex:0
  },
  onChange:function(val){
    this.setData({
      value:val.detail
    })
  },
  addPrice:function(){
    let me=this;
    app.wxRequest('post', '/ea-service-personal/recharge/recharge/'+me.data.value, {}, function (res) {
      wx.requestPayment(
        {
          timeStamp: res.data.data.data.timeStamp,
          nonceStr: res.data.data.data.nonceStr,
          package: res.data.data.data.package,
          signType: res.data.data.data.signType,
          paySign: res.data.data.data.paySign,
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) { }
        })
    })
  },
  choosePrice:function(e){
    let me=this;
    console.log(e.currentTarget.dataset.index);
    me.setData({
      activeIndex: e.currentTarget.dataset.index
    })
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