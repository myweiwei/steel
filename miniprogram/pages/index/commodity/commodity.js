const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    dataShow:false,
    noDataShow:false,
    isLoading:false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
        this.setData({
         _index:null
        })
        that.setData({
          baseUrl: app.globalData.baseUrl,
          dynamicId:options.dynamicId
        })
        if(app.globalData.token!=''){
          that.initView();
        }
        else {
          app.getUser(that.initView);
        }
  },
  initView:function(){
    var me=this;
    me.getList(me.data.searchValue)
  },
  getList:function(goodAtStr){
    let me = this;
    
    app.wxRequest('get', '/enterprise/vipGoods?pageNum=1&pageSize=10&goodsName='+goodAtStr, {}, function (data) {

      console.log(data.data.data)
      if (data.data.data.status == 200) {
        me.setData({list: data.data.data.data.list});
        me.setData({isLoading:false})
        if(data.data.data.data.list.length > 0){
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
   * 点击搜索
   */
  onSearchClick:function(e){
    wx.setBackgroundColor({
      backgroundColor: '#e1e1e1', // 窗口的背景色为灰色
    })
    var me=this;
    me.getList(e.detail);
  },
  goEnterprise:function(event){
    var distance = event.currentTarget.dataset.distance;
    var enterpriseId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/enterprise/enterpriseDetail/enterpriseDetail?distance=' + distance  + "&enterpriseId=" + enterpriseId
    });
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