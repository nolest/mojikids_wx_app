// pages/success/success.js
var app = getApp();
Page({
  data:{
    account_type : '',
    windowWidth : app.globalData.systemInfo.windowWidth
  },
  onLoad:function(options){
    //调用统计
    app.globalData.mta.Page.init();
    app.globalData.mta.Event.stat("order_pay",{});
    // 页面初始化 options为页面跳转所带来的参数
    var order_sn = options.order_sn;
    this.setData({
      order_sn : order_sn
    })
    var that = this;
    //调用应用实例的方法获取全局数据

    app.ready(function(systemInfo){
      that.setData({
        account_type : systemInfo.account_type// systemInfo.account_type app.globalData.account_type
      })
      that.fetch();
    },
    function(userInfo){
      that.setData({
        userInfo:userInfo
      });
    },
    function(){
      
    });
  },
  fresh_title : function(str){
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title : str
    })
  },
  fetch : function(){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    app.util.yue_request({
      url: app.globalData.api_domain + '/success/success.php', //仅为示例，并非真实的接口地址
      data: {
        yue_login_id: app.globalData.yue_login_id,
        order_sn : that.data.order_sn
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(r,res) {
        console.log(res);
        var info = res.data.res.data;

        that.setData({
          info : info
        })

        that.fresh_title('支付成功');
      },
      fail : function(){

      },
      complete : function(){
        wx.hideToast();
      }
    })
  },
  go_to_order : function(){
    app.globalData.router.index.tap_cur = 1;
    app.globalData.router.index.change_by = 'success';
    app.globalData.mta.Event.stat('order_pay',{'1ckdd':'true'});
    // console.log(app.globalData);
    // console.log(getCurrentPages());

          // success
          // if(app.globalData.form_ewm.details){
          //   wx.redirectTo({
          //     url: '/pages/index/index',
          //     success: function(res){
          //       // success
          //     },
          //     fail: function() {
          //       // fail
          //     },
          //     complete: function() {
          //       // complete
          //     }
          //   })

          // }
          // else{
          //   wx.navigateBack({
          //     delta : 10
          //   })   
          // }
    var that = this;
    wx.switchTab({
      url: "/pages/order_list/order_list",
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  go_to_mine : function(){
    var that = this;
    wx.switchTab({
      url: "/pages/mine/mine",
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
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