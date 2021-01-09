// pages/mine/regEnterprise/regEnterprise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterpriseName:"",
    latitude:0,
    longitude:0,
    enterpriseAddress:"",
    phone:"",
    number:'0-20人',
    liList: [{ name: "类型1", active: false }, { name: "类型2", active: false }],

    fileList: [],
    address:'',
    columns:['0-20人','20-99人','100-499人','500-999人','1000-9999人','10000人以上'],
    show:false,
    
    show1:false,
    activeList:[],
    activeIndex:[],
    liclass:{},
    type:'',
    fileList1:[],
    iconPath:'',
    fileArr1:[]
  },
  
  onPhoneChange:function(event){
    var me = this;
    me.setData({phone:event.detail});
  },
  onEnterpriseChange:function(event){
    var me = this;
    me.setData({enterpriseName:event.detail});
  },
  submit:function(){
    let me=this;
    var flag=me.validateParam();
    if (flag!=false){
      if (!me.data.fileList.length) {
        //如果没有上传LOGO，就不走上传逻辑
        me.data.iconPath = '';
        me.uploadFiles();
      }
      else {
        wx.uploadFile({
          url: app.globalData.baseUrl + '/dynamic/fileupload',
          filePath: me.data.fileList[0].path,
          name: 'file',
          formData: {
          },
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization': app.globalData.token
          },
          success: function (res) {
            me.setData({
              iconPath: JSON.parse(res.data).data
            });
            me.uploadFiles();
          }, fail: function (err) {
          }
        })
      }
    }
  },
  upFile: function (path, i) {
    let me = this;
    let arr = [];
    arr = me.data.fileArr1;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.baseUrl + '/dynamic/fileupload',
        filePath: path,
        name: 'file',
        formData: {
        },
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': app.globalData.token
        },
        success: function (res) {
          arr.push(JSON.parse(res.data).data);
          if (i == 1 && res.statusCode == 200) {
            me.setData({
              fileArr1: arr
            })
            me.submitForm();
          }
          resolve('ok');
        }, fail: function (err) {
          reject();
        }
      })
    })
  },
  uploadFiles: async function () {
    var me = this;
    wx.showLoading({
      title: '上传中',
    })
    //将保存的图片路径用来循环
    if (me.data.fileList1.length) {
      var arr = [];
      let flag = 0;
      for (let i = 0; i < me.data.fileList1.length; i++) {
        if (i == me.data.fileList1.length - 1) {
          flag = 1;
        }
        await me.upFile(me.data.fileList1[i].path, flag)
      }
    } else {
    }

  },
  validateParam:function(){
    let me = this;
    if (me.data.enterpriseName == "") {
      wx.showToast({
        title: "企业名称不能为空",
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (me.data.address == "") {
      wx.showToast({
        title: "企业地址不能为空",
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (me.data.phone == "") {
      wx.showToast({
        title: "联系方式不能为空",
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (me.data.type == "") {
      wx.showToast({
        title: "企业类型不能为空",
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (!me.data.fileList1.length) {
      wx.showToast({
        title: "请至少上传一张营业执照",
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
 },
  submitForm:function(){
    let me=this;
    app.wxRequest('POST', '/enterprise/register', 
    {
      "enterpriseName":me.data.enterpriseName,
      "longitude":me.data.longitude,
      "latitude":me.data.latitude,
      "enterpriseAddress":me.data.address,
      "enterpriseTelephone":me.data.phone,
      "enterpriseScale":me.data.number,
      "enterpriseType": me.data.type.toString(),
      "enterpriseLogo": me.data.iconPath,
      "businessLicense": me.data.fileArr1
    }, 
    function (data) {
      if (data.data.status == 200) {
            wx.redirectTo({
              url: '/pages/mine/regEnterprise/regEnterpriseSuccess/regEnterpriseSuccess',
           })
      }
      else{
        wx.showToast({
          title:  data.data.msg,
          duration: 2000//持续的时间
        })
      }
    }
  )},
  chooseType:function(){
    let me=this;
    me.setData({
      show1:true
    })
  },
  onClose:function(){
    let me = this;
    me.setData({
      show: false
    })
  },
  onChange:function(val){
  },
  onConfirm:function(val){
    this.setData({
      number:val.detail.value,
      show:false
    })
  },
  chooseNum:function(){
    let me=this;
    me.setData({
      show:true
    })
  },
  //logo
  afterRead: function (e) {
    let me = this;
    let arr = [];
    arr.push(e.detail.file);
    me.setData({
      fileList: arr
    })
  },
  delImg:function(e){
    let me = this;
    let arr = [];
    me.setData({
      fileList: arr
    })
  },
  //营业执照
  afterRead1: function (e) {
    let me = this;
    let arr = me.data.fileList1;
    arr.push(e.detail.file);
    me.setData({
      fileList1: arr
    })
  },
  delImg1: function (e) {
    let me = this;
    let arr =me.data.fileList1;
    arr.splice(e.detail.index,1);
    me.setData({
      fileList1: arr
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
          addressDetail: res.name, //详细地址
          address: res.address, //大框地址
          longitude: res.longitude,
          latitude:res.latitude
        })
      },
      fail(err){
      }
    })
  },
  /* 选择企业类型弹框*/
  closeShow:function(){
    let me=this;
    me.setData({
      show1:false
    })
  },
  initEnterpriseType:function(){
    var me = this;
    app.wxRequest('get', '/enterprise/enterpriseType', {}, function (data) {
      if (data.data.status == 200) {
       var arr = [];
       for(let i = 0; i < data.data.data.length; i++){
         var arg = {};
         arg.name = data.data.data[i];
         arg.active = false;
         arr.push(arg);
       }
       me.setData({liList:arr});
       
      }

    })
  },

  confirmShow:function(){
    let me=this;
    let arr=[];
    for(let i=0;i<me.data.activeIndex.length;i++){
      arr.push(me.data.liList[me.data.activeIndex[i]].name);
    }
    me.setData({
      type:arr.join(','),
      show1:false
    })
  },
  //获取选择的类型及高亮效果实现
  addType: function (e) {
    let me = this;
    let index = e.currentTarget.dataset.index;
    let arr = me.data.activeIndex;
    var str_title = "liList[" + index + "].active";
    let zb = arr.indexOf(index);
    if (zb != -1) {
      arr.splice(zb, 1)
      me.setData({
        [str_title]: false,
      })
    }
    else {
      arr.push(index);
      me.setData({
        [str_title]: true,
      })
    }
    me.setData({
      activeIndex: arr
    })
  },
  /* 选择企业类型弹框结束*/
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
    var me = this;
    if (app.globalData.token == '') {
      app.getUser(me.initEnterpriseType());
    }
    else {
      me.initEnterpriseType(); //请求字典，加载到 liList 中去
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