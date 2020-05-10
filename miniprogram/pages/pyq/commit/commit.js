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
    wx.chooseLocation({
      success(res) {
        me.setData({
          province: res.address,
          address: true
        })
      }
    })
  },
  delAddress:function(){
    let me=this;
    me.setData({
      province:"",
      address:false
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