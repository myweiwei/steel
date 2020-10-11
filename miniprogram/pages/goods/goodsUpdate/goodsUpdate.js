// pages/goods/goodsAdd/goodsAdd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goodsName:"",
      description:"",
      price:"",
      unit:"",
      image:"",
      status:"",
  },
  onGoodsNameChange:function(event){
    var me = this;
    me.setData({goodsName:event.detail});
  },
  onDescriptionChange:function(event){
    var me = this;
    me.setData({description:event.detail});
  },
  onPriceChange:function(event){
    var me = this;
    me.setData({price:event.detail});
  },
  onUnitChange:function(event){
    var me = this;
    me.setData({unit:event.detail});
  },
  onStatusChange:function(event){
    var me = this;
    me.setData({status:event.detail});
  },
  
  addGoods:function(){
    console.log(123);
    var me = this;
    var param = {};
    param.name = me.data.goodsName;
    param.description = me.data.description;
    param.price = me.data.price;
    param.unit = me.data.unit;
    param.status = me.data.status;
    app.wxRequest('post', "/enterprise/goods", param, function (data) {
      if (data.data.status == 200) {
        console.log(data.data.data);
        //跳回商品管理页面
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
         })
         setTimeout(me.goBack(),1000);  
        
       
      }
    })
  },
  goBack:function(){
    wx.navigateBack({
      delta: -1
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