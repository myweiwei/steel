// pages/mine/regEnterprise/regEnterprise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    address:'',
    columns:['0-20人','20-99人','100-499人','500-999人','1000-9999人','10000人以上'],
    show:false,
    number:'0-20人',
    show1:false,
    activeList:[],
    liList: [{ name: "类型1", active: false }, { name: "类型2", active: false }],
    activeIndex:[],
    liclass:{},
    type:'',
    fileList1:[]
  },
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
    console.log(val);
  },
  onConfirm:function(val){
    console.log(val)
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
    let arr = [];
    arr.push(e.detail.file);
    me.setData({
      fileList1: arr
    })
  },
  delImg1: function (e) {
    let me = this;
    let arr = [];
    me.setData({
      fileList1: arr
    })
  },
  getLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
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
        console.log(res);
        me.setData({
          province: res.address+';'+res.name,
          address: res.name
        })
      },
      fail(err){
        console.log(err);
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
  confirmShow:function(){
    let me=this;
    console.log(me.activeIndex)
    let arr=[];
    for(let i=0;i<me.data.activeIndex.length;i++){
      arr.push(me.data.liList[me.data.activeIndex[i]].name);
    }
    console.log(arr);
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