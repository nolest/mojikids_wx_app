//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    autoplay: true,
    interval: 2500,
    duration: 800,
    indicatorDots: false,
    indicatorColor: '#f4f4f3',
    indicatorActiveColor: '#ffc430',
    jump_fade : 0
  },
  onLoad: function (options) {
    //调用统计
    app.globalData.mta.Page.init();
    app.globalData.mta.Event.stat("index", {});
    var that = this;
    that.fresh_title();
    //调用应用实例的方法获取全局数据
    app.ready(
      function (globalData) {
        console.log(app.globalData);
        console.log(globalData);
        console.log("gg");
        that.fetch();
      },
      function () {

      })
  },
  fetch: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    console.log(app.globalData.api_domain)
    app.util.yue_request({
      url: app.globalData.api_domain + '/index/index.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        location_id: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r,res) {
        console.log(res);
        that.setData({
          info: res.data.res.data,
          loaded : true
        })
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  fresh_title: function () {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: 'MOJIKIDS-莫急,好时光'
    })
  },
  pay: function (order_sn) {
    var that = this;
    wx.showToast({
      title: '调起支付',
      icon: 'loading',
      duration: 10000
    });
    app.util.yue_request({
      url: app.globalData.api_domain + '/payment/payment.php', //仅为示例，并非真实的接口地址
      data: {
        yue_login_id: app.globalData.yue_login_id,
        order_sn: order_sn
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r,res) {
        wx.hideToast();
        console.log('支付');
        console.log(res);
        var packages = res.data.res.data;
        var tick = {};
        if (packages.result == "20000") {
          tick = JSON.parse(packages.request_data);
          tick.success = function (res) {
            var status = res.errMsg;
            if (status == "requestPayment:ok") {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 10000
              });

              setTimeout(function () {
                wx.hideToast();
                wx.navigateTo({
                  url: '/pages/success/success?order_sn=' + order_sn
                })
              }, 1500)
            }
          },
            tick.fail = function (res) {
              console.log(res);
            }
        }
        wx.requestPayment(tick);

      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          tapping: false
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
    app.get_window_info(this);
  },
  onHide: function () {
    var that = this;
  },
  onShow: function () {
    var that = this;
  },
  onShareAppMessage: function () {
    app.globalData.mta.Event.stat("share", {});
    var obj = {
      title: 'MOJIKIDS莫吉相馆',
      path: '/pages/index/index'
    }
    return obj
  },
  go_to_details: function (e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goodsid;
    // if (!that.data.navigating) {
    //   wx.navigateTo({
    //     url: '/pages/details/details?goods_id=' + goods_id
    //   })
    //   that.setData({
    //     navigating: true
    //   })
    //   setTimeout(function () {
    //     that.setData({
    //       navigating: false
    //     })
    //   }, 1000)
    // }
    //app.navigateTo(page,options)
    //page 当前页面对象
    //options 原wx.navigateTo参数对象
    app.navigateTo(that,{
      url: '/pages/details/details?goods_id=' + goods_id,
      success : function(e){
        //成功
      },
      fail : function(e){
        //失败
      },
      complete : function(e){
        //完成
      }
    })
  },
  ct_test: function(){
    return
    var that = this;
    app.navigateTo(that, {
      url: '/pages/logs/logs',//'/pages/details/details?goods_id=' + goods_id,
      success: function (e) {
        //成功
      },
      fail: function (e) {
        //失败
      },
      complete: function (e) {
        //完成
      }
    })
  },
  jump_fade : function(e){
    var that = this;
    that.setData({
      jump_fade : 1
    })
  },
  close_jump : function(e){
    var that = this;
    that.setData({
      jump_fade : 0
    })
  }
})
