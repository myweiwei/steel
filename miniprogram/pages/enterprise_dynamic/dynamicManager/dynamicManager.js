// pages/mine/regEnterprise/regEnterprise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataShow:false,
    noDataShow:false,
    isLoading:false,
    list:[]
  },
  
  addGoods:function(event){
    wx.navigateTo({
      url: "/pages/goods/goodsAdd/goodsAdd"
    })
  },
  onUpdownGoods:function(event){
    var id = event.currentTarget.dataset.id;
    var me = this;
    app.wxRequest('post', "/enterprise/upDownGoods/" + id, {}, function (data) {
      if (data.data.status == 200) {
        me.initData();
      }
    })
  },
  onDelete:function(event){
    var id = event.currentTarget.dataset.id;
    var me = this;
    wx.showModal({
     title: '删除确认',
     content: '确定要删除该商品嘛？',
     success(res) {
       if (res.confirm) {
         app.wxRequest('post', "/enterprise/delGoods/" + id, {}, function (data) {
           if (data.data.status == 200) {
             me.initData();
           }
         })
       }
     }
    })
  },
 
  /* 选择企业类型弹框结束*/
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
    var me = this;
    me.setData({isLoading:true});
    if (app.globalData.token == '') {
      app.getUser(me.initData);
    }
    else {
      me.initData();
    }
   
  },

  initData:function(){
    var me = this;
    app.wxRequest('get', "/enterprise/goods", {}, function (data) {
      if (data.data.status == 200) {
        console.log(data.data.data);
        me.setData({list:data.data.data});
        me.setData({isLoading:false})
        if(data.data.data.length > 0){
          me.setData({dataShow:true});
        }
        else{
          me.setData({noDataShow:true});
        }
      }
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