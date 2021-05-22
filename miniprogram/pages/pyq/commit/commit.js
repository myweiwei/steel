const qiniuUploader = require("../../../utils/qiniuUploader.js");
//index.js

// 初始化七牛相关参数
function initQiniu(token) {
  var options = {
    region: 'NCN', // 华北区
    uptoken: token,
    // uptokenURL: 'https://eahost.lileiit.com/personal/getUploadToken',
    // uptoken: 'xxxx',
    domain: 'http://ea.lileiit.com/'
  };
  qiniuUploader.init(options);
}
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth:'',
    dynamicTitle:'',
    province:'',
    addressName:'',
    city:"",
    fileList:[],
    fileList1:[],
    fileArr:[],
    count:0,
    focus:false,
    address:false,
    columns: [],
    columnList:[],
    dynamicType:'',
    show:false,
    videoType:0
  },
  addVideo:function(){
    let me=this;
    wx.chooseMedia({
      count: 1,//传一个
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,//可拍摄视频的长度。不能大于60秒
      camera: 'back',
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        //选中视频的长度
        var duration = res.tempFiles[0].duration;//秒
        var size = res.tempFiles[0].size;//字节
        var height = res.tempFiles[0].height;
        var width = res.tempFiles[0].width;
        var thumbTempFilePath = res.tempFiles[0].thumbTempFilePath;//封面图片
        var arg={};
        arg.thumbTempFilePath = res.tempFiles[0].thumbTempFilePath;
        arg.path =tempFilePath;
        let arr = [];
        arr.push(arg)
        me.setData({
          fileList1: arr,
          count: 1
        })
      }
    })
  
  },
  onChange:function(val){
    let me=this;
    me.setData({
      dynamicTitle: val.detail
    })
  },
  showPop(){
    let me=this;
    me.setData({
      show:true
    })
  },
  onClose:function(val){
    let me = this;
    me.setData({
      show: false
    })
  },
  onConfirm1:function(val){
    let me=this;
    console.log(val.detail)
    me.data.columnCode = me.data.columnList[val.detail.index].code;
    console.log(me.data.columnCode)
    me.setData({
      dynamicType: val.detail.value,
      // type: val.detail.value,
      show: false
    })
  },
  onTypeChange(val){
    let me=this;
    me.setData({
      dynamicType: val.detail.value
    })
  },
  afterRead(event) {
    let me=this;
    const { file } = event.detail;
    let arr=me.data.fileList.concat(file);
    me.setData({
      fileList:arr,
      count:1
    })
  },
  afterRead1(event) {
    let me=this;
    const { file } = event.detail;
    let arr=me.data.fileList1.concat(file);
    me.setData({
      fileList1:arr,
      count:1
    })
  },
  onOverSize(e){
    wx.showToast({
      title: '视频超出大小限制',
      icon: 'none',
      duration: 2000
    })
  },
  delVideo:function(){
    let me=this;
    wx.showModal({
      title: '提示',
      content: '确认删除该条视频吗',
      success(res) {
        if (res.confirm) {
          me.setData({
            fileList1: []
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  getDicsType: function () {
    let me = this;
    // https://eahost.lileiit.com/other/dics?type=DYNAMIC
    app.wxRequest('get', 
    '/other/dics',
    {type:"DYNAMIC"},
    function(data){
      for (var i = 0; i < data.data.data.length; i++) {
        me.data.columns.push(data.data.data[i].name);
    }
     console.log(me.data.columns)
      me.setData({
        columns: me.data.columns,
        columnList: data.data.data
      })
      console.log(data.data.data)
    })
  },
  delImg:function(e){
    let me = this;
    let index=e.detail.index;
    let arr = me.data.fileList;
    arr.splice(index,1);
    me.setData({
      fileList:arr,
    })
  },
  btnClick: function () {
    // 点击发送按钮事件
    this.setData({
      focus: true
    })
  },
  getLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocationFunc();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocationFunc();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocationFunc();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocationFunc: function () {
    let me = this;
    wx.chooseLocation({
      success(res) {
        
        me.setData({
          province: res.address+';'+res.name,
          addressName:res.name,
          address: true
        })
      },
      fail(err){
        console.log(err);
      }
    })
  },
  delAddress:function(){
    let me=this;
    me.setData({
      province:"",
      address:false
    })
  },
  send:function(){
    let me=this;
    let data={};
    data.dynamicTitle = me.data.dynamicTitle;
    data.code = me.data.code;
    data.dynamicType = me.data.columnCode;
    data.dynamicImgVideo = me.data.fileArr.join(';');
    data.dynamicArea = me.data.province;
    data.videoType = me.data.videoType;
    app.wxRequest('post', '/dynamic/dynamic', data, function (data) {
      console.log(data)
      if (data.statusCode==200){
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000,
          success: function () {
            me.setData({
              province:'',
              dynamicType:'',
              fileList:[],
              fileList1:[],
              fileArr:[],
              address:false,
              videoType:0,
              dynamicTitle:''
            })
            // wx.hideLoading()
            wx.switchTab({
              url: "/pages/pyq/pyq",
            })
          }
        })
      }
      else {
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 1000,
        })
      }
    })

  },
  uploadFiles: async function () {
    var me = this;
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    let data = {};
    data.dynamicTitle = me.data.dynamicTitle;
    data.dynamicType = me.data.dynamicType;
    //将保存的图片路径用来循环
    if (me.data.fileList != null) {
      var arr=[];
      let flag=0;
      if (me.data.fileList.length){
        me.setData({
          videoType:0
        })
        for (let i = 0; i < me.data.fileList.length; i++){
          if (i == me.data.fileList.length - 1) {
            flag = 1;
            console.log(flag)
          }
          console.log(i)
          await me.upFile(me.data.fileList[i].path, flag)
        }
      }else if (me.data.fileList1.length){
        me.setData({
          fileArr:[],
          videoType: 1
        })
        await me.upFile(me.data.fileList1[0].path, 1)
      }
      else {
        me.send(data);
      }
      
    } else {
      console.log("没有上传图片")
    }

  },
  upFile:function(path,i){
    
    // if (i){
    //   wx.showToast({
    //     title: '上传失败',
    //     icon: 'error',
    //     duration: 1000,
    //   })
    //   return;
    // }
    let me=this;
    // console.log(me.data.token)
    initQiniu(me.data.token);
    let arr=[];
    arr=me.data.fileArr;
     return new Promise((resolve,reject)=>{
      // 交给七牛上传
      qiniuUploader.upload(path, (res) => {
        console.log(res.imageURL)
        arr.push(res.imageURL);
        console.log(arr)
        me.setData({
          fileArr:arr
        })

        me.setData({
          'imageObject': res
        });
        console.log(me.data.imageObject);
        if (i == 1 ){
        me.send();
        }
        resolve('ok');
      }, (error) => {
        // console.log(err)
        reject();
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 1000,
        })
      });
     
    })

    // let arr=[];
    // arr=me.data.fileArr;
    // return new Promise((resolve,reject)=>{
    //   wx.uploadFile({
    //     url: app.globalData.baseUrl +'/dynamic/fileupload',
    //     filePath: path,
    //     name: 'file',
    //     formData: {
    //     },
    //     header: {
    //       "Content-Type": "multipart/form-data",
    //       'Authorization': app.globalData.token
    //     },
    //     success: function (res) {
    //       console.log(res.statusCode)
    //       if (i == 1 &&res.statusCode == 200){
    //         arr.push(JSON.parse(res.data).data);
    //         me.setData({
    //           fileArr:arr
    //         })
    //         me.send();
    //       }else{
    //         wx.showToast({
    //           title: '上传失败',
    //           icon: 'error',
    //           duration: 1000,
    //         })
    //       }
    //       resolve('ok');
    //     }, fail: function (err) {
    //       console.log(err)
    //       reject();
    //       wx.showToast({
    //         title: '上传失败',
    //         icon: 'error',
    //         duration: 1000,
    //       })
    //     }
    //   })
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getsize();
    this.getDicsType();
    this.getToken();
  },
  getToken: function () {
    let me = this;
    console.log("getTeacherInfo")
    // https://eahost.lileiit.com/teacherInfo
    app.wxRequest('get', 'personal/getUploadToken', {}, function (data) {
      // console.log(data.data.data)
      var token=data.data.data;
      me.setData({
        token:token
      })
    }, function (errData) {
      console.log(errData)
      // me.setData({
      // })
    })
  },
  getsize(){
    let that=this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowWidth:res.windowWidth
        })
      },
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
    var that = this;
    that.setData({
      baseUrl: app.globalData.baseUrl,
      focu: true,
      fileArr:[]
    })
    if (app.globalData.token == '') {
      app.getUser(function(){
        
      });
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