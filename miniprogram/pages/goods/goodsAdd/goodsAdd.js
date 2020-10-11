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
    show:false,
    statusList: ['上架','下架'],
    status:"上架",
    fileList:[]
  },
  //上传图片
  afterRead: function (e) {
    let me = this;
    let arr = [];
    arr.push(e.detail.file);
    me.setData({
      fileList: arr
    })
  },
  delImg: function (e) {
    let me = this;
    let arr = [];
    me.setData({
      fileList: arr
    })
  },
  /* 选择状态弹框*/
  chooseType:function(){
    let me = this;
    me.setData({
      show: true
    })
  },
  onCancel: function () {
    let me = this;
    me.setData({
      show: false
    })
  },
  onConfirm:function(val){
    let me = this;
    me.setData({
      status: val.detail.value,
      show:false
    })
  },
  onGoodsNameChange:function(event){
    var me = this;
    me.setData({goodsName:event.detail});
  },
  onDescriptionChange:function(event){
    var me = this;
    me.setData({description:event.detail});
  },
  onPriceChange:function(e){
    var me = this;
    var money=''
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail)) { //正则验证，提现金额小数点后不能大于两位数字
      money = e.detail;
    } else {
      money = e.detail.substring(0, e.detail.length - 1);
    }
    me.setData({ price: money});
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
    var me = this;
    if (!me.data.fileList.length){
      wx.showToast({
        title: "请上传商品图片",
        icon: 'none',
        duration: 2000//持续的时间
      })
      return;
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.globalData.baseUrl + '/dynamic/fileupload',
      filePath: me.data.fileList[0].path,
      name: 'file',
      formData: {
      },
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': app.globalData.token
      },
      success: function (res) {
        me.setData({
          image: JSON.parse(res.data).data
        });
        me.submitFunc();
      }, fail: function (err) {
      }
    })
  },
  submitFunc:function(){
    let me=this;
    var param = {};
    param.name = me.data.goodsName;
    param.description = me.data.description;
    param.price = me.data.price;
    param.unit = me.data.unit;
    param.status = me.data.status == "上架" ? 1 : 0;
    param.image=me.data.image
    app.wxRequest('post', "/enterprise/goods", param, function (data) {
      if (data.data.status == 200) {
        //跳回商品管理页面
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function(){
          me.goBack()
        },1000);
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