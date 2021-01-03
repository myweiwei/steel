const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherId:-1,
    realName:'',
    solvePrice:0,
    typeName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type==1){
      this.setData({typeName:'视频咨询'})
    }else if(options.type==0){
      this.setData({typeName:'图文咨询'})
    }
    this.setData({
      teacherId:options.teacherId,
      realName:options.realName,
      solvePrice:options.solvePrice});
  },
  onPay:function(){
    var me=this;
    var url='consult/payment/videoPayment?teacherId='+this.data.teacherId+'&payMoney='+this.data.solvePrice;
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        var payData=data.data.data;
        console.log();
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success (res) { 
            console.log(res)
          },
          fail (res) { 
            console.warn(res)
          }
        })
      }
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