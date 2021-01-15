const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:0,
    list:[],
    total:0,
    baseUrl: '',
    countData:{},
    userid: "",
    commentId: "",
    commentCount: 0,
    headIcon:'',
    userName:'',
    commonList: [],
    avaShow: false,
    avaShow1: false,
    ownOther:false, //自己发的更多弹框
    columns:['删除','转发'],
    pages:1,
    pageData: {
      pageNum: 1,
      pageSize: 100
    },
    statusBarHeight:0,  //状态栏高度
    titleBarHeight:0  //标题栏高度
  },
  showOwnOther(e){
    let item=e.currentTarget.dataset.item;
    console.log(item)
    this.setData({
      ownOther:true,
      currentdynamic:item
    })
  },
  onClose2(){
    this.setData({
      ownOther: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var headIcon=unescape(options.headIcon)
    this.setData({
      userId:options.userId,
      headIcon:headIcon,
      userName:options.userName
    });
    let me=this;
  // 获取设备信息
  wx.getSystemInfo({
    success: e => {   // { statusBarHeight: 20, ... }，单位为 px
       // 获取右上角胶囊的位置信息
       let info = wx.getMenuButtonBoundingClientRect()  // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
       let CustomBar = info.bottom  - info.top +(info.top-e.statusBarHeight)*2
       me.setData({
        statusBarHeight:e.statusBarHeight,
        titleBarHeight:CustomBar
       })
    }
  })  
      me.setData({
        baseUrl: app.globalData.baseUrl
      })
      if(app.globalData.token!=''){
        me.grtCount();
        me.getList();
      }
      else {
        app.getUser(me.initData);
      }
  },
  initData:function(){
    this.grtCount();
    this.getList();
  },
 onBack(){
  wx.navigateBack({
    complete: (res) => {},
  })
},
grtCount:function(){
  let me = this;
  var url;
  if(me.data.userId==0){
    url='/dynamic/user/count';
  }else{
    url='/dynamic/user/count?otherId='+me.data.userId;
  }
  app.wxRequest('get', 
  url,
  {},
  function(data){
    me.setData({countData:data.data.data})
  })
},
getList: function () {
  let me = this;
  var url;
  if(me.data.userId==0){
    url='/dynamic/dynamicList?pageNum='+me.data.pageData.pageNum+'&pageSize='+me.data.pageData.pageSize+'&own=1';
  }else{
    url= '/dynamic/dynamicList?pageNum='+me.data.pageData.pageNum+'&pageSize='+me.data.pageData.pageSize+'&otherId='+me.data.userId;
  }

  app.wxRequest('get', 
  url,
  {},
  function(data){
    let count = 0;
    for(let i=0;i<data.data.data.list.length;i++){
      if (data.data.data.list[i].videoType=='1'){
        data.data.data.list[i].videoindex=count;
        ++count;
      }
    }
    wx.nextTick(() => {
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total,
        pageData:{pageNum:data.data.data.pageNum+1}
      })
      me.spHeight();
    })
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
toComment: function (e) {
  let me = this;
  if (e.currentTarget.dataset.item.fromUid == me.data.userid) {
    e.currentTarget.dataset.item.send1 = '回复@我:'
  }
  else {
    e.currentTarget.dataset.item.send1 = '回复@' + e.currentTarget.dataset.item.send + ':'
  }
  me.setData({
    avaShowList: e.currentTarget.dataset.item,
    avaShow1: true
  })
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
fan(e){
  let me=this;
  var index =e.currentTarget.dataset.index;
  let follow = e.currentTarget.dataset.item.isFollow == 1 ? 0 : 1;
  app.wxRequest('post', '/follow/follow/'+e.currentTarget.dataset.item.userId, {}, function (data) {
    me.data.list[index].isFollow=follow;
    me.setData({
      list:me.data.list
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
toMy:function(e){
  var bean=  e.currentTarget.dataset.bean
  wx.navigateTo({
    url: '/pages/pyq/mine/mine?userId='+bean.userId
  })
},

addSc: function (e) {
  let me = this;
  var index = e.currentTarget.dataset.index;
  let support = e.currentTarget.dataset.item.isSupport == 1 ? 0 : 1;
  var dynamicId = e.currentTarget.dataset.item.dynamicId;
  var toId = e.currentTarget.dataset.item.userId;
  app.wxRequest('get', '/support/' + toId + '/' + dynamicId + '/' + support, {}, function (data) {
    // me.getList();
     me.data.list[index].isSupport=support;
     if(support==0){
              me.data.list[index].supportUsersIcon.splice(me.data.list[index].supportUsersIcon.length-1,1)
     }else{
        me.data.list[index].supportUsersIcon.push({supportUsersIcon:null,sid:""})
     }
    me.setData({
      list:me.data.list
      })
    // me.setData
  })
},
comment: function (e) {
  let me = this;
  me.setData({
    userid: e.currentTarget.dataset.item.userId,
    commentId: e.currentTarget.dataset.item.dynamicId,
    commentCount: e.currentTarget.dataset.item.commentCount
  })
  me.getComment(e.currentTarget.dataset.item.dynamicId);
},
getComment: function (id) {
  let me = this;
  // https://eahost.lileiit.com/comment/{dynamicId}
  app.wxRequest('get', '/comment/' + id, {}, function (data) {

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
saveCommentBefore: function (e) {
  let me = this;
  let sta = e.currentTarget.dataset.sta;
  let arg = {};
  if (sta == 1) {//二级评论
    if(!me.data.commentInfo1){
      return;
    }
    arg.parentCommentId = me.data.avaShowList.commentId;
    arg.dynamicId = me.data.avaShowList.dynamicId;
    arg.toUid = me.data.avaShowList.fromUid;
    arg.content = me.data.commentInfo1;
  }
  else if (sta == 0) {//一级评论
    if(!me.data.commentInfo){
      return;
    }
    arg.parentCommentId = 0;
    arg.dynamicId = me.data.commentId;
    arg.toUid = me.data.userid;
    arg.content = me.data.commentInfo;
  }
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
      commentInfo: "",
      commentInfo1: ""
    })
    me.getComment(me.data.commentId)
         me.getList();
  })
},
onClose: function () {
  let me = this;
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
onChange: function (val) {
  let me = this;
  me.setData({
    commentInfo: val.detail
  })
},
onChange1: function (val) {
  let me = this;
  me.setData({
    commentInfo1: val.detail
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
    if(this.data.pages>=this.data.pageData.pageNum){
    this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})