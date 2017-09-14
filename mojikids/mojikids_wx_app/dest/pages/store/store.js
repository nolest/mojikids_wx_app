// pages/store/store.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    store_id:'',
    windowHeight : app.globalData.systemInfo.windowHeight,
    windowWidth : app.globalData.systemInfo.windowWidth,
    info : null,
    show_map: 0,
    for_maps:{}
  },
  onLoad:function(options){
    //调用统计
    app.globalData.mta.Page.init();
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
      that.setData({
        store_id : options.store_id
      });
      that.fetch();
    // app.ready(function(systemInfo){
    //   console.log(systemInfo)
    //   that.setData({
    //     store_id : options.store_id
    //   });
    //   that.fetch();
    // },
    // function(userInfo){

    // },
    // function(){
      
    // });
  },
  fetch : function(){
    var that = this;
    app.util.yue_request({
      url: app.globalData.api_domain + '/store/store.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        store_id : that.data.store_id
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(r,res) {
        console.log(res);
        var info = res.data.res.data;
        info.image = util.change_img_size(info.image,640);
        that.setData({
          info : info
        })

        that.fresh_title(info.title);
      },
      fail : function(){

      },
      complete : function(){
        //wx.hideToast();
      }
    })
  },
  fresh_title : function(str){
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title : str
    })
  },
  to_shop : function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    switch(index){
      case 0:break;
      case 1:
        var str = e.currentTarget.dataset.position;
        var arr = str.split(",");
        // that.setData({
        //   show_map : 1,
        //   for_maps:{
        //     longitude : parseFloat(arr[0]),//113.345489,//经度113+-
        //     latitude : parseFloat(arr[1]),//23.141894, //纬度23+-
        //     markers: [{
        //             iconPath: "",///image/index/address-icon-32x32.png",
        //             id: 0,
        //             latitude: parseFloat(arr[1]),//23.141894,
        //             longitude: parseFloat(arr[0]) //113.345489//(arr[0]),
        //     }]
        //   }
        // })
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            wx.openLocation({
              latitude: parseFloat(arr[1]),
              longitude: parseFloat(arr[0]),
              scale: 28
            })
          }
        })
      break;
      case 2:
        var phone = e.currentTarget.dataset.value;
        wx.makePhoneCall({
          phoneNumber: phone //仅为示例，并非真实的电话号码
        })
      break;
    }
  },
  map_close : function(){
    //关闭地图浮层
      this.setData({
        show_map : 0
      })
  },
  onReady:function(){
    // 页面渲染完成
    app.get_window_info(this);
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})