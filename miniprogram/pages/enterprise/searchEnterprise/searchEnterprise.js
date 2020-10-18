//index.js
const app = getApp()

Page({
  data: {
    longitude:0,
    latitude:0,
    keyword:"",
    enterpriseList:[],
    baseUrl:'',
    statusBarHeight:0,
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
  },
  onItemClick:function(event){
    var distance = event.currentTarget.dataset.distance;
    var enterpriseId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/enterprise/enterpriseDetail/enterpriseDetail?distance=' + distance  + "&enterpriseId=" + enterpriseId
    });
  },
  //监听搜索框
  onSearchChange:function(event){
    var me = this;
    me.setData({keyword:event.detail});
    me.search();
  },
  //点击搜索按钮
  search:function(){
    var that = this;
    that.searchData(that.data.longtitude,that.data.latitude,that.data.keyword);
  },
  //发起搜索请求，首次进入没有关键词，默认按距离搜索
  searchData : function(longtitude,latitude,keyword){
    var me = this;
    var url = "";
    if(keyword == "" || keyword == null){
      url = "/enterprise/selectByKeyword?lon=" + longtitude + "&lat=" + latitude + "&pageNum=1&pageSize=10";
    }
    else{
      url = "/enterprise/selectByKeyword?lon=" + longtitude + "&lat=" + latitude + "&pageNum=1&pageSize=10&keyword=" + keyword;
    }
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        console.log(data.data.data);
        me.setData({enterpriseList:data.data.data});
      }
    })
  },

  //初始化数据
  onLoad: function(option) {
    var that = this;
    that.setData({
      longtitude: option.longtitude, latitude: option.latitude, statusBarHeight: app.globalData.statusBarHeight});
    if (app.globalData.token == '') {
      app.getUser(that.searchData(option.longtitude,option.latitude));
    }
    else {
      that.searchData(option.longtitude,option.latitude);
    }
  },

});


