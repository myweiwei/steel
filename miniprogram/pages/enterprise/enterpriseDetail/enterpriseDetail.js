//index.js
const app = getApp()
// var bmap = require('../../../utils/bmap-wx.min.js');
var wxMarkerData = []; 
Page({
  data: {
    enterpriseId:"",
    latitude:'39.95933',
    longitude:'116.29845' ,
    rgcData: {},
    markers: [{
      iconPath: "../../../images/enterprise/loc.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 30,
      height:30
    }],

    logo:"",
    name:"",
    distance:"",
    address:"",
    enterpriseType:"",
    telephone:"",
    images:[],
    enterpriseImgs:[],
    //经营商品
    goods:[],
  },
  onChange:function(event){
    var tagName = event.detail.name;
    var me = this;
    if(tagName == "product"){
      me.goodsData();
    }
  },
  call:function(){
    var phone = this.data.telephone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  goMap:function(e){
    let me=this;
    wx.openLocation({
      latitude: parseFloat(me.data.latitude),
      longitude: parseFloat(me.data.longitude),
      scale:18,
      success(res) {
      },
      fail(err){
      }
    })
  },
  //初始化数据
  onLoad: function(options) {
    var that = this;
    var distance=options.distance;
    var enterpriseId=options.enterpriseId;
    console.log(enterpriseId)
    that.setData({
      distance:distance,
      enterpriseId:enterpriseId
    });
    
    if (app.globalData.token == '') {
      app.getUser(that.initData(enterpriseId));
    }
    else {
      console.log(enterpriseId)
      that.initData(enterpriseId);
    }
  },
  initData:function(enterpriseId){
    console.log(enterpriseId)
    var url = "/enterprise/detailInfo/" + enterpriseId;
    console.log(url)
    var me = this;
    app.wxRequest('get', url, {}, function (data) {
      console.log(data.data)
      if (data.data.status == 200) {
        console.log(data.data)
        var data = data.data.data;

        var arr = 'markers[0].longitude';
        var arr2 = 'markers[0].latitude';
        me.setData({
          longitude:data.longitude,
          latitude:data.latitude,
          name:data.enterpriseName,
          address:data.enterpriseAddress,
          enterpriseType:data.enterpriseType,
          telephone:data.enterpriseTelephone,
          enterpriseDescription:data.enterpriseDescription,
          [arr]:data.longitude,
          [arr2]:data.latitude,
          logo:data.enterpriseLogo,
          enterpriseImgs: data.enterpriseImgs
        });
      }
    }, function (err) {
      console.log(err)
    })

  },
  goodsData:function(){
    var enterpriseId = this.data.enterpriseId;
    console.log(enterpriseId)
    var url = "/enterprise/goods/" + enterpriseId;
    var me = this;
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        me.setData({goods:data.data.data});
      }
    }, function (err) {
console.log(err)
    })

  }

});


