// pages/pyq/pyq.js
const app = getApp();
Page({
  data: {
    active:1,
    avaShow:false,
    openFlag:false,
    commCount:2,
    commentInfo:'',
    baseUrl:'',
    pageData:{
      pageNum:1,
      pageSize:3
    },
    ownpageData:{
      pageNum: 1,
      pageSize: 3
    },
    likeData: {
      pageNum: 1,
      pageSize: 3
    },
    cityData: {
      pageNum: 1,
      pageSize: 3
    },
    list:[],
    total:0,
    commonList:[],
    avaShow1:false,
    avaShowList:{},
    commentInfo1:"",
    userid:"",
    commentId:"",
    commentCount:0,
    unGeo:''
  },
  toComment:function(e){
    let me=this;
    if (e.currentTarget.dataset.item.fromUid==me.data.userid){
      e.currentTarget.dataset.item.send1='回复@我:'
    }
    else {
      e.currentTarget.dataset.item.send1 = '回复@' + e.currentTarget.dataset.item.send+':'
    }
    me.setData({
      avaShowList: e.currentTarget.dataset.item,
      avaShow1:true
    })
  },
  saveCommentBefore:function(e){
    let me=this;
    let sta = e.currentTarget.dataset.sta;
    let arg={};
    if(sta==1){
      arg.parentCommentId = me.data.avaShowList.commentId;
      arg.dynamicId = me.data.avaShowList.dynamicId;
      arg.toUid = me.data.avaShowList.fromUid;
      arg.content = me.data.commentInfo1;
    }
    else if(sta==0){
      arg.parentCommentId=0;
      arg.dynamicId = me.data.commentId;
      arg.toUid = me.data.userid;
      arg.content = me.data.commentInfo;
    }
    me.saveComment(arg);
  },
  saveComment: function (arg){
    let me=this;
    app.wxRequest('post', '/ea-service-dynamic/comment/dynamicComment', arg, function (data) {
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
      me.setData({
        avaShow1: false,
        commentInfo:"",
        commentInfo1: ""
      })
      me.getComment(me.data.commentId)
    })
  },
  longPress:function(e){
    let me=this;
    if (me.data.userid == e.currentTarget.dataset.item1.fromUid){
      wx.showModal({
        title: '提示',
        content: '确认删除该条评论吗',
        success: function (res) {
          if (res.confirm) {
            app.wxRequest('DELETE', '/ea-service-dynamic/comment/' + e.currentTarget.dataset.item1.commentId, {}, function (data) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              me.getComment(me.data.commentId)
            })
          } else {
          }
        }
      })
    }
  },
  onChange:function(val){
    let me=this;
    me.setData({
      commentInfo:val.detail
    })
  },
  onChange1: function (val) {
    let me = this;
    me.setData({
      commentInfo1: val.detail
    })
  },
  changeAcitve:function(e){
    let me=this;
    me.setData({
      active: e.currentTarget.dataset.id
    })
    me.getActiveList(me.data.active);
  },
  getActiveList:function(active){
    let me = this;
    let num = 'ownpageData.pageNum';
    let num1 = 'pageData.pageNum';
    let num2 = 'pageData.pageNum';
    let num3 = 'cityData.pageNum'
    if (me.data.active == 4) {
      me.setData({
        list: [],
        [num]: 1
      })
      me.getOwnList();
    }
    else if (me.data.active == 1) {
      me.setData({
        list: [],
        [num1]: 1
      })
      me.getList()
    }
    else if (me.data.active == 3) {
      me.setData({
        list: [],
        [num2]: 1
      })
      me.getLikeList()
    }
    else if (me.data.active == 2) {
      me.setData({
        list: [],
        [num3]: 1
      })
      me.getLoc()

    }
    else {
      me.setData({
        list: []
      })
    }
  },
  del:function(e){
    let id = e.currentTarget.dataset.item.dynamicId;
    let me = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该动态吗',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest('delete', '/ea-service-dynamic/dynamic/' + id, {}, function (data) {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            me.getActiveList(me.data.active);
          })
        } else {
        }
      }
    })
  },
  toFb:function(){
    wx.navigateTo({
      url: '/pages/pyq/commit/commit'
    })
  },
  comment:function(e){
    let me=this;
    me.setData({
      userid: e.currentTarget.dataset.item.userId,
      commentId: e.currentTarget.dataset.item.dynamicId,
      commentCount: e.currentTarget.dataset.item.commentCount
    })
    me.getComment(e.currentTarget.dataset.item.dynamicId);
  },
  getComment:function(id){
    let me=this;
    app.wxRequest('get', '/ea-service-dynamic/comment/' + id, {}, function (data) {
      for (let i = 0; i < data.data.data.length; i++) {
        data.data.data[i].openFlag = false;
      }
      me.setData({
        commonList: data.data.data
      })
    })
    me.setData({
      avaShow: true
    })
  },
  onClose:function(){
    let me=this;
    me.setData({
      avaShow: false
    })
  },
  onClose1: function () {
    let me = this;
    me.setData({
      avaShow1: false
    })
  },
  open:function(e){
    let me=this;
    let arr = me.data.commonList;
    for(let i=0;i<arr.length;i++){
      arr[i].openFlag=false;
      if (arr[i].commentId == e.currentTarget.dataset.id) {
        arr[i].openFlag = true;
      }
    }
    me.setData({
      commonList:arr
    })
  },
  close: function (e) {
    let me = this;
    let arr = me.data.commonList;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].commentId == e.currentTarget.dataset.id) {
        arr[i].openFlag = false;
      }
    }
    me.setData({
      commonList: arr
    })
  },
  getList:function(){
    let me=this;
    app.wxRequest('get', '/ea-service-dynamic/dynamic/dynamicList' + '/' + me.data.pageData.pageNum + '/' + me.data.pageData.pageSize+"/all", {},function(data){
      let arr=[];
      me.setData({
        list:me.data.list.concat(data.data.data.list),
        total:data.data.data.total
      })
    })
  },
  getOwnList: function () {
    let me = this;
    app.wxRequest('get', '/ea-service-dynamic/dynamic/user/dynamicList' + '/' + me.data.ownpageData.pageNum + '/' + me.data.ownpageData.pageSize, {}, function (data) {
      let arr = [];
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  getLikeList: function () {
    let me = this;
    app.wxRequest('get', '/ea-service-dynamic/support/dynamicList/' + me.data.likeData.pageNum + '/' + me.data.likeData.pageSize, {}, function (data) {
      let arr = [];
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  getLoc:function(){
    let that=this;
    wx.getLocation({
      success: function (res) {
        const url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=FTqHSN5H275UH2yIbPnMlE7qHBnb7etT&output=json&coordtype=wgs84ll&location=${res.latitude},${res.longitude}`;
        const ak = 'FTqHSN5H275UH2yIbPnMlE7qHBnb7etT';
        //小程序的ajax请求需要在后台安全域名配置增加 开发测试中在详情里勾选-不校验合法域名即可
        wx.request({
          url,
          data: {},
          success: function (res) {
            if (res.data.status == "0") {
              that.setData({
                unGeo: res.data.result.addressComponent.city
              });
              that.getCityList(res.data.result.addressComponent.city);
              wx.hideLoading()
            } else {
              that.setData({
                unGeo: '未知位置',
              });
              wx.hideLoading()
            }
          }
        })
      }
    })
  },
  getCityList:function(area){
    let me = this;
    app.wxRequest('get', '/ea-service-dynamic/dynamic/dynamicList/' + me.data.cityData.pageNum + '/' + me.data.cityData.pageSize+'/'+area,{},function (data) {
      let arr = [];
      console.log(data)
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  addSc:function(e){
    let me=this;
    console.log(e.currentTarget.dataset.item);
    let support = e.currentTarget.dataset.item.isSupport==1?0:1;
    app.wxRequest('get', '/ea-service-dynamic/support/' + e.currentTarget.dataset.item.dynamicId+ '/' + support, {}, function (data) {
      me.getList();
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
    //选择id
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl
    })
    if(app.globalData.token!=''){
      that.getList();
    }
    else {
      app.getUser(that.getList);
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
    let me=this;
    if(me.data.active==1){
      let list = "pageData.pageNum";
      if (me.data.list.length < me.data.total) {
        me.setData({
          [list]: ++me.data.pageData.pageNum
        })
        me.getList();
      }
    }
    else if(me.data.active==4){
      let list = "ownpageData.pageNum";
      if (me.data.list.length < me.data.total) {
        me.setData({
          [list]: ++me.data.ownpageData.pageNum
        })
        me.getOwnList();
      }
    }
    else if (me.data.active == 2) {
      let list = "cityData.pageNum";
      if (me.data.list.length < me.data.total) {
        me.setData({
          [list]: ++me.data.cityData.pageNum
        })
        me.getLoc();
      }
    }
    else if (me.data.active == 3) {
      let list = "likeData.pageNum";
      if (me.data.list.length < me.data.total) {
        me.setData({
          [list]: ++me.data.likeData.pageNum
        })
        me.getLikeList();
      }
    }
    else {
      me.setData({
        list:[]
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})