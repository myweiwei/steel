// pages/pyq/commit/commit.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    province:'',
    city:"",
    fileList:[],
    fileList1:[],
    count:0,
    focus:false,
    address:false
  },
  afterRead(event) {
    let me=this;
    const { file } = event.detail;
    let arr=me.data.fileList.concat(file);
    me.setData({
      fileList:arr,
      count:1
    })
  },
  afterRead1(event) {
    let me = this;
    const { file } = event.detail;
    let arr=[];
    arr.push(file)
    me.setData({
      fileList1:arr,
      count:1
    })
  },
  delVideo:function(){
    let me=this;
    wx.showModal({
      title: '提示',
      content: '确认删除该条视频吗',
      success(res) {
        if (res.confirm) {
          me.setData({
            fileList1: []
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  delImg:function(e){
    let me = this;
    let index=e.detail.index;
    let arr = me.data.fileList;
    arr.splice(index,1);
    me.setData({
      fileList:arr,
    })
  },
  btnClick: function () {
    // 点击发送按钮事件
    this.setData({
      focus: true
    })
  },
  getLocation:function(){
    let me=this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        me.loadCity(res.longitude, res.latitude);
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var me = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=nuXmYS0mH29u7b929gLoEvdP5fzr9bqR&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var city = res.data.result.addressComponent;
        me.setData({
          province: city.province,
          city:city.city,
          address:true
        })
      },
      fail: function () {
      },
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
    console.log(getCurrentPages());
    let me=this;
    me.setData({
      focu:true
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