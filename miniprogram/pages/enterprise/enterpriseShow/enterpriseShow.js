//index.js
const app = getApp()
Page({
  data: {
    fileList: [
      // { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
    ],
    fileList2: [],
    moreImg: "",
    desc: "",
    introImgs: []
  },
  //删除图片
  onDelete: function (e) {
    let me = this;
    let arr = [];
    me.setData({
      fileList: arr,
      moreImg: ""
    })
  },
  afterRead: async function (e) {
    let me = this;
    let arr = [];
    arr.push(e.detail.file);
    me.setData({
      fileList: arr
    })
  },


  onDelete2: function (e) {
    let me = this;
    let arr = me.data.fileList2;
    arr.splice(e.detail.index, 1);
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
  save: async function (option) {
    let me = this;
    if (me.data.fileList.length){
      await me.upFile(me.data.fileList, 1);
    } 
    for (let i = 0; i < this.data.fileList2.length; i++) {
      if (!me.data.fileList2[i].name){
        await me.upFile([me.data.fileList2[i]], 2);
      }
    }
    let arr=[];
    for (let j = 0; j < this.data.introImgs.length;j++){
      if (this.data.introImgs[j].url){
        arr.push(this.data.introImgs[j].url)
      }
    }
    let arg = {
      images:arr,
      face: this.data.moreImg,
      description: this.data.desc
    }
    app.wxRequest('post', '/enterprise/saveShow', arg, function (data) {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
      wx.switchTab({
        url: '/pages/index/index'
      })
    })
  },
  upFile: function (file, type) {
    let me = this;
    let arr = [];
    arr = file;
    return new Promise((resolve, reject) => {
      if (!arr[0]&&type==2) {
        wx.showToast({
          title: '请上传文件',
          icon: "none"
        });
        reject();
      }
      wx.uploadFile({
        url: app.globalData.baseUrl + '/dynamic/fileupload',
        filePath: arr[0].path,
        name: 'file',
        formData: {
        },
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': app.globalData.token
        },
        success: function (res) {
          if (type == 1) {
            me.setData({
              moreImg: JSON.parse(res.data).data
            })
          }
          else if (type == 2) {
            let arr = Object.assign(me.data.introImgs);
            arr.push({
              name: JSON.parse(res.data).data,
              url: JSON.parse(res.data).data
            });
            me.setData({
              introImgs: arr
            })
          }
          resolve('ok');
        }, fail: function (err) {
          reject();
        }
      })
    })

  },
  onLoad: function (option) {
    var that = this;
    if (app.globalData.token == '') {
      app.getUser(that.initData);
    }
    else {
      that.initData();
    }
  },
  getDataBindTap(event) {
    this.setData({
      desc: event.detail.value
    })
  },
  initData: function () {
    var url = "/enterprise/coverShow";
    var me = this;
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        var data = data.data.data;
        let arr = [];
        for (let i = 0; i < data.introductionImgs.length; i++) {
          var arg = {
            url: data.introductionImgs[i].resource,
            name: data.introductionImgs[i].resource
          }
          arr.push(arg)
        }
        me.setData({
          moreImg: data.face ? data.face.resource:'',
          fileList2: arr,
          desc: data.desc,
          introImgs:arr
        });
      }
    })
  }
});


