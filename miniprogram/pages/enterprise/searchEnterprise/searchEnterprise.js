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
    option1: [],
    option2: [],
    value1: 0,
    value2: 0
  },
  changeArea:function(event){
    this.setData({
      value1:event.detail
    })
    this.searchData(this.data.longtitude, this.data.latitude, this.data.keyword);
  },
  changeTag: function (event) {
    this.setData({
      value2: event.detail
    })
    this.searchData(this.data.longtitude, this.data.latitude, this.data.keyword);
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
  getTips:function(){
    let me = this;
    let areaList = [
      { text: '地区', value:0 },
      { text: "北京", value: "北京" },
      { text: "天津", value: "天津" },
      { text: "上海", value: "上海" },
      { text: "重庆", value: "重庆" },
      { text: "河北", value: "河北" },
      { text: "山西", value: "山西" },
      { text: "辽宁", value: "辽宁" },
      { text: "吉林", value: "吉林" },
      { text: "黑龙江", value: "黑龙江" },
      { text: "江苏", value: "江苏" },
      { text: "浙江", value: "浙江" },
      { text: "安徽", value: "安徽" },
      { text: "福建", value: "福建" },
      { text: "江西", value: "江西" },
      { text: "山东", value: "山东" },
      { text: "河南", value: "河南" },
      { text: "湖北", value: "湖北" },
      { text: "湖南", value: "湖南" },
      { text: "广东", value: "广东" },
      { text: "海南", value: "海南" },
      { text: "四川", value: "四川" },
      { text: "贵州", value: "贵州" },
      { text: "云南", value: "云南" },
      { text: "陕西", value: "陕西" },
      { text: "甘肃", value: "甘肃" },
      { text: "青海", value: "青海" },
      { text: "内蒙古", value: "内蒙古" },
      { text: "广西", value: "广西" },
      { text: "西藏", value: "西藏" },
      { text: "宁夏", value: "宁夏" },
      { text: "新疆维吾尔自治区", value: "新疆维吾尔自治区" },
      { text: "香港", value: "香港" },
      { text: "澳门", value: "澳门" },
      { text: "台湾", value: "台湾" }
    ]
    app.wxRequest('get', '/other/dics', {}, function (data) {
      if (data.data.status == 200) {
        let arr = data.data.data;
        let arr1 = [{ text: '标签', value: 0 }];
        for(let i=0;i<arr.length;i++){
          let arg={
            text: arr[i].name,
            value: arr[i].name
          }
          arr1.push(arg)
        }
        me.setData({
          option2:arr1,
          option1: areaList
        })
      }
    })
  },
  //发起搜索请求，首次进入没有关键词，默认按距离搜索
  searchData : function(longtitude,latitude,keyword){
    var me = this;
    var url = "";
    let tag = this.data.value2!=0 ? this.data.value2:""
    let area = this.data.value1!= 0 ? this.data.value1 : ""
    if(keyword == "" || keyword == null){
      url = "/enterprise/selectByKeyword?lon=" + longtitude + "&lat=" + latitude + "&pageNum=1&pageSize=10" + "&tag=" + tag + "&area=" + area;
    }
    else{
      url = "/enterprise/selectByKeyword?lon=" + longtitude + "&lat=" + latitude + "&pageNum=1&pageSize=10&keyword=" + keyword + "&tag=" + tag + "&area=" + area;
    }
    app.wxRequest('get', url, {}, function (data) {
      if (data.data.status == 200) {
        me.setData({enterpriseList:data.data.data.list});
        
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
      app.getUser(that.getTips());
    }
    else {
      that.searchData(option.longtitude,option.latitude);
      that.getTips()
    }
  },

});


