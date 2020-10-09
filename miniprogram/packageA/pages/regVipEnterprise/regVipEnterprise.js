// pages/mine/regVipEnterprise/regVipEnterprise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    show:false
  },
  getImg:function(){
    let me=this;
    wx.cloud.downloadFile({
      fileID: 'cloud://steel-igutz.7374-steel-igutz-1302012194/企业注册-添加商品.png',
      success: res => {
        // get temp file path
        console.log(res.tempFilePath)
        me.setData({
          img: res.tempFilePath
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  onClose:function(){
    let me = this;
    me.setData({
      show: false
    })
  },
  beginVip:function(){
    let me=this;
    me.setData({
      show:true
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
    let me=this;
    me.getImg();  
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