//index.js
const app = getApp()

Page({
  data: {
    longitude:0,
    latitude:0,
    keyword:"",
    enterpriseList:[],
    baseUrl:''
  },
  //监听搜索框
  onSearchChange:function(event){
    var me = this;
    me.setData({keyword:event.detail});
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
    that.setData({longtitude:option.longtitude,latitude:option.latitude});
    if (app.globalData.token == '') {
      app.getUser(that.searchData(option.longtitude,option.latitude));
    }
    else {
      that.searchData(option.longtitude,option.latitude);
    }
  },

});


