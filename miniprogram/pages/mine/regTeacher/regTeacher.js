// pages/mine/regTeacher/regTeacher.js
const app = getApp();
Page({
  data: {
    userInfo:{},
    fileList:[],
    realName:"",
    headIcon:'',
    idCardNumber:'',
    teacherJobPosition:"",
    teacherGoodAt:"",
    teacherDescription:'',
    slovePrice:"",
    phoneNumber:"",
    smsCode:""
  },
  onChange:function(val){
    let me=this;
    console.log(val)
    console.log(val.currentTarget.dataset.name)
    let label = val.target.dataset.name;
    me.setData({
      [label]: val.detail
    })
  },
  submit:async function(){
    let me=this;
    wx.showLoading({
      title: '正在提交',
    })
    await me.upFile();
    var arg={
      realName: me.data.realName,
      headIcon: me.data.headIcon,
      idCardNumber: me.data.idCardNumber,
      teacherJobPosition: me.data.teacherJobPosition,
      teacherGoodAt: me.data.teacherGoodAt,
      teacherDescription: me.data.teacherDescription,
      slovePrice: me.data.slovePrice,
      phoneNumber: me.data.phoneNumber,
      smsCode: me.data.smsCode
    }
    app.wxRequest('post', '/ea-service-personal/personal/registerTeacher', arg, function (data) {
      console.log(data);
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
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 2000)
          }
        });
      }
    })
  },
  upFile: function () {
    let me = this;
    let arr = [];
    arr = me.data.fileList;
    return new Promise((resolve, reject) => {
      if (!me.data.fileList[0]) {
        wx.showToast({
          title: '请上传头像',
          icon: "none"
        });
        reject();
      }
      wx.uploadFile({
        url: app.globalData.baseUrl + '/ea-service-dynamic/dynamic/fileupload',
        filePath: me.data.fileList[0].path,
        name: 'file',
        formData: {
        },
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': app.globalData.token
        },
        success: function (res) {
          console.log(JSON.parse(res.data).data);
          me.setData({
            headIcon: JSON.parse(res.data).data
          })
          resolve('ok');
        }, fail: function (err) {
          reject();
        }
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUser: function () {
    let me = this;
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
          userInfo: res
        })
      }
    })

  },
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo);
  },
  delImg:function(){
    let me = this;
    let arr = [];
    me.setData({
      fileList: arr
    })
  },
  afterRead:function(e){
    console.log(e.detail.file);
    let me=this;
    let arr=[];
    arr.push(e.detail.file);
    me.setData({
      fileList: arr
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