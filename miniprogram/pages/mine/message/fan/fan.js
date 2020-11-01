// pages/mine/message/fan/fan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,
    activeTab:0,
    followList:[],
    list:[]
  },
  onChange:function(val){
    let me=this;
    let index = val.detail.index;
    if(index==0){
      if (app.globalData.token != '') {
        me.getFollowList();
      }
      else {
        me.getFollowList();
      }
    }
    else  if (index == 1) {
      if (app.globalData.token != '') {
        me.getList();
      }
      else {
        me.getList();
      }
    }
  },
  getList: function () {
    let me = this;
    app.wxRequest('get', '/follow/fans', {}, function (data) {
      for (let i = 0; i < data.data.data.length; i++) {
        if (data.data.data[i].isEach == 0) {
          data.data.data[i].btn = '回关'
        }
        else {
          data.data.data[i].btn = '互相关注'
        }
      }
      me.setData({
        list: data.data.data
      })
    })
  },
  getFollowList: function () {
    let me = this;
    app.wxRequest('get', '/follow/follow', {}, function (data) {
      for (let i = 0; i < data.data.data.length; i++) {
        if (data.data.data[i].isEach==0){
          data.data.data[i].btn = '已关注'
        }
        else {
          data.data.data[i].btn = '互相关注'
        }
      }
      me.setData({
        followList: data.data.data
      })
    })
  },
  fan(id,index,name) {
    let me = this;
    app.wxRequest('post', '/follow/follow/' + id, {}, function (data) {
      if (data.data.data == '已关注' || data.data.data == '互相关注') {
        wx.showToast({
          title: data.data.data,
          icon: 'none'
        })
      }
      else if (data.data.data == '关注') {
        wx.showToast({
          title: "已取消关注",
          icon: 'none'
        })
      }
      let completeStatus = `${name}[${index}].btn`;
      me.setData({
        [completeStatus]: data.data.data
      })
    })
  },
  addFavour:function(e){
    let id = e.currentTarget.dataset.name == 'list' ? e.currentTarget.dataset.item.fromId : e.currentTarget.dataset.item.toId
    this.fan(id, e.currentTarget.dataset.index, e.currentTarget.dataset.name);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight
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
    let that = this;
    if (app.globalData.token != '') {
      that.getFollowList();
    }
    else {
      app.getUser(that.getFollowList);
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