// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headIcon:'',
    name:'',

    userInfo:{},
    activeIndex:0,
    money:0,
    showPwd:'false',
    countList:{},
    isTeacher:0
  },
  onTeacherRegister:function(){
    wx.navigateTo({
      url: '/pages/mine/regTeacher/regTeacher'
    })
  },
  onTeacherEdit:function(){
    wx.navigateTo({
      url: '/pages/mine/editTeacher/editTeacher'
    })
  },
  goMoney:function(){
    wx.navigateTo({
      url: '/pages/mine/moneyManage/moneyManage'
    })
  },
  goOrder:function(){
    wx.navigateTo({
      url: '/pages/technician/order/order'
    })
  },
  getCount:function(){
    let me = this;
    app.wxRequest('get', '/message/unreadCount', {}, function (res) {
      me.setData({
        countList:res.data.data
      })
    }) 
  },
  getHeadIconAndName:function(){
    let me = this;
    app.wxRequest('get', '/personal/user', {}, function (res) {
      console.log(res.data)
      me.setData({
        headIcon:res.data.data.headIcon,
        name:res.data.data.nickName,
        isTeacher: res.data.data.isTeacher
      })
    }) 
  },
  goMessage:function(){
    wx.navigateTo({
      url: '/pages/mine/message/message?followCount=' + this.data.countList.followCount + '&&supportCount=' + this.data.countList.supportCount + '&&commentCount=' + this.data.countList.commentCount
    })
  },
  showPwdFunc:function(e){
    this.setData({
      showPwd: e.currentTarget.dataset.flag
    })
  },
  onGotUserInfo: function (e) {
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
  toMy:function(e){
    wx.navigateTo({
      url: '/pages/pyq/mine/mine?userId='+0+"&userName="+"&headIcon="+ escape(this.data.headIcon)
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
  },
  onDynamicManager:function(){
    wx.navigateTo({
      url: "/pages/enterprise_dynamic/dynamicManager/dynamicManager"
    })
  },
  onShowManager:function(){
    wx.navigateTo({
      url: "/pages/enterprise/enterpriseShow/enterpriseShow"
    })
  },
  onRegister:function(){
    wx.navigateTo({
      url: "/pages/mine/regEnterprise/regEnterprise",
    })
  },
  onGoodsManager:function(){
    wx.navigateTo({
      url: "/pages/goods/goodsManager/goodsManager",
    })
  },
  onChange:function(val){
    this.setData({
      value:val.detail
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
   // this.getUser();
    this.setData({
      show:false
    })
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if (app.globalData.token != '') {
      that.getCount();
      that.getHeadIconAndName();
    }
    else {
      app.getUser(that.getCount);
      app.getUser(that.getHeadIconAndName);
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