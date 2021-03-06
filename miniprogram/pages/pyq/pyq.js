// pages/pyq/pyq.js
const app = getApp();
// let meigeSP = [] //每个视频的距离顶部的高度
// let distance = 0 //标记页面是向下还是向上滚动
// let indexKey = 0 //标记当前滚动到那个视频了
Page({
  data: {
    meId:'',
    meIcon:'',
    active:0,
    // btmShow:false,
    avaShow: false,
    openFlag: false,
    commCount: 2,
    commentInfo: '',
    tabTitle:'推荐',
    baseUrl: '',
    tabPage:0,
    pageDataFollow: {//关注 分页
      hasNextPage:true,
      pageNum: 1,
      pageSize: 10
    },
    cityData: {//同城 分页
      hasNextPage:true,
      pageNum: 1,
      pageSize: 10
    },
    pageDataPopular: {//最热 分页
      hasNextPage:true,
      pageNum: 1,
      pageSize: 10
    },
    pageDataRecommend: {//推荐 分页
      hasNextPage:true,
      pageNum: 1,
      pageSize: 10
    },
    ownpageData: {
      pageNum: 1,
      pageSize: 3
    },
    likeData: {
      pageNum: 1,
      pageSize: 3
    },
    followList:[], //关注
    popularList:[], //最热
    cityList:[], //同城
    recommendList:[], //推荐
    total: 0,
    commonList: [],
    avaShow1: false,
    avaShowList: {},
    commentInfo1: "",
    userid: "",
    commentId: "",
    commentCount: 0,
    unGeo: '',
    info: "已经到底啦",
    infoShow: false,
    _index:null,
    statusBarHeight:0,
    ownOther:false, //自己发的更多弹框
    columns:['删除','转发'],
    backData:null,
    currentdynamic:{},
    isLoadingMore:false //是否处于上拉加载中
  },
  showOwnOther(e){
     let item=e.currentTarget.dataset.item;
    //  if(item.isOwn==1){
    //   wx.showActionSheet({
    //     itemList: ['转发', '删除'],
    //     success (res) {
    //       console.log(res.tapIndex)
    //       if(res.tapIndex==0){
    //       this.onShareAppMessage();
    //       }else if(res.tapIndex==1){
    //           this.del(e);
    //       }
    //     },
    //     fail (res) {
    //       console.log(res.errMsg)
    //     }
    //   })
    //  }else{
    //   wx.showActionSheet({
    //     itemList: ['转发', '投诉'],
    //     success (res) {
    //       console.log(res.tapIndex)
    //       if(res.tapIndex==0){
    //         wx.onShareAppMessage(() => {
    //           return {
    //             title: '转发标题',
    //             imageUrl: '' // 图片 URL
    //           }
    //         })
    //       }else if(res.tapIndex==1){
            
    //       }
    //     },
    //     fail (res) {
    //       console.log(res.errMsg)
    //     }
    //   })
    //  }


    // let item=e.currentTarget.dataset.item;
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
  onConfirm(val){
    console.log(val)
  },
  preventTouchMove(){

  },
  
  fan(e){
    let me=this;
    var index =e.currentTarget.dataset.index;
    let follow = e.currentTarget.dataset.item.isFollow == 1 ? 0 : 1;
    console.log(e.currentTarget.dataset.item.userId);
    let uId=e.currentTarget.dataset.item.userId;
    app.wxRequest('post', '/follow/follow/'+e.currentTarget.dataset.item.userId, {}, function (data) {

      if(me.data.tabTitle=="最热"){
        me.replaceListItem(me.data.popularList,uId,follow);
        // me.data.popularList[index].isFollow=follow;
        me.setData({
          popularList:me.data.popularList
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
    }else if(me.data.tabTitle=="同城"){
      me.replaceListItem(me.data.cityList,uId,follow);
      // me.data.cityList[index].isFollow=follow;
      me.setData({
        cityList:me.data.cityList
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
    }else if(me.data.tabTitle=="关注"){
      me.initData();
      // me.data.followList[index].isFollow=follow;
      // me.setData({
      //   followList:me.data.followList
      //   })
      // if (data.data.data == '已关注' || data.data.data == '互相关注') {
      //   wx.showToast({
      //     title: "已关注",
      //     icon: 'none'
      //   })
      // }
      // else if (data.data.data == '关注' || data.data.data == '回关') {
      //   wx.showToast({
      //     title: "已取消关注",
      //     icon: 'none'
      //   })
      // }
    }else if(me.data.tabTitle=="推荐"){
      me.replaceListItem(me.data.recommendList,uId,follow);
      // me.data.recommendList[index].isFollow=follow;
      me.setData({
        recommendList:me.data.recommendList
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

    }
    })
  },
  toMe:function(e){
    wx.navigateTo({
      url: '/pages/pyq/mine/mine?userId='+0+"&userName="+"&headIcon="+escape(this.data.meIcon)
    })
  },
  toPycItemInfo:function(e){
    let item = e.currentTarget.dataset.bean;
    console.log(item)
    wx.navigateTo({
      url: '/pages/pyq/pyqItemInfo/pyqItemInfo?dynamicId='+item.dynamicId
    })
  },
  toMy:function(e){
    var bean=  e.currentTarget.dataset.bean
    console.log('item: ', bean)
    wx.navigateTo({
      url: '/pages/pyq/mine/mine?userId='+bean.userId+"&userName="+bean.nickName+'&headIcon='+escape(bean.headIcon)
    })
  },
  //获取每个视频的距离顶部的高度
  // spHeight() {
  //   //微信api获取节点
  //   let query = wx.createSelectorQuery();
  //   query.selectAll('.shipin-list').boundingClientRect() //每个视频的高度
  //   query.exec((rect) => {
  //     rect[0].forEach(item => {
  //       console.log(item)
  //       meigeSP.push(item.top)
  //     })
  //     console.log(meigeSP)
  //     meigeSP.splice(0,1)
  //   })
    
  // },
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
    if(me.data.tabTitle=="最热"){
      me.data._index="zr"+ indexId
     }else if(me.data.tabTitle=="同城"){
       //  me.getCityList(me.unGeo);
       me.data._index="tc"+ indexId
     }else if(me.data.tabTitle=="关注"){
      me.data._index="gz"+ indexId
     }else if(me.data.tabTitle=="推荐"){
      me.data._index="tj"+ indexId
     }
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
  saveCommentBefore: function (e) {
    let me = this;
    let sta = e.currentTarget.dataset.sta;
    let arg = {};
    console.log(me.data.userid)
    console.log(sta)
    if (sta == 1) {//二级评论
      if(!me.data.commentInfo1){
        return;
      }
      arg.parentCommentId = me.data.avaShowList.commentId;
      arg.dynamicId = me.data.avaShowList.dynamicId;
      arg.toUid = me.data.avaShowList.fromUid;
      arg.content = me.data.commentInfo1;
      console.log(arg.parentCommentId+"  "+arg.dynamicId+"   "+arg.toUid)
    }
    else if (sta == 0) {//一级评论
      if(!me.data.commentInfo){//296  187   166
        return;
      }
      arg.parentCommentId = 0;
      arg.dynamicId = me.data.commentId;
      arg.toUid = me.data.userid;
      arg.content = me.data.commentInfo;
      console.log(arg.dynamicId+"  "+arg.toUid+"   "+arg.content)
    }
    me.saveComment(arg);
  },
  saveComment: function (arg) {
    console.log("---------------------"+arg)
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
      console.log(me.data.tabTitle);
      me.initData();

   
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
  /**
   * tab切换监听
   */
  onChangeTab: function (val) {
    let me = this;
    console.log(val)
    me.setData({
      tabTitle:val.detail.title,
      tabActive:val.detail.index
    })
    me.videoStop();
    me.initData('cut');
  },
  onChange: function (val) {
    let me = this;
    console.log(val)
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

  del: function (e) {
    let id = e.currentTarget.dataset.item.dynamicId;
    let me = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该动态吗',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest('delete', '/dynamic/' + id, {}, function (data) {
            me.setData({
              ownOther:true
            })
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            me.initData();
          })
        } else {
        }
      }
    })
  },
  toFb: function () {
    wx.navigateTo({
      url: '/pages/pyq/commit/commit'
    })
  },
  
  commentTongchen: function (e) {
    let me = this;
    me.setData({
      userid: e.currentTarget.dataset.item.userId,
      commentId: e.currentTarget.dataset.item.dynamicId,
      commentCount: e.currentTarget.dataset.item.commentCount
    })
    me.getComment(e.currentTarget.dataset.item.dynamicId);
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
   * 最热
   */
  getPopularList: function () {
    let me = this;
    app.wxRequest('get', 
    '/dynamic/dynamicList?pageNum='+me.data.pageDataPopular.pageNum+'&pageSize='+me.data.pageDataPopular.pageSize+'&hot=1',
    {},
    function(data){
      // let count = 0;
      // for(let i=0;i<data.data.data.list.length;i++){
      //   if (data.data.data.list[i].videoType=='1'){
      //     data.data.data.list[i].videoindex=count;
      //     ++count;
      //   }
      // }
      wx.nextTick(() => {
        if(me.data.pageDataPopular.pageNum>1){
          me.setData({
            popularList: me.data.popularList.concat(data.data.data.list),
            total: data.data.data.total
          })
        }else{
            me.setData({
          popularList: data.data.data.list,
          total: data.data.data.total
        })
        }
      
        // me.spHeight();
      })
      me.setData({
        isLoadingMore:false
        })
      // me.setData({
      //   list: data.data.data.list,
      //   total: data.data.data.total
      // })
    })
  },
  getMore: function () {
    var me=this;
    if(me.data.isLoadingMore){//加载中
      console.log("加载中...")
      return;
    }
    me.setData({
    isLoadingMore:true
    })
    if(me.data.tabTitle=="最热"){
      let list = "pageDataPopular.pageNum";
      if (me.data.pageDataPopular.hasNextPage) { 
        me.setData({
          [list]: ++me.data.pageDataPopular.pageNum
        })
        me.getPopularList();
      }
      else {
        me.setData({
          infoShow: true
        })
      }
     }else if(me.data.tabTitle=="同城"){//
      let list = "cityData.pageNum";
      if (me.data.cityData.hasNextPage) {
        me.setData({
          [list]: ++me.data.cityData.pageNum
        })
        me.getCityList(me.data.unGeo);
      }
      else {
        me.setData({
          infoShow: true
        })
      }
     }else if(me.data.tabTitle=="关注"){
      let list = "pageDataFollow.pageNum";
      if (me.data.pageDataFollow.hasNextPage) {
        me.setData({
          [list]: ++me.data.pageDataFollow.pageNum
        })
        me.getfollowList();
      }
      else {
        me.setData({
          infoShow: true
        })
      }

     }else if(me.data.tabTitle=="推荐"){//
      let list = "pageDataRecommend.pageNum";
      if (me.data.pageDataRecommend.hasNextPage) {
        me.setData({
          [list]: ++me.data.pageDataRecommend.pageNum
        })
        me.getRecommendList();
      }
      else {
        me.setData({
          infoShow: true
        })
      }
    
     }

  },
  getOwnList: function () {
    let me = this;
    app.wxRequest('get', '/dynamic/user/dynamicList' + '/' + me.data.ownpageData.pageNum + '/' + me.data.ownpageData.pageSize, {}, function (data) {
      let arr = [];
      me.setData({
        popularList: me.data.popularList.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  getLikeList: function () {
    let me = this;
    app.wxRequest('get', '/support/dynamicList/' + me.data.likeData.pageNum + '/' + me.data.likeData.pageSize, {}, function (data) {
      let arr = [];
      me.setData({
        popularList: me.data.popularList.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },

  getLoc: function () {
    let that = this;
    // wx.showLoading({  
    // title: '正在加载...',
    // mask:true});
    wx.getLocation({
      success: function (res) {
        const url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=FTqHSN5H275UH2yIbPnMlE7qHBnb7etT&output=json&coordtype=wgs84ll&location=${res.latitude},${res.longitude}`;
        const ak = 'FTqHSN5H275UH2yIbPnMlE7qHBnb7etT';
        //小程序的ajax请求需要在后台安全域名配置增加 开发测试中在详情里勾选-不校验合法域名即可
        wx.request({
          url,
          data: {},
          success: function (res) {
            // wx.hideLoading()
            if (res.data.status == "0") {
              that.setData({
                unGeo: res.data.result.addressComponent.city
              });
          
              console.log(res.data.result.addressComponent.city)
             that.getCityList(res.data.result.addressComponent.city);   
            } else {
              that.setData({
                unGeo: '未知位置',
              });
            }
          },
              fail (res) {
                // wx.hideLoading();
                console.log(res)
              }
        })
      }
    })
  },
  /**
   * 关注
   */
  getfollowList: function (area) {
    let me = this;
    app.wxRequest('get', 
    '/dynamic/dynamicList?pageNum='+me.data.pageDataFollow.pageNum+'&pageSize='+me.data.pageDataFollow.pageSize+'&follow='+1,
    {}, function(data){
  
      console.log("-----------------------")
      console.log(data.data.data)
      // let count = 0;
      // for(let i=0;i<data.data.data.list.length;i++){
      //   if (data.data.data.list[i].videoType=='1'){
      //     data.data.data.list[i].videoindex=count;
      //     ++count;
      //   }
      // }
      wx.nextTick(() => {
        if(me.data.pageDataFollow.pageNum>1){//判断是否分页
          me.setData({
            followList: me.data.followList.concat(data.data.data.list),
            total: data.data.data.total
          })
        }else{
          me.setData({
            followList: data.data.data.list,
            total: data.data.data.total
          })
        }
        // me.spHeight();
      })
      me.setData({
        isLoadingMore:false
        })
      // me.setData({
      //   cityList: data.data.data.list,
      //   total: data.data.data.total
      // })
    })
  },
  /**
   * 同城数据
   */
  getCityList: function (area) {
    let me = this;
    console.log(area)
    app.wxRequest('get', 
    '/dynamic/dynamicList?pageNum='+me.data.cityData.pageNum+'&pageSize='+me.data.cityData.pageSize+'&area='+area,
    {}, function(data){
  
      console.log("-----------------------")
      console.log(data.data.data)
      // let count = 0;
      // for(let i=0;i<data.data.data.list.length;i++){
      //   if (data.data.data.list[i].videoType=='1'){
      //     data.data.data.list[i].videoindex=count;
      //     ++count;
      //   }
      // }
      wx.nextTick(() => {
        if(me.data.cityData.pageNum>1){//判断是否分页
          me.setData({
            cityList: me.data.cityList.concat(data.data.data.list),
            total: data.data.data.total
          })
        }else{
            me.setData({
              cityList: data.data.data.list,
          total: data.data.data.total
        })
        }
        // me.spHeight();
      })
      me.setData({
        isLoadingMore:false
        })


    })
  },
    /**
   * 推荐
   */
  getRecommendList: function (area) {
    let me = this;
    console.log(me.data.pageDataRecommend.pageSize)
    app.wxRequest('get', 
    '/dynamic/dynamicList?pageNum='+me.data.pageDataRecommend.pageNum+'&pageSize='+me.data.pageDataRecommend.pageSize,
    {}, function(data){//
  
      console.log("-----------------------")
      console.log(data.data.data)
      // let count = 0;
      // for(let i=0;i<data.data.data.list.length;i++){
      //   if (data.data.data.list[i].videoType=='1'){
      //     data.data.data.list[i].videoindex=count;
      //     ++count;
      //   }
      // }
      wx.nextTick(() => {
        if(me.data.pageDataRecommend.pageNum>1){//判断是否分页
        me.setData({
          recommendList: me.data.recommendList.concat(data.data.data.list),
          total: data.data.data.total
        })
      }else{
        me.setData({
          recommendList: data.data.data.list,
          total: data.data.data.total
        })
      }
        // me.spHeight();
      })
      me.setData({
        isLoadingMore:false
        })
      // me.setData({
      //   cityList: data.data.data.list,
      //   total: data.data.data.total
      // })
    })
  },

  /**
   * 遍历删除
   * @param {*} array 
   * @param {*} val 
   */
   removeListItem: function(array,val){
      for (var i = 0; i < array.length; i++) {
        if (array[i].sid == val){
          array.splice(i, 1);
        }
      }
      return -1; 
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
  addSc: function (e) {
    let me = this;
    console.log("123");
    wx.showLoading({mask:true});
    var index = e.currentTarget.dataset.index;
    let support = e.currentTarget.dataset.item.isSupport == 1 ? 0 : 1;
    var dynamicId = e.currentTarget.dataset.item.dynamicId;
    var toId = e.currentTarget.dataset.item.userId;
    app.wxRequest('get', '/support/' + toId + '/' + dynamicId + '/' + support, {}, function (data) {
        if(me.data.tabTitle=="最热"){
          me.data.popularList[index].isSupport=support;
          if(support==0){
            me.data.popularList[index].supportCount=me.data.popularList[index].supportCount-1;
           me.removeListItem(me.data.popularList[index].supportUsersIcon,app.globalData.userId);
                   // me.data.popularList[index].supportUsersIcon.splice(me.data.popularList[index].supportUsersIcon.length-1,1)
          }else{
            me.data.popularList[index].supportCount=me.data.popularList[index].supportCount+1;
            me.data.popularList[index].supportUsersIcon.push({supportUsersIcon:app.globalData.userIcon,sid:app.globalData.userId})
             // me.data.popularList[index].supportUsersIcon.splice(0,0,{supportUsersIcon:app.globalData.userIcon,sid:app.globalData.userId})
          }
         me.setData({
           popularList:me.data.popularList
           })
      }else if(me.data.tabTitle=="同城"){
        me.data.cityList[index].isSupport=support;
        if(support==0){
         me.data.cityList[index].supportCount=me.data.cityList[index].supportCount-1;
         me.removeListItem(me.data.cityList[index].supportUsersIcon,app.globalData.userId);
                 // me.data.cityList[index].supportUsersIcon.splice(me.data.cityList[index].supportUsersIcon.length-1,1)
        }else{
         me.data.cityList[index].supportCount=me.data.cityList[index].supportCount+1;
           me.data.cityList[index].supportUsersIcon.push({supportUsersIcon:app.globalData.userIcon,sid:app.globalData.userId})
           // me.data.cityList[index].supportUsersIcon.splice(0,0,{supportUsersIcon:app.globalData.userIcon,sid:app.globalData.userId})
        }
       me.setData({
         cityList:me.data.cityList
         })
      }else if(me.data.tabTitle=="关注"){
        me.data.followList[index].isSupport=support;
        if(support==0){
         me.data.followList[index].supportCount=me.data.followList[index].supportCount-1;
         me.removeListItem(me.data.followList[index].supportUsersIcon,app.globalData.userId);
               
        }else{
         me.data.followList[index].supportCount=me.data.followList[index].supportCount+1;
           me.data.followList[index].supportUsersIcon.push({supportUsersIcon:app.globalData.userIcon,sid:app.globalData.userId})
        }
       me.setData({
        followList:me.data.followList
         })
        
      }else if(me.data.tabTitle=="推荐"){
        me.data.recommendList[index].isSupport=support;
        if(support==0){
         me.data.recommendList[index].supportCount=me.data.recommendList[index].supportCount-1;
         me.removeListItem(me.data.recommendList[index].supportUsersIcon,app.globalData.userId);
        
        }else{
         me.data.recommendList[index].supportCount=me.data.recommendList[index].supportCount+1;
         me.data.recommendList[index].supportUsersIcon.push({supportUsersIcon:app.globalData.userIcon,sid:app.globalData.userId})
        }
       me.setData({
        recommendList:me.data.recommendList
         })
         
      }
      wx.hideLoading();
    })
  },
  //页面滚动触发
  // onPageScroll(event) {
  //   let scrollTop = event.scrollTop //页面滚动
  //   console.log(scrollTop);
  //   if (scrollTop >= 1000) {
  //     indexKey = 0
  //     this.setData({ _index: null })
  //   }
  //   // if (scrollTop >= distance) { //页面向上滚动indexKey
  //   //   console.log(scrollTop);
  //   //   if (indexKey + 1 < meigeSP.length && scrollTop >= meigeSP[indexKey]) {
  //   //     this.setData({ _index: indexKey + 1 })
  //   //     indexKey += 1
  //   //     console.log("indexKey", indexKey)
  //   //   }
  //   // } else { //页面向下滚动
  //   //   if (distance - scrollTop < 15) { //每次滚动的距离小于15时不改变  减少setData的次数
  //   //     return
  //   //   }
  //   //   if (indexKey - 1 > 0 && scrollTop < meigeSP[indexKey - 1]) {
  //   //     indexKey -= 1
  //   //     this.setData({ _index: indexKey })
  //   //     console.log("indexKey", indexKey)
  //   //   }
  //   // }
  //   // console.log(indexKey)
  //   // distance = scrollTop
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      meId: app.globalData.userId
    })
      
        this.setData({
         _index:null
        })
        that.setData({
          baseUrl: app.globalData.baseUrl
        })
        if(app.globalData.token!=''){
          that.initView();
        }
        else {
          app.getUser(that.initView);
        }


  },
  onRefreshDate:function(e){
         this.initData();
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
  initView:function(){
    var me=this;
    me.getUserInfo();
    me.getLoc();
    if(me.data.tabTitle=="最热"){
      me.getPopularList();
     }else if(me.data.tabTitle=="同城"){
        // me.getCityList(me.unGeo);
     }else if(me.data.tabTitle=="关注"){
         me.getfollowList();
     }else if(me.data.tabTitle=="推荐"){
         me.getRecommendList();
     }     
  
  },
initData: function(o){
  var me=this;
if(o=="cut"){
  me.setData({
    pageDataFollow: {//关注 分页
    hasNextPage:true,
    pageNum: 1,
    pageSize: 10
  },
  cityData: {//同城 分页
    hasNextPage:true,
    pageNum: 1,
    pageSize: 10
  },
  pageDataPopular: {//最热 分页
    hasNextPage:true,
    pageNum: 1,
    pageSize: 10
  },
  pageDataRecommend: {//推荐 分页
    hasNextPage:true,
    pageNum: 1,
    pageSize: 10
  },
  followList:[], //关注
  popularList:[], //最热
  cityList:[], //同城
  recommendList:[], //推荐
})
}
  if(me.data.tabTitle=="最热"){
    me.getPopularList();
   }else if(me.data.tabTitle=="同城"){
       me.getCityList(me.data.unGeo);
   }else if(me.data.tabTitle=="关注"){
       me.getfollowList();
   }else if(me.data.tabTitle=="推荐"){
       me.getRecommendList();
   }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("--------------------------onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("--------------------------show"+this.data.backData)
    if(!this.fristShow){
      this.fristShow=1;
      console.log("--------------------------show1")
      return;
    }
    this.initData();
    // if(this.data.backData!=null){
    //   this.onRefreshDate();
    //   this.data.backData=null;
    // }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("--------------------------onHide"+this.data.backData)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("--------------------------onUnload"+this.data.backData)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let me = this;
    console.log(me.data.tabTitle)
    console.log(me.data.unGeo)
    if(me.data.tabTitle=="最热"){
      let list = "pageDataPopular.pageNum";
      me.setData({
        [list]: 1
      })
    me.getPopularList();
    }else if(me.data.tabTitle=="同城"){
      let list = "cityData.pageNum";
      // if (me.data.cityData.pageNum > 1) {
      //  me.setData({
      //    [list]: --me.data.cityData.pageNum
      //  })
      // }
      // else {
        me.setData({
          [list]: 1
        })
    // } 
      me.getCityList(me.data.unGeo);
    }else if(me.data.tabTitle=="关注"){
      let list = "pageDataFollow.pageNum";
      me.setData({
        [list]: 1
      })
    me.getfollowList();
  }else if(me.data.tabTitle=="推荐"){
    let list = "pageDataRecommend.pageNum";
    me.setData({
      [list]: 1
    })
  me.getRecommendList();
  }

    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let me = this;
    me.getMore();
    // if (me.data.active == 1) {
    //   me.getMore();
    // }
    // else if (me.data.active == 4) {
    //   let list = "ownpageData.pageNum";
    //   if (me.data.list.length < me.data.total) {
    //     me.setData({
    //       [list]: ++me.data.ownpageData.pageNum
    //     })
    //     me.getOwnList();
    //   }
    // }
    // else if (me.data.active == 2) {
    //   let list = "cityData.pageNum";
    //   if (me.data.list.length < me.data.total) {
    //     me.setData({
    //       [list]: ++me.data.cityData.pageNum
    //     })
    //     me.getLoc();
    //   }
    // }
    // else if (me.data.active == 3) {
    //   let list = "likeData.pageNum";
    //   if (me.data.list.length < me.data.total) {
    //     me.setData({
    //       [list]: ++me.data.likeData.pageNum
    //     })
    //     me.getLikeList();
    //   }
    // }
    // else {
    //   me.setData({
    //     list: []
    //   })
    // }

  },

  /**
   * 用户点击右上角分享
   */























  onShareAppMessage(options) {

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