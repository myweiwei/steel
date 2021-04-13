//app.js
App({
  globalData:{
    userId:'',
   baseUrl: 'https://eahost.lileiit.com/',
    // baseUrl: 'http://localhost:8080/',
    token:"",
    headerHeight: 0,
    statusBarHeight: 0,
  },
  onLaunch: function () {
    let me=this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
      me.getUser(function(){});
      const { model, system, statusBarHeight } = wx.getSystemInfoSync()
      let headHeight
      if (/iphone\s{0,}x/i.test(model)) {
        headHeight = 88
      } else if (system.indexOf('Android') !== -1) {
        headHeight = 68
      } else {
        headHeight = 64
      }
      this.globalData.headerHeight = headHeight
      this.globalData.statusBarHeight = statusBarHeight+3
    }
  },
  getUser: function (callback){
    let me=this;
    wx.login({
      success(res) {
        if (res.code) {
          //通过wx.login内置函数，得到临时code码
          wx.request({
            url: me.globalData.baseUrl + '/personal/login/' + res.code,
            method: "get",
            data: {
            },
            success: function (data) {
              me.globalData.token= data.data.data;
              me. getUserInfo();
              callback(me.globalData.token);
            },
            error: function (err) {
            }
          })
        } else {
        }
      }
    });
  },
  getUserInfo: function () {
    let me = this;
    me.wxRequest('get', 
    '/personal/user',
    {},
    function(data){
      me.globalData.userId=data.data.data.userId;
      me.globalData.userIcon=data.data.data.headIcon;
      console.log(data.data.data.userId)
      console.log(data.data.data.headIcon)
    })
  },
  // wxRequestFrom( url,header, data, callback, callback1,errFun) {

  // },
  wxRequest(method, url, data, callback, callback1,errFun) {
    let me = this;
   var header={};
    header.Authorization=me.globalData.token;
    me.wxRequestFrom(method, url,header, data, callback, callback1,errFun)
  },
  wxRequestFrom(method, url,header, data, callback, callback1,errFun) {
    let me = this;
    header.Authorization=me.globalData.token;
    wx.request({
      url: me.globalData.baseUrl+url,
      method: method,
      data: data,
      processData: false, //因为data值是FormData对象，不需要对数据做处理。
      header: header,
      dataType: 'json',
      success: function (res) {
        if(res.data.status==200){
          callback(res);
        }
        else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          if (callback1){
            setTimeout(function () {
              callback1(res)
            }, 2000)
          }
        }
      },
      fail: function (err) {
        //errFun(err);
        wx.showToast({
          title: "服务器异常，请稍后再试",
          icon: 'none'
        })
      }
    })
  },
  onShareAppMessage: function (e) {
    // return {
    //   title: '分享标题',
    //   path: "pages/pyq/pyq",
    //   imageUrl: '/images/home.png',
    //   success: (res) => {
    //     // 分享成功
    //   },
    //   fail: (res) => {
    //     // 分享失败
    //   }
    // }
  },
  
})
