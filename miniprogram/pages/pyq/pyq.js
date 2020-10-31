// pages/pyq/pyq.js
const app = getApp();
let meigeSP = [] //每个视频的距离顶部的高度
let distance = 0 //标记页面是向下还是向上滚动
let indexKey = 0 //标记当前滚动到那个视频了
Page({
  data: {
    activeTab: 0,
    active:0,
    avaShow: false,
    openFlag: false,
    commCount: 2,
    commentInfo: '',
    baseUrl: '',
    pageData: {
      pageNum: 1,
      pageSize: 100
    },
    ownpageData: {
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
    list: [],
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
    statusBarHeight:0
  },
  //获取每个视频的距离顶部的高度
  spHeight() {
    //微信api获取节点
    let query = wx.createSelectorQuery();
    query.selectAll('.shipin-list').boundingClientRect() //每个视频的高度
    query.exec((rect) => {
      rect[0].forEach(item => {
        console.log(item)
        meigeSP.push(item.top)
      })
      console.log(meigeSP)
      meigeSP.splice(0,1)
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
  saveCommentBefore: function (e) {
    let me = this;
    let sta = e.currentTarget.dataset.sta;
    let arg = {};
    if (sta == 1) {
      arg.parentCommentId = me.data.avaShowList.commentId;
      arg.dynamicId = me.data.avaShowList.dynamicId;
      arg.toUid = me.data.avaShowList.fromUid;
      arg.content = me.data.commentInfo1;
    }
    else if (sta == 0) {
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
      me.setData({
        avaShow1: false,
        commentInfo: "",
        commentInfo1: ""
      })
      me.getComment(me.data.commentId)
      me.getList();
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
  changeAcitve: function (e) {
    let me = this;
    me.setData({
      active: e.currentTarget.dataset.id
    })
    me.getActiveList(me.data.active);
  },
  getActiveList: function (active) {
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
  del: function (e) {
    let id = e.currentTarget.dataset.item.dynamicId;
    let me = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该动态吗',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest('delete', '/dynamic/' + id, {}, function (data) {
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
  toFb: function () {
    wx.navigateTo({
      url: '/pages/pyq/commit/commit'
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
  getList: function () {
    let me = this;
    app.wxRequest('get', '/dynamic/dynamicList' + '/' + me.data.pageData.pageNum + '/' + me.data.pageData.pageSize+"/all", {},function(data){
      let count = 0;
      for(let i=0;i<data.data.data.list.length;i++){
        if (data.data.data.list[i].videoType=='1'){
          data.data.data.list[i].videoindex=count;
          ++count;
        }
      }
      me.setData({
        list: data.data.data.list,
        total: data.data.data.total
      })
      console.log(data.data.data.list[0]);
      me.spHeight();
    })
  },
  getMore: function () {
    let me = this;
    let list = "pageData.pageNum";
    if (me.data.list.length >= me.data.pageData.pageSize) {
      me.setData({
        [list]: ++me.data.pageData.pageNum
      })
      me.getList();
    }
    else {
      me.setData({
        infoShow: true
      })
    }
  },
  getOwnList: function () {
    let me = this;
    app.wxRequest('get', '/dynamic/user/dynamicList' + '/' + me.data.ownpageData.pageNum + '/' + me.data.ownpageData.pageSize, {}, function (data) {
      let arr = [];
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  getLikeList: function () {
    let me = this;
    app.wxRequest('get', '/support/dynamicList/' + me.data.likeData.pageNum + '/' + me.data.likeData.pageSize, {}, function (data) {
      let arr = [];
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  getLoc: function () {
    let that = this;
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
  getCityList: function (area) {
    let me = this;
    app.wxRequest('get', '/dynamic/dynamicList/' + me.data.cityData.pageNum + '/' + me.data.cityData.pageSize + '/' + area, {}, function (data) {
      let arr = [];
      me.setData({
        list: me.data.list.concat(data.data.data.list),
        total: data.data.data.total
      })
    })
  },
  addSc: function (e) {
    let me = this;
    console.log("123");
    let support = e.currentTarget.dataset.item.isSupport == 1 ? 0 : 1;
    var dynamicId = e.currentTarget.dataset.item.dynamicId;
    var toId = e.currentTarget.dataset.item.userId;
    app.wxRequest('get', '/support/' + toId + '/' + dynamicId + '/' + support, {}, function (data) {
      me.getList();
    })
  },
  //页面滚动触发
  // onPageScroll(event) {
  //   let scrollTop = event.scrollTop //页面滚动
  //   console.log(scrollTop)
  //   if (scrollTop >= meigeSP[0] * 0.5) {
  //     indexKey = 0
  //     this.setData({ _index: indexKey })
  //   }
  //   if (scrollTop >= distance) { //页面向上滚动indexKey
  //     // console.log(scrollTop);
  //     console.log(meigeSP[indexKey] * 0.5)
  //     if (indexKey + 1 < meigeSP.length && scrollTop >= meigeSP[indexKey] * 0.5) {
  //       this.setData({ _index: indexKey + 1 })
  //       indexKey += 1
  //       console.log("indexKey", indexKey)
  //     }
  //   } else { //页面向下滚动
  //     if (distance - scrollTop < 15) { //每次滚动的距离小于15时不改变  减少setData的次数
  //       return
  //     }
  //     if (indexKey - 1 > 0 && scrollTop < meigeSP[indexKey - 1]) {
  //       indexKey -= 1
  //       this.setData({ _index: indexKey })
  //     }
  //   }
  //   distance = scrollTop
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
    me.setData({
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
    //选择id
    var that = this;
    this.setData({
     _index:null
    })
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
    let me = this;
    let list = "pageData.pageNum";
    if (me.data.pageData.pageNum > 1) {
      me.setData({
        [list]: --me.data.pageData.pageNum
      })
    }
    else {
      me.setData({
        [list]: 1
      })
    }
    me.getList();
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: '/pages/pyq/search/search?id=1',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})