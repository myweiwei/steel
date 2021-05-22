const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherId:-1,
    technicianData:{},
    imgtxtSolvePrice:0,
    videoSolvePrice:0,
    teacherComments:[],
    show:false,
    phone:'',
    focus:false,
    imgList:[]
  },
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    let arr=[];
    this.data.technicianData.teacherResourceList.forEach((t)=>{
      arr.push(t.resource)
    })
    this.setData({
      imgList:arr
    })
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({teacherId:options.teacherId});
    this.getTeacherComment(this.data.teacherId,1,10);
    this.getTechDetail(this.data.teacherId);
  },
  onPay: function () {
    var me = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1}))+\d{8})$/;;
    if (!myreg.test(this.data.phone)){
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return ;
    }
    console.log(this.data.teacherId)
    console.log(this.data.technicianData.videoSolvePrice)
    var url = 'consult/payment/videoPayment?teacherId=' + this.data.teacherId + '&payMoney=' + this.data.technicianData.videoSolvePrice + '&phone=' + this.data.phone;
    app.wxRequest('get', url, {}, function (data) {
      console.log(data)
      if (data.data.status == 200) {
        var payData = data.data.data;
        console.log(payData)
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success(res) {
            wx.navigateTo({
              url: '/pages/technician/paySuccess/paySuccess?payMoney=' + me.data.technicianData.videoSolvePrice
            })
          },
          fail(res) {
            console.log(res)
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
            return;
          }
        })
      }
    }, function (err) {
      console.log(err)
    })

  },
  onChange:function(val){
    this.setData({
      phone:val.detail
    })
  },
  pay:function(){
    this.setData({
      show:true,
      focus:true
    })
  },
  onClose:function(){
    this.setData({
      show: false
    })
  },
  getTechDetail:function(teacherId){
    var me=this
    var url="teacherInfoByTeacherId/"+teacherId;
    // https://eahost.lileiit.com/teacherInfoByTeacherId/49
    app.wxRequest('get', url, {}, function (data) {
      console.log(data.data)
      if (data.data.status == 200) {
        me.setData({technicianData:data.data.data});
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
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
/**
 * 图文咨询
 */
  onImageConsult:function(){
    var technicianData=this.data.technicianData;
    wx.navigateTo({

      url: '/pages/technician/technicianVideoConsult/technicianVideoConsult?type='+0+'&teacherId='+technicianData.teacherId+
      '&teacherName='+technicianData.teacherName+'&solvePrice='+technicianData.imgtxtSolvePrice
    })

  },
  /**
   * 视频咨询
   */
  onVideoConsult:function(){
    var technicianData=this.data.technicianData;
    wx.navigateTo({
      url: '/pages/technician/technicianVideoConsult/technicianVideoConsult?type='+1+'&teacherId='+technicianData.teacherId+
      '&realName='+technicianData.realName+'&solvePrice='+technicianData.videoSolvePrice
    })

  },
getTeacherComment:function(teacherId,pageNum,pageSize){

  var me=this;
  var url="teacherComment?teacherId="+teacherId+"&pageNum="+pageNum+"&pageSize="+pageSize;
  app.wxRequest('get', url, {}, function (data) {
   
    if (data.data.status == 200) {
      me.setData({teacherComments:data.data.data.list});
    }
  })
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