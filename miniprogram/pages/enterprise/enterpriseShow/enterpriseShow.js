//index.js
const app = getApp()

Page({
  data: {
    fileList: [
      // { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
    ],
    fileList2:[]
  },
  //删除图片
  onDelete:function(e){
      let me = this;
      let arr = [];
      me.setData({
        fileList:arr,
      })
  },
  afterRead: function (e) {
    let me = this;
    let arr = [];
    arr.push(e.detail.file);
    me.setData({
      fileList: arr
    })
  },


  onDelete2:function(e){
    let me = this;
    let arr =me.data.fileList2;
    arr.splice(e.detail.index,1);
    console.log(e.detail.index);
    me.setData({
      fileList2: arr
    })
},
  afterRead2: function (e) {
    let me = this;
    let arr = me.data.fileList2;
    arr.push(e.detail.file);
    me.setData({
      fileList2: arr
    })
},
save:function(option){
  app.wxRequest('get', '/personal/teacherInfoByUserId/', {}, function (data) {
    console.log(data.data)
    wx.navigateTo({
      url: '/pages/consult/restroom/restroom?teacherId=' + data.data.data.teacherId + '&restroomId=' + me.data.val+'&userId=' + data.data.data.teacherId
    })
  })
},
  onLoad: function(option) {
    var that = this;
    if (app.globalData.token == '') {
      app.getUser(that.initData);
    }
    else {
      that.initData();
    }
  },
  initData:function(){
    var url = "/enterprise/coverShow";
    var me = this;
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        var data = data.data.data;
        console.log(data);
        let arr = [];
        // let arr2 = data.introductionImgs;
        var arg={
          url:data.face.resource,
          status: 'success'
        }
        arr.push(arg);
        console.log(arr);
        me.setData({
          fileList: arr
          // fileList2:arr2
        });
      }
    })
  }
});


