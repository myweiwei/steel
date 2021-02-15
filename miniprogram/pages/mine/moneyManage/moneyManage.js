// pages/mine/moneyManage/moneyManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPwd: 'true',
    money:0,
    show:false,
    priceList: ['10', '20', '30', '50', '80', '100'],
    value: '10',
    show1:false,
    txPrice:'',
    ktxmoney: 10,
    message:"",
    active:0,
    czRecordList:[]
  },
  onClose: function () {
    let me = this;
    me.setData({
      show: false
    })
  },
  onClose1: function () {
    let me = this;
    me.setData({
      show1: false
    })
  },
  //充值
  addMoney:function(){
    this.setData({
      show: true
    })
  },
  choosePrice: function (e) {
    let me = this;
    me.setData({
      value: e.currentTarget.dataset.item,
      activeIndex: e.currentTarget.dataset.index
    })
  },
  addPrice: function () {
    let me = this;
    app.wxRequest('post', '/recharge/recharge/' + me.data.value, {}, function (res) {
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success: function (res) {
          wx.showToast({
            title: '充值成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              me.setData({
                show: false
              })
            }
          })
        },
        fail: function (res) {
        },
        complete: function (res) { }
      })
    })
  },
  //获取资产
  getMoney: function () {
    let me = this;
    app.wxRequest('get', '/personal/user/', {}, function (res) {
      me.setData({
        money: res.data.data.accountBalance
      })
    })
  },
  //资产展示隐藏
  showPwdFunc: function (e) {
    this.setData({
      showPwd: e.currentTarget.dataset.flag
    })
  },
  //提现
  showGetPrice:function(){
    this.setData({
      show1:true
    })
  },
  getPrice:function(){

  },
  onPriceChange: function (event){
    let data = event.detail
    if (!/^d*(?:.d{0,2})?$/.test(data)){
      data = data.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    }
    if (data > this.data.ktxmoney){
      this.setData({
        message: "输入金额超过可提现资产"
      })
    }
    else if (data < this.data.ktxmoney) {
      this.setData({
        message: ""
      })
    }
    this.setData({
      txPrice: data
    })
  },
  allTx:function(){
    this.setData({
      txPrice:this.data.ktxmoney
    })
  },
  //记录模块
  onTabChange:function(){

  },
  getCzRecord:function(){
    let me = this;
    app.wxRequest('get', '/recharge/record', {}, function (res) {
      console.log(res)
      me.setData({
        czRecordList: res.data.data
      })
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
    let that = this;
    if (app.globalData.token != '') {
      that.getMoney();
      this.getCzRecord();
    }
    else {
      app.getUser(that.getMoney);
      app.getUser(that.getCzRecord);
    }
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