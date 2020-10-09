// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    value:'10',
    userInfo:{},
    iconList:[
      { name: "完善信息", icon:'my_17'},
      { name: "我的关注", icon:"my_14"},
      { name: "咨询记录", icon: "my_11" },
      { name: "技师专栏", icon: "my_23" },
      { name: "充值中心", icon: "my_26" },
      { name: "关联企业", icon: "my_28" },
      { name: "意见反馈", icon: "my_33" },
      { name: "联系我们", icon: "my_36" },
      { name: "注册企业", icon: "my_28" }
    ],
    priceList: ['10','20','30','50','80','100'],
    activeIndex:0,
    money:0,
    showPwd:'false'
  },
  showPwdFunc:function(e){
    console.log(e.currentTarget.dataset.flag)
    this.setData({
      showPwd: e.currentTarget.dataset.flag
    })
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo);
  },
  getUser:function(){
    let me=this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        me.setData({
          userInfo:res
        })
      }
    })

  },
  getMoney:function(){
    let me=this;
    app.wxRequest('get', '/personal/user/', {}, function (res) {
      me.setData({
        money: res.data.data.accountBalance
      })
    })
  },
  myPop:function(e){
    let me=this;
    console.log(e.currentTarget.dataset.name)
    let name = e.currentTarget.dataset.name;
    if (name=="充值中心"){
      me.setData({
        show: true
      })
    }
    else if (name=='技师专栏'){
     // me.getUser();
      wx.navigateTo({
        url: '/pages/mine/regTeacher/regTeacher'
      })
    }
    else if(name=="联系我们"){
      wx.makePhoneCall({
        phoneNumber: '16619962166',
      })
    }
    else if (name == "注册企业") {
      wx.navigateTo({
        url: "/pages/mine/regEnterprise/regEnterprise",
      })
    }
  },
  onChange:function(val){
    this.setData({
      value:val.detail
    })
  },
  addPrice:function(){
    let me=this;
    app.wxRequest('post', '/recharge/recharge/'+me.data.value, {}, function (res) {
      wx.requestPayment(
        {
          timeStamp: res.data.data.data.timeStamp,
          nonceStr: res.data.data.data.nonceStr,
          package: res.data.data.data.package,
          signType: res.data.data.data.signType,
          paySign: res.data.data.data.paySign,
          success: function (res) {
            console.log(res);
            wx.showToast({
              title: '充值成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                me.setData({
                  show:false
                })
              }
            })
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
    console.log(e.currentTarget.dataset.item);
    me.setData({
      value: e.currentTarget.dataset.item,
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
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if(app.globalData.token!=''){
      that.getMoney();
    }
    else {
      app.getUser(that.getMoney);
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
   // this.getUser();
    this.setData({
      show:false
    })
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