// pages/mine/regTeacher/regTeacher.js
const app = getApp();
Page({
  data: {
    userInfo:{},
    fileList:[],
    fileListZp1:[],
    fileListZp2: [],
    fileListZp3: [],
    fileListZp4: [],
    realName:"",
    headIcon:'',
    idCardNumber:'',
    teacherJobPosition:"",
    teacherGoodAt:"",
    teacherDescription:'',
    videoSolvePrice:"",
    imgtxtSolvePrice:'',
    phoneNumber:"",
    smsCode:"",
    time:125,
    interval:null,
    flag:true,
    steps: [
      {
        desc: '填写基本信息',
      },
      {
        desc: '上传作品',
      },
      {
        desc: '缴纳押金',
      },
      {
        desc: '完成注册',
      },
    ],
    active:0,
    twFlag:true,
    spFlag:true,
    teacherResourceList:[]
  },
  onCheckChange(val){
    let type = val.currentTarget.dataset.type;
    if(type=='tw'){
      this.setData({
        twFlag:val.detail
      })
    }
    if (type == 'sp') {
      this.setData({
        spFlag: val.detail
      })
    }
  },
  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  next:function(e){
    let me=this;
    me.setData({
      active: e.currentTarget.dataset.index
    })
  },
  addPrice: function () {
    let me = this;
    app.wxRequest('post', '/ea-service-personal/recharge/recharge/59', {}, function (res) {
      console.log(res);
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
            console.log(res);
          },
          complete: function (res) { }
        })
    })
  },
  onChange:function(val){
    let me=this;
    console.log(val)
    console.log(val.currentTarget.dataset.name)
    let label = val.target.dataset.name;
    me.setData({
      [label]: val.detail
    })
  },
  send:function(){
    let me=this;
    if (!me.data.phoneNumber){
      wx.showToast({
        title: '请填写手机号码',
        icon: "none"
      })
      return ;
    }
    app.wxRequest('get', '/ea-service-personal/personal/getRegisterCode/'+me.data.phoneNumber, {}, function (data) {
      me.getTime();
    })
  },
  getTime(){
    let me=this;
    let interval=setInterval(function(){
      let arg=me.data.time;
      if(arg<=0){
        clearInterval(interval);
        me.setData({
          time: 0,
          flag:true
        })
      }
      else {
        arg--;
        me.setData({
          time: arg,
          flag:false
        })
      }
    },1000)
  },
  submit:async function(){
    let me=this;
    // wx.showLoading({
    //   title: '正在提交',
    // })
    let solveStatus=0;
    if (me.data.twFlag==true&&me.data.spFlag==true){
      solveStatus=3;
    }
    else if (me.data.twFlag == true && me.data.spFlag == false){
      solveStatus = 1;
    }
    else if (me.data.twFlag == false && me.data.spFlag == true) {
      solveStatus = 2;
    }
    await me.upFile(me.data.fileList,0);
    if(me.data.fileListZp1.length){
      await me.upFile(me.data.fileListZp1, 1);
    }
    if (me.data.fileListZp2.length) {
      await me.upFile(me.data.fileListZp1, 2);
    }
    if (me.data.fileListZp3.length) {
      await me.upFile(me.data.fileListZp1,3);
    }
    if (me.data.fileListZp4.length) {
      await me.upFile(me.data.fileListZp4, 4);
    }
    var arg={
      realName: me.data.realName,
      headIcon: me.data.headIcon,
      idCardNumber: me.data.idCardNumber,
      teacherJobPosition: me.data.teacherJobPosition,
      teacherGoodAt: me.data.teacherGoodAt,
      teacherDescription: me.data.teacherDescription,
      imgtxtSolvePrice:me.data.imgtxtSolvePrice,
      videoSolvePrice:me.data.videoSolvePrice,
      phoneNumber: me.data.phoneNumber,
      smsCode: me.data.smsCode,
      solveStatus:solveStatus,
      teacherResourceList:me.data.teacherResourceList
    }
    app.wxRequest('post', '/ea-service-personal/personal/registerTeacher', arg, function (data) {
      console.log(data);
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
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 2000)
          }
        });
      }
    })
  },
  upFile: function (file,type) {
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
      wx.uploadFile({
        url: app.globalData.baseUrl + '/ea-service-dynamic/dynamic/fileupload',
        filePath: arr[0].path,
        name: 'file',
        formData: {
        },
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': app.globalData.token
        },
        success: function (res) {
          if(type==0){
            me.setData({
              headIcon: JSON.parse(res.data).data
            })
          }
          else if(type==1){
            let arg={};
            let arr = me.data.teacherResourceList;
            arg.resourceType=me.data.fileListZp1[0].type;
            arg.resource = JSON.parse(res.data).data;
            arr.push(arg);
            me.setData({
              teacherResourceList:arr
            })
          }
          else if (type == 2) {
            let arg = {};
            let arr = Object.assign(me.data.teacherResourceList);
            arg.resourceType = me.data.fileListZp2[0].type;
            arg.resource = JSON.parse(res.data).data;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          else if (type == 3) {
            let arg = {};
            let arr = Object.assign(me.data.teacherResourceList);
            arg.resourceType = me.data.fileListZp3[0].type;
            arg.resource = JSON.parse(res.data).data;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          else if (type == 4) {
            let arg = {};
            let arr = Object.assign(me.data.teacherResourceList);
            arg.resourceType = me.data.fileListZp4[0].type;
            arg.resource = JSON.parse(res.data).data;
            arr.push(arg);
            me.setData({
              teacherResourceList: arr
            })
          }
          resolve('ok');
        }, fail: function (err) {
          reject();
        }
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me=this;
   // me.getTime();
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
    console.log(e.detail.userInfo);
  },
  delImg:function(e){
    let me = this;
    let arr = [];
    console.log(e.target.dataset.type);
    let type = e.target.dataset.type;
    if(type=='zp'){
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
  afterRead:function(e){
    console.log(e.detail.file);
    console.log(e.target.dataset);
    let type=e.target.dataset.type;
    console.log(type)
    let me=this;
    let arr=[];
    arr.push(e.detail.file);
    if(type=='zp'){
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
  addFile:function(e){
    let me=this;
    let type=e.target.dataset.type;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res);
        console.log(res.tempFiles)
        let arr=[];
        if (res.tempFiles[0].thumbTempFilePath) {
          var arg = {};
          arg.type = 'video';
          arg.path = res.tempFiles[0].tempFilePath
          console.log(arg);
          arr.push(arg);
        }
        else {
          var arg = {};
          arg.type = 'img';
          arg.path = res.tempFiles[0].tempFilePath
          arr.push(arg);
        }
        if(type=='zp'){
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
  delVideo:function(e){
    let me=this;
    console.log(e.target.dataset.type)
    let type = e.target.dataset.type;
    wx.showModal({
      title: '提示',
      content: '确认删除该作品吗',
      success(res) {
        if (res.confirm) {
          if(type=='zp'){
            me.setData({
              fileListZp1: []
            })
          }
          if (type == 'zp1') {
            me.setData({
              fileListZp2: []
            })
          }
          if (type == 'zp2') {
            me.setData({
              fileListZp3: []
            })
          }
          if (type == 'zp3') {
            me.setData({
              fileListZp4: []
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