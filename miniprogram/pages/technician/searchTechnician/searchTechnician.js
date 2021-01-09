const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    dataShow:false,
    noDataShow:false,
    isLoading:false,
    dataArr:[]
  },
  /**
   * 点击搜索
   */
  onSearchClick:function(){
    wx.setBackgroundColor({
      backgroundColor: '#e1e1e1', // 窗口的背景色为灰色
    })
    var me=this;
    me.onSearch( me.data.searchValue);
  },
  onItemClick:function(e){
    var bean=  e.currentTarget.dataset.bean
    wx.navigateTo({
      url: '/pages/technician/technicianDetail/technicianDetail?teacherId='+bean.teacherId
    })
  },
  onSearch:function(goodAtStr){
    var me=this;
    var url="getTeachersInfoByFavorableRate?goodAt="+goodAtStr;
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        me.setData({dataArr:data.data.data});
        me.setData({isLoading:false})
        if(data.data.data.length > 0){
          me.setData({dataShow:true});
          me.setData({noDataShow:false});
        }
        else{
          me.setData({noDataShow:true});
          me.setData({dataShow:false})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.onSearch("");
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
      app.getUser(me.onSearch);
    }
    else {
      me.onSearch(me.data.searchValue);
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