const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meId:"",
    itemData:{},
    inputType:"1",// 1 表示一级评论
    userid: "",
    showInput:false,
    avaShow1: false,
    commentShow:true,
    zanList:[],
    commentId:'',
    commonList:[],
    commentInfo: "",
    commentItem:"",
    dynamicId:'',
    huifu:"评论一下吧",
    tabActive:"a"
  },
  getItem: function (id) {
    let me = this;
    // https://eahost.lileiit.com/comment/{dynamicId}
    app.wxRequest('get', '/dynamic/dynamicDetail?dynamicId=' + id, {}, function (data) {

      console.log(data.data)
      me.setData({
        itemData: data.data.data,
        userid:data.data.data.userId
      })
    })
    me.setData({
      avaShow: true
    })
  },
  toMy:function(e){
    var bean=  e.currentTarget.dataset.bean
    console.log('item: ', bean)
    wx.navigateTo({
      url: '/pages/pyq/mine/mine?userId='+bean.sid+"&userName="+bean.nickName+'&headIcon='+escape(bean.supportUsersIcon)
    })
  },
  getComment: function (id) {
    let me = this;
    // https://eahost.lileiit.com/comment/{dynamicId}
    app.wxRequest('get', '/comment/' + id, {}, function (data) {

      console.log(data.data)
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
  onChangeInput:function(e){
    this.setData({
      commentInfo: e.detail.value
    })
    
  },
  saveCommentBefore: function (e) {
    let me = this;
    // let sta = e.currentTarget.dataset.sta;
    let arg = {};
    console.log(me.data.userid)
    if(!me.data.commentInfo){
      console.log(me.data.commentInfo)
      return;
    }
    console.log(me.data.inputType == "1")
    if (me.data.inputType == "1") {//一级评论
      arg.parentCommentId = 0;
      arg.dynamicId = me.data.itemData.dynamicId;
      arg.toUid = me.data.itemData.userId;
      arg.content = me.data.commentInfo;
      console.log(arg.dynamicId+"  "+arg.toUid+"   "+arg.content)
    } else  {
      arg.parentCommentId = me.data.commentItem.commentId;
      arg.dynamicId = me.data.commentItem.dynamicId;
      arg.toUid = me.data.commentItem.fromUid;
      arg.content = me.data.commentInfo;
    }
    console.log("---------------------"+arg)
    me.saveComment(arg);
  },
  saveComment: function (arg) {

    let me = this;
    app.wxRequest('post', '/comment/dynamicComment', arg, function (data) {
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
    //  me.data.list[index].commentCount=me.data.list[index].commentCount+1;
     me.data.commonList.push(arg);
    //  if(me.data.tabTitle=="最热"){}
      me.setData({
        // commonList:me.data.commonList,
        // list:me.data.list,
        avaShow1: false,
        commentInfo: ""
      })
      me.getComment(me.data.itemData.dynamicId)
      // console.log(me.data.tabTitle);
      // me.initData();
    })
  },
  fan(){
    let me=this;
    let follow = me.data.itemData.isFollow == 1 ? 0 : 1;
    app.wxRequest('post', '/follow/follow/'+me.data.itemData.userId, {}, function (data) {
        me.data.itemData.isFollow=follow;
        me.setData({
          itemData:me.data.itemData
          })
        if (data.data.data == '已关注' || data.data.data == '互相关注') {
          wx.showToast({
            title: "已关注",
            icon: 'none'
          })
        }
        else if (data.data.data == '关注' || data.data.data == '回关') {
          wx.showToast({
            title: "已取消关注",
            icon: 'none'
          })
        }

  })
  },
  getZan: function (id) {
    let me = this;
    // https://eahost.lileiit.com/comment/{dynamicId}
    app.wxRequest('get', '/support/record?dynamicId=' + id, {}, function (data) {
      console.log(data.data)
      me.setData({
        zanList: data.data.data
      })
    })
    me.setData({
      avaShow: true
    })
  },
  
  onChangeTab: function (val) {
    let me = this;
    console.log(val)
    me.setData({
      tabActive:val.detail.name,
      commentShow:val.detail.name=='a'
    })

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
          meId:app.globalData.userId,
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
    //播放按钮点击时触发触发
    videoPlay(e) {
      let _index = e.currentTarget.dataset.id
      this.setData({ //让video组件显示出来，不然点击时没有效果
        _index
      })
      //停止正在播放的视频
      let videoContextPrev = wx.createVideoContext(_index.toString())
      videoContextPrev.stop();
  
      setTimeout(() => {
        //将点击视频进行播放
        let videoContext = wx.createVideoContext(_index)
        videoContext.play();
      }, 500)
    },
    preview: function (e) {
      wx.previewImage({
        current: e.currentTarget.dataset.current, // 当前显示图片的http链接
        urls: e.currentTarget.dataset.urls // 需要预览的图片http链接列表
      })
    },
  initView:function(){
    var me=this;
    
    me.getItem(me.data.dynamicId)
   me.getComment(me.data.dynamicId)
   me.getZan(me.data.dynamicId)
  },
  toComment: function (e) {
// 评论一下吧
    let me = this;
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.item.fromUid ==  app.globalData.userid) {
      me.data.huifu = '回复@我:'
    }
    else {
      me.data.huifu = '回复@' + e.currentTarget.dataset.item.send + ':'
    }
    me.setData({
      showInput:true,
      inputType:"2",
      commentId: e.currentTarget.dataset.item.dynamicId,
      commentItem:e.currentTarget.dataset.item,
      huifu:me.data.huifu
    })
  },
  //键盘失去焦点
  onBindblur:function(){
    let me = this;
    me.data.inputType="1"
    me.setData({
      inputType:"1",
      huifu:"评论一下吧",
      showInput:false
    })
  },
  onClose1: function () {
    let me = this;
    me.setData({
      avaShow1: false
    })
  },
  open: function (e) {
    let me = this;
    let arr = me.data.commonList;
    for (let i = 0; i < arr.length; i++) {
      arr[i].openFlag = false;
      if (arr[i].commentId == e.currentTarget.dataset.id) {
        arr[i].openFlag = true;
      }
    }
    me.setData({
      commonList: arr
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