const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meId:'',
    meIcon:'',
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
    _index:null,
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
  longPress: function (e) {
    let me = this;
    if (me.data.userid == e.currentTarget.dataset.item1.fromUid) {
      wx.showModal({
        title: '提示',
        content: '确认删除该条评论吗',
        success: function (res) {
          if (res.confirm) {
            app.wxRequest('DELETE', '/comment/' + e.currentTarget.dataset.item1.commentId, {}, function (data) {
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
        me.initData();
      }
      else {
        app.getUser(me.initData);
      }
  },
  initData:function(){
    var me=this;
    me.getUserInfo();
    me.grtCount();
    me.getList();
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

      if(me.data.pageData.pageNum>1){//判断是否分页
        me.setData({
          list: me.data.list.concat(data.data.data.list),
          total: data.data.data.total
        })
      }else{
          me.setData({
            list: data.data.data.list,
        total: data.data.data.total
      })
      }
      // me.spHeight();

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

  if (e.currentTarget.dataset.item.fromUid == app.globalData.userId) {
    return;
    // e.currentTarget.dataset.item.send1 = '回复@我:'
  }
  else {
    e.currentTarget.dataset.item.send1 = '回复@' + e.currentTarget.dataset.item.send + ':'
  }
  me.setData({
    avaShowList: e.currentTarget.dataset.item,
    avaShow1: true
  })
},
toComment1: function (e) {
  let me = this;
// console.log(e.currentTarget.dataset.itemName)
// console.log(e.currentTarget.dataset.item)
// console.log(e.currentTarget.dataset.item1)
  if (e.currentTarget.dataset.item.fromUid == app.globalData.userId) {
    return;
  }
  else {
    e.currentTarget.dataset.item.send1 = '回复@' + e.currentTarget.dataset.item.send + ':'
  }
  e.currentTarget.dataset.item.commentId=e.currentTarget.dataset.item1.commentId;
  me.setData({
    avaShowList: e.currentTarget.dataset.item,
    avaShow1: true
  })
},
videoStop(){
  let me=this;
      //停止正在播放的视频
      if(me.data._index){
       this.videoContextPrev = wx.createVideoContext(me.data._index)
       this.videoContextPrev.stop();
       this.setData({ //让video组件显示出来，不然点击时没有效果
        _index:null
      })
      }
},
  //播放按钮点击时触发触发
  videoPlay(e) {
    let me=this;
    me.videoStop();
    let indexId = e.currentTarget.dataset.id
     me.data._index="list"+ indexId
     console.log(me.data._index)
// console.log(indexId)
this.setData({ //让video组件显示出来，不然点击时没有效果
  _index:me.data._index
})
this.videoContextPrev = wx.createVideoContext(me.data._index)

    setTimeout(() => {
      //将点击视频进行播放
      // let videoContext = wx.createVideoContext(_index)
      this.videoContextPrev.play();
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
  let uId=e.currentTarget.dataset.item.userId;
  let follow = e.currentTarget.dataset.item.isFollow == 1 ? 0 : 1;
  app.wxRequest('post', '/follow/follow/'+e.currentTarget.dataset.item.userId, {}, function (data) {
    // me.data.list[index].isFollow=follow;
    me.replaceListItem(me.data.list,uId,follow);
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
    // var pages = getCurrentPages(); // 获取页面栈
    // var prevPage = pages[pages.length - 2]; // 上一个页面
    // prevPage.setData({
    //  backData:{}
    // })
  })
},
    /**
     * 遍历集合替换 关注
     * @param {*} array 
     * @param {*} id 
     * @param {*} data 
     */
    replaceListItem: function(array,id,follow){
      let me=this;
      for (var i = 0; i < array.length; i++) {
        if (array[i].userId == id){
          array[i].isFollow=follow;
        }
      }
      return -1; 
    },
toMy:function(e){
  var bean=  e.currentTarget.dataset.bean
  wx.navigateTo({
    url: '/pages/pyq/mine/mine?userId='+bean.userId
  })
},
// toPycItemInfo:function(e){
//   wx.navigateTo({
//     url: '/pages/pyq/pyqItemInfo/pyqItemInfo'
//   })
// },
toPycItemInfo:function(e){
  let item = e.currentTarget.dataset.bean;
  console.log(item)
  wx.navigateTo({
    url: '/pages/pyq/pyqItemInfo/pyqItemInfo?dynamicId='+item.dynamicId
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
      me.data.list[index].supportCount=me.data.list[index].supportCount-1;
      me.removeListItem(me.data.list[index].supportUsersIcon,me.data.meId);
     }else{
      me.data.list[index].supportCount=me.data.list[index].supportCount+1;
      me.data.list[index].supportUsersIcon.push({supportUsersIcon:me.data.meIcon,sid:me.data.meId})
     }
    me.setData({
      list:me.data.list
      })
      // var pages = getCurrentPages(); // 获取页面栈
      // var prevPage = pages[pages.length - 2]; // 上一个页面
      // prevPage.setData({
      //  backData:{}
      // })
    // me.setData
  })
},
getUserInfo: function () {
  let me = this;
  app.wxRequest('get', 
  '/personal/user',
  {},
  function(data){
    me.setData({
      meId:data.data.data.userId,
      meIcon:data.data.data.headIcon,
    })
    console.log(data.data.data.userId)
    console.log(data.data.data.headIcon)
  })
},
removeListItem: function(array,val){
  for (var i = 0; i < array.length; i++) {
    if (array[i].sid == val){
      array.splice(i, 1);
    }
  }
  return -1; 
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
  onShareAppMessage: function (options) {
    　// 来自页面内的按钮的转发
    　　if( options.from == 'button' ){
      this.onClose2();
      const title=this.data.currentdynamic.dynamicTitle;
       const dynamicId='dynamicId='+this.data.currentdynamic.dynamicId;
        return {
          title: title,//todo
          // imageUrl: 'xx.jpg',
          // query: 'dynamicId='+this.data.currentdynamic.dynamicId,
          // query: dynamicId,
          path: '/pages/pyq/pyqItemInfo/pyqItemInfo?'+dynamicId
        }
        options.target
      }
  }
})