//index.js
const app = getApp()
var bmap = require('../../../utils/bmap-wx.min.js');
var wxMarkerData = []; 
Page({
  data: {
    latitude:'39.95933',
    longitude:'116.29845' ,
    rgcData: {},
    markers: [{
      iconPath: "../../../images/enterprise/loc.png",
      id: 0,
      latitude: 39.95933,
      longitude: 116.29845,
      width: 30,
      height:30
    }],
  },
  
  goMap:function(e){
    console.log(e)
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
  onLoad: function(option) {
    var that = this;
    // that.setData({longtitude:option.longtitude,latitude:option.latitude});
    // if (app.globalData.token == '') {
    //   app.getUser(that.searchData(option.longtitude,option.latitude));
    // }
    // else {
    //   that.searchData(option.longtitude,option.latitude);
    // }
  },

});


