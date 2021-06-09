// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headIcon:'',
    name:'',
    nameLen:4,
    userInfo:{},
    activeIndex:0,
    money:0,
    showPwd:'false',
    countList:{},
    isTeacher:0,
    inputFocus:false,
    disabled:true,
    isEnterprise:0
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
  onEnterpriseEdit:function(){
    wx.navigateTo({
      url: '/pages/mine/editEnterprise/editEnterprise'
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
      let name=res.data.data.nickName;
     var nameLen= me.strlen(name);
      me.setData({
        nameLen:nameLen,
        headIcon:res.data.data.headIcon,
        name:name,
        isTeacher: res.data.data.isTeacher,
        isEnterprise: res.data.data.isEnterprise
      })
    }) 
  },
  editHeadIconAndName: async function (arg) {
    let me = this;

    app.wxRequest('post', '/personal/user', arg, function (data) {
      if (data.data.status != 200) {
        wx.showToast({
          title: data.data.msg,
          icon: "none"
        })
      }
      else {
        wx.showToast({
          title: '已提交',
          icon: "success",
          success: function (res) {
            me.setData({
              active: 2
            })
          }
        });
      }
    })
  },
  onChangeInput:function(e){
    let me = this;
    var nameLen= me.strlen(e.detail.value);
    console.log(nameLen);
    this.setData({
      nameValue: e.detail.value,
      nameLen:nameLen
    })
    
  },
  /**
   * 设置可编辑状态
   */
  setEdit:function(){
    this.setData({
      disabled: false,
      inputFocus:true
    })
  },
  /**
   * 得到焦点
   * @param {*} e 
   */
  onInputFocusGet:function(e){
    //不显示编辑按钮
    this.setData({
      disabled: false
    })
  },
  /**
   * 失去焦点
   * @param {*} e 
   */
  onInputFocusLose:function(e){
    let me = this;
    var nameLen= me.strlen(e.detail.value);
    console.log(nameLen);
    // this.setData({
    //   nameValue: e.detail.value,
    //   nameLen:nameLen
    // })
        //显示编辑按钮
        this.setData({
          disabled: true
        })
        var arg = {
          nickName: e.detail.value,
          headIcon: me.data.headIcon
        }
        me.editHeadIconAndName(arg);
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
  toVip:function(){
    let me=this;
    wx.redirectTo({
      url: '/packageA/pages/regVipEnterprise/regVipEnterprise',
    })
  },

  addNew:function(){
    let me = this;
    me.setData({
      show: true
    })
  },

  selectImg:function(){
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths.path
        // console.log(res.tempFilePaths[0]);
        me.addHead(res.tempFilePaths[0])
      }
    })
  },
  addHead:function(path){
    var me = this;
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.globalData.baseUrl + '/dynamic/fileupload',
      filePath: path,
      name: 'file',
      formData: {
      },
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': app.globalData.token
      },
      success: function (res) {
     var headIcon=   JSON.parse(res.data).data
     app.globalData.userIcon=headIcon;
        me.setData({
          headIcon: headIcon
        });
        console.log(headIcon);
        var arg = {
          nickName: me.data.name,
          headIcon: headIcon
        }
        wx.hideLoading();
        me.editHeadIconAndName(arg);
      }, fail: function (err) {
        console.log(err);
      }
    })
  },
    

  strlen:function (str){  
    var len = 0;  
    for (var i=0; i<str.length; i++) {   
     var c = str.charCodeAt(i);   
    //单字节加1   
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
       len++;   
     }   
     else {   
      len+=2.1;   
     }   
    }   
    return len;  
}  ,
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