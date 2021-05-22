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
  data: {
    userInfo: {},
    fileList: [],
    fileListZp1: [],
    fileListZp2: [],
    fileListZp3: [],
    fileListZp4: [],
    realName: "",
    headIcon: '',
    idCardNumber: '',
    teacherJobPosition: "",
    teacherGoodAt: "",
    teacherDescription: '',
    videoSolvePrice: "",
    imgtxtSolvePrice: '',
    phoneNumber: "",
    smsCode: "",
    time: 125,
    interval: null,
    flag: true,
    steps: [
      {
        desc: '填写基本信息',
      },
      {
        desc: '上传作品',
      },
      {
        desc: '完成修改',
      },
    ],
    active: 0,
    twFlag: true,
    spFlag: true,
    teacherResourceList: []
  },
  prev() {
    this.setData({
      active: 0
    })
  },
  onCheckChange(val) {
    let type = val.currentTarget.dataset.type;
    if (type == 'tw') {
      this.setData({
        twFlag: val.detail
      })
    }
    if (type == 'sp') {
      this.setData({
        spFlag: val.detail
      })
    }
  },
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  next: function (e) {
    let me = this;
    //一代身份证
    var reg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
    var reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    var phonereg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
    if (!me.data.fileList.length) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
      return;
    }
    if (!me.data.realName) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    if (!me.data.idCardNumber || (!reg.test(me.data.idCardNumber) && !reg1.test(me.data.idCardNumber))) {
      wx.showToast({
        title: '请输入正确格式身份证号',
        icon: 'none'
      })
      return;
    }
    if (!me.data.teacherJobPosition) {
      wx.showToast({
        title: '请输入职位',
        icon: 'none'
      })
      return;
    }
    if (!me.data.teacherGoodAt) {
      wx.showToast({
        title: '请输入擅长领域',
        icon: 'none'
      })
      return;
    }
    if (!me.data.teacherDescription) {
      wx.showToast({
        title: '请输入描述',
        icon: 'none'
      })
      return;
    }
    if (!me.data.videoSolvePrice) {
      wx.showToast({
        title: '请输入电话咨询价格',
        icon: 'none'
      })
      return;
    }
    if (!me.data.phoneNumber || !phonereg.test(me.data.phoneNumber)) {
      wx.showToast({
        title: '请输入正确格式的手机号',
        icon: 'none'
      })
      return;
    }
    if (!me.data.smsCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    me.setData({
      active: e.currentTarget.dataset.index
    })
  },
  addPrice: function () {
    let me = this;
    app.wxRequest('post', '/recharge/recharge/59', {}, function (res) {
      wx.requestPayment(
        {
          timeStamp: res.data.data.data.timeStamp,
          nonceStr: res.data.data.data.nonceStr,
          package: res.data.data.data.package,
          signType: res.data.data.data.signType,
          paySign: res.data.data.data.paySign,
          success: function (res) {
            wx.showToast({
              title: '充值成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                me.setData({
                  active: 3
                })
              }
            })
          },
          fail: function (res) {
          },
          complete: function (res) { }
        })
    })
  },
  onChange: function (val) {
    let me = this;
    let label = val.target.dataset.name;
    console.log(label)
        console.log(label)
    me.setData({
      [label]: val.detail
    })
  },
  send: function () {
    let me = this;
    if (!me.data.phoneNumber) {
      wx.showToast({
        title: '请填写手机号码',
        icon: "none"
      })
      return;
    }
    app.wxRequest('get', '/getRegisterCode/' + me.data.phoneNumber, {}, function (data) {
      me.getTime();
    })
  },
  getTime() {
    let me = this;
    let interval = setInterval(function () {
      let arg = me.data.time;
      if (arg <= 0) {
        clearInterval(interval);
        me.setData({
          time: 0,
          flag: true
        })
      }
      else {
        arg--;
        me.setData({
          time: arg,
          flag: false
        })
      }
    }, 1000)
  },
  getTeacherInfo: function () {
    let me = this;
    console.log("getTeacherInfo")
    // https://eahost.lileiit.com/teacherInfo
    app.wxRequest('get', '/teacherInfo', {}, function (data) {
      // console.log(data.data.data)
      console.log(data.data)
      var data=data.data.data;

     me.data.fileList.push({url:data.headIcon, isImage: true});
     console.log(me.data)
     var fileListZp1=[data.teacherResourceList[0]];
     console.log(data.teacherResourceList[0])
     console.log(data.teacherResourceList[0]!=undefined)
     if (  data.teacherResourceList[0]!=undefined) {
    //  if(fileListZp1!=null){
      fileListZp1[0].url=fileListZp1[0].resource;
      fileListZp1[0].path=fileListZp1[0].resource;
      fileListZp1[0].type=fileListZp1[0].resourceType;
      var isvideo= fileListZp1[0].resourceType=="video";
      if(isvideo){
        fileListZp1[0].isVideo=true;
      }else{
        fileListZp1[0].isImage=true;
      }
     }else{
      fileListZp1=[];
     }
     
     var fileListZp2=[data.teacherResourceList[1]];
     if (data.teacherResourceList[1]!=undefined) {
    //  if(fileListZp2!=null){
      console.log(fileListZp2)
      fileListZp2[0].url=fileListZp2[0].resource;
      fileListZp2[0].path=fileListZp2[0].resource;
      fileListZp2[0].type=fileListZp2[0].resourceType;
     var isvideo= fileListZp2[0].resourceType=="video";
      if(isvideo){
        fileListZp2[0].isVideo=true;
      }else{
        fileListZp2[0].isImage=true;
      }
    
     }else{
      fileListZp2=[];
     }
     var fileListZp3=[data.teacherResourceList[2]];

     if ( data.teacherResourceList[2]!=undefined) {
    //  if(fileListZp3!=null){
      fileListZp3[0].url=fileListZp3[0].resource;
      fileListZp3[0].path=fileListZp3[0].resource;
      fileListZp3[0].type=fileListZp3[0].resourceType;
      var isvideo= fileListZp3[0].resourceType=="video";
      if(isvideo){
        fileListZp3[0].isVideo=true;
      }else{
        fileListZp3[0].isImage=true;
      }
     }else{
      fileListZp3=[];
     }
     var fileListZp4=[data.teacherResourceList[3]];
     if ( data.teacherResourceList[3]!=undefined) {
    //  if(fileListZp4!=null){
      fileListZp4[0].url=fileListZp4[0].resource;
      fileListZp4[0].path=fileListZp4[0].resource;
      fileListZp4[0].type=fileListZp4[0].resourceType;
      var isvideo= fileListZp4[0].resourceType=="video";
      if(isvideo){
        fileListZp4[0].isVideo=true;
      }else{
        fileListZp4[0].isImage=true;
      }
     }else{
      fileListZp4=[];
     }
      me.setData({
        teacherId:data.teacherId,
        fileList:me.data.fileList,
        fileListZp1:fileListZp1,
        fileListZp2:fileListZp2,
        fileListZp3: fileListZp3,
        fileListZp4: fileListZp4,
        realName: data.realName,
        headIcon: data.headIcon,
        idCardNumber: data.idCardNumber,
        teacherJobPosition: data.teacherJobPosition,
        teacherGoodAt: data.teacherGoodAt,
        teacherDescription: data.teacherDescription,
        imgtxtSolvePrice:data.imgtxtSolvePrice,
        videoSolvePrice:data.videoSolvePrice,
        phoneNumber: data.phone,
        smsCode: data.smsCode,
        solveStatus:data.solveStatus,
        teacherResourceList:data.teacherResourceList
      })
    }, function (errData) {
      console.log(errData)
      // me.setData({
      // })
    })
  },
  submit: async function () {
    let me = this;
    // wx.showLoading({
    //   title: '正在提交',
    // })
    // console.log(me.data.token)
    initQiniu(me.data.token);
    wx.showLoading({
      title: '正在提交'
    })
    let solveStatus = 2;
    console.log("8")
    if (!me.data.fileList.length) {
      wx.showToast({
        title: '请上传头像',
        icon: "none"
      });
      return;
    }
    else {
      console.log("9")
      await me.upFile(me.data.fileList, 0);
      
    console.log(me.data.teacherResourceList)
    }
    console.log("10")
    if (me.data.fileListZp1.length) {
      await me.upFile(me.data.fileListZp1, 1);
    }
    if (me.data.fileListZp2.length) {
      await me.upFile(me.data.fileListZp2, 2);
    }
    if (me.data.fileListZp3.length) {
      await me.upFile(me.data.fileListZp3, 3);
    }
    if (me.data.fileListZp4.length) {
      await me.upFile(me.data.fileListZp4, 4);
    }
    var arg = {
      teacherId:me.data.teacherId,
      realName: me.data.realName,
      headIcon: me.data.headIcon,
      idCardNumber: me.data.idCardNumber,
      teacherJobPosition: me.data.teacherJobPosition,
      teacherGoodAt: me.data.teacherGoodAt,
      teacherDescription: me.data.teacherDescription,
      imgtxtSolvePrice: me.data.imgtxtSolvePrice,
      videoSolvePrice: me.data.videoSolvePrice,
      phoneNumber: me.data.phoneNumber,
      smsCode: me.data.smsCode,
      solveStatus: solveStatus,
      teacherResourceList: me.data.teacherResourceList
    }
    console.log(arg)
    // https://eahost.lileiit.com/updateTeacherInfo
    app.wxRequest('post', '/updateTeacherInfo', arg, function (data) {
      console.log("12")
      if (data.data.status != 200) {
        wx.showToast({
          title: data.data.msg,
          icon: "none"
        })
      }
      else {
        wx.showToast({
          title: '已提交',
          icon: "success",
          success: function (res) {
            me.setData({
              active: 2
            })
          }
        });
      }
    }, function (err) {
      console.log(err)
      wx.showToast({
        title: "提交失败",
        icon: "error"
      })
    })
  },
  upFile: function (file, type) {
    let me = this;
    let arr = [];
    arr = file;
    return new Promise((resolve, reject) => {
      if (!arr[0]) {
        wx.showToast({
          title: '请上传文件',
          icon: "none"
        });
        reject();
      }
      
    if(file[0].url){
      // console.log(file[0].url);return
      me.setData({
        headIcon: file[0].url
      })  
       resolve('ok');
       return;
    }
    console.log(arr[0].path);
      // wx.uploadFile({
      //   url: app.globalData.baseUrl + '/dynamic/fileupload',
      //   filePath: arr[0].path,
      //   name: 'file',
      //   formData: {
      //   },
      //   header: {
      //     "Content-Type": "multipart/form-data",
      //     'Authorization': app.globalData.token
      //   },
      //   success: function (res) 
              // 交给七牛上传
      qiniuUploader.upload(arr[0].path, (res) => {
          if (type == 0) {
            console.log(res.imageURL)
            me.setData({
              headIcon: res.imageURL
            })
          }
          else if (type == 1) {
            let arg = {};
            let arr = me.data.teacherResourceList;
            arg.resourceType = me.data.fileListZp1[0].type;
            arg.resource =  res.imageURL;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          else if (type == 2) {
            let arg = {};
            let arr =me.data.teacherResourceList;
            arg.resourceType = me.data.fileListZp2[0].type;
            arg.resource = res.imageURL;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          else if (type == 3) {
            let arg = {};
            let arr = me.data.teacherResourceList;
            arg.resourceType = me.data.fileListZp3[0].type;
            arg.resource = res.imageURL;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          else if (type == 4) {
            let arg = {};
            let arr = me.data.teacherResourceList;
            arg.resourceType = me.data.fileListZp4[0].type;
            arg.resource = res.imageURL;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          resolve('ok');
        }
        // , fail: function (err) 
        , (error) => {
          reject();
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 1000,
          })
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this;
    // me.getTime();
    me.getTeacherInfo();
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
  getUser: function () {
    let me = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        me.setData({
          userInfo: res
        })
      }
    })

  },
  onGotUserInfo: function (e) {
  },
  delImg: function (e) {
    let me = this;
    let arr = [];
    let type = e.target.dataset.type;
    if (type == 'zp') {
      me.setData({
        fileListZp1: arr
      })
    }
    if (type == 'zp1') {
      me.setData({
        fileListZp2: arr
      })
    }
    if (type == 'zp2') {
      me.setData({
        fileListZp3: arr
      })
    }
    if (type == 'zp3') {
      me.setData({
        fileListZp4: arr
      })
    }
    else {
      me.setData({
        fileList: arr
      })
    }
  },
  afterRead: function (e) {
    let type = e.target.dataset.type;
    let me = this;
    let arr = [];
    arr.push(e.detail.file);
    if (type == 'zp') {
      me.setData({
        fileListZp1: arr
      })
    }
    if (type == 'zp1') {
      me.setData({
        fileListZp2: arr
      })
    }
    if (type == 'zp2') {
      me.setData({
        fileListZp3: arr
      })
    }
    if (type == 'zp3') {
      me.setData({
        fileListZp4: arr
      })
    }
    else {
      me.setData({
        fileList: arr
      })
    }
  },
  addFile: function (e) {
    let me = this;
    let type = e.target.dataset.type;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        let arr = [];
        if (res.tempFiles[0].thumbTempFilePath) {
          var arg = {};
          arg.type = 'video';
          arg.path = res.tempFiles[0].tempFilePath
          arr.push(arg);
        }
        else {
          var arg = {};
          arg.type = 'img';
          arg.path = res.tempFiles[0].tempFilePath
          arr.push(arg);
        }
        console.log(arr)
        if (type == 'zp') {
          me.setData({
            fileListZp1: arr
          })
        }
        if (type == 'zp1') {
          me.setData({
            fileListZp2: arr
          })
        }
        if (type == 'zp2') {
          me.setData({
            fileListZp3: arr
          })
        }
        if (type == 'zp3') {
          me.setData({
            fileListZp4: arr
          })
        }
      }
    })
  },
  delVideo: function (e) {
    let me = this;
    let type = e.target.dataset.type;
    wx.showModal({
      title: '提示',
      content: '确认删除该作品吗',
      success(res) {
        if (res.confirm) {
          if (type == 'zp') {
            if (  me.data.teacherResourceList[0]!=undefined) {
              me.data.teacherResourceList.splice(0, 1);
            }
            me.setData({
              fileListZp1: [],
              teacherResourceList:me.data.teacherResourceList
            })
          }
          if (type == 'zp1') {
            if (  me.data.teacherResourceList[1]!=undefined) {
              me.data.teacherResourceList.splice(1, 1);
            }
            me.setData({
              fileListZp2: [],
              teacherResourceList:me.data.teacherResourceList
            })
          }
          if (type == 'zp2') {
            if (  me.data.teacherResourceList[2]!=undefined) {
              me.data.teacherResourceList.splice(2, 1);
            }
            me.setData({
              fileListZp3: [],
              teacherResourceList:me.data.teacherResourceList
            })
          }
          if (type == 'zp3') {
            if (  me.data.teacherResourceList[3]!=undefined) {
              me.data.teacherResourceList.splice(3, 1);
            }
            me.setData({
              fileListZp4: [],
              teacherResourceList:me.data.teacherResourceList
            })
          }
        } else if (res.cancel) {

        }
      }
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