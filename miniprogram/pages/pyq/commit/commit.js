// pages/pyq/commit/commit.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dynamicTitle:'',
    province:'',
    city:"",
    fileList:[],
    fileList1:[],
    fileArr:[],
    count:0,
    focus:false,
    address:false,
    columns: ['咨询','求职','招聘'],
    dynamicType:'',
    show:false,
    videoType:0
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
    me.setData({
      dynamicType: val.detail.value,
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
    let me = this;
    const { file } = event.detail;
    let arr=[];
    arr.push(file)
    me.setData({
      fileList1:arr,
      count:1
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
  getLocation:function(){
    let me=this;
    wx.chooseLocation({
      success(res) {
        console.log(res);
        me.setData({
          province: res.address+';'+res.name,
          address: true
        })
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
    data.dynamicType = me.data.dynamicType;
    data.dynamicImgVideo = me.data.fileArr.join(';');
    data.dynamicArea = me.data.province;
    data.videoType = me.data.videoType;
    console.log(data);
    app.wxRequest('post', '/ea-service-dynamic/dynamic/dynamic', data, function (data) {
      if (data.statusCode==200){
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000,
          success: function () {
            wx.hideLoading()
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
        for (let i = 0; i < me.data.fileList.length; i++)        {
          if (i == me.data.fileList.length - 1) {
            flag = 1;
          }
          await me.upFile(me.data.fileList[i].path, flag)
        }
      }
      else if (me.data.fileList1.length){
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
    let me=this;
    let arr=[];
    arr=me.data.fileArr;
    return new Promise((resolve,reject)=>{
      wx.uploadFile({
        url: app.globalData.baseUrl +'/ea-service-dynamic/dynamic/fileupload',
        filePath: path,
        name: 'file',
        formData: {
        },
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': app.globalData.token
        },
        success: function (res) {
          console.log(JSON.parse(res.data).data);
          arr.push(JSON.parse(res.data).data);
          console.log(arr);
          if (i == 1 &&res.statusCode == 200){
            me.setData({
              fileArr:arr
            })
            me.send();
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