// pages/order_detail/order_detail.js
var app = getApp();
// var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_ms : '',
    current_payment : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.fresh_title();
    if(!options.sn){
      wx.showModal({
        title: '提示',
        content: '订单号不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta:1
            })
          } else if (res.cancel) {
          }
        }
      })
    }
    else{
      that.setData({
        sn: options.sn
      })
      //调用应用实例的方法获取全局数据
      app.ready(
        function (globalData) {
          that.fetch();
        },
        function () {

        })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.get_window_info(this);
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
    var that = this;
    clearTimeout(that.data.clear_num);
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
  
  },
  fresh_title: function (str) {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
  },
  fetch : function(){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    app.util.yue_request({
      url: app.globalData.api_domain + '/order_detail/order_detail.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        order_sn: that.data.sn
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r,res) {
        console.log(res);
        that.setData({
          info: res.data.res.data
        })
        if (res.data.res.data.status == '0'){
          that.count_second();
        }
        
        // var article = res.data.res.data.status_description;
        // /**
        // * WxParse.wxParse(bindName , type, data, target,imagePadding)
        // * 1.bindName绑定的数据名(必填)
        // * 2.type可以为html或者md(必填)
        // * 3.data为传入的具体数据(必填)
        // * 4.target为Page对象,一般为this(必填)
        // * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        // */
        // WxParse.wxParse('article', 'html', article, that, 15);
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  count_second : function(){
    var that = this;
    // var inas = that.data.info
    // inas.pay_time_left_microsecond = 10000;
    // that.setData({
      
    //   info: inas
    // })
    that.data.clear_num = setInterval(that.stack,1000)
  },
  stack : function(m,s){
    var that = this;
    var temp = that.data.info;
    var m = Math.floor(temp.pay_time_left_microsecond / 1000 / 60);
    var s = that.data.info.pay_time_left_microsecond / 1000 % 60;
    
    console.log(temp.pay_time_left_microsecond);
    console.log(temp.pay_time_left_microsecond - 1000 > 0)
    if (temp.pay_time_left_microsecond - 1000 > 0){
      temp.pay_time_left_microsecond = temp.pay_time_left_microsecond - 1000;
      
      that.setData({
        pay_ms: m + '分' + s + '秒',
        info: temp
      })
      console.log(that.data.pay_ms)
    }
    else{
      console.log('cccccccccc')
      clearTimeout(that.data.clear_num);
      that.fetch();
      // if (that.data.info.status_description.start){
      //   that.fetch();
      // }
    }
    
  },
  to_shop: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    switch (index) {
      case 0: break;
      case 1:
        var str = e.currentTarget.dataset.position;
        var arr = str.split(",");
        console.log(arr);
        console.log(parseFloat(arr[1]));
        console.log(parseFloat(arr[0]));
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
  nav_shop: function (e) {
    var that = this;
    console.log(e);

      app.navigateTo(that,{
        url: "/pages/store/store?store_id=" + e.currentTarget.dataset.storeid
      })

  },
  ac_button : function(e){
    var that = this;
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    switch(action){
      case 'exhibit' : 
          app.navigateTo(that,{
            url: "/pages/photos/photos?order_sn=" + that.data.sn
          })

      break;
      case 'pay': 
        var pay_way = that.data.info.pay_way;
        that.setData({
          current_payment: 0
        })
        that.show_payment(pay_way, that.data.sn);
        //that.pay(that.data.sn);
        break;
      case 'oncall': 
      wx.makePhoneCall({
        phoneNumber: value //仅为示例，并非真实的电话号码
      });
      break;
    }
  },
  show_payment: function (pay_way, order_sn) {
    var that = this;
    that.setData({
      current_pay_order: order_sn,
      show_payment_fade: 1,
      payway: pay_way,
      tapping: false
    })
    //that.pay(order_sn); 
  },
  choose_payway: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var payway = e.currentTarget.dataset.payway;
    that.setData({
      current_payment: index
    })
    console.log(payway)
    // switch(payway){
    //   case 'weixin' :break;
    // }
    console.log(e);
  },
  hide_fade: function () {
    var that = this;
    that.setData({
      show_payment_fade: 0,
      tapping: false
    })
  },
  payment_confirm: function (e) {
    var that = this;
    var way = that.data.payway[that.data.current_payment].value;
    var usable = e.currentTarget.dataset.usable
    var card_code = that.data.payway[that.data.current_payment].card_code;
    console.log(e);
    if (usable == '0') return
    console.log('go pay')
    switch (way) {
      case 'card':
        that.pay(that.data.current_pay_order, 'yypay_mcard', card_code); break;
      case 'weixin':
        that.pay(that.data.current_pay_order, 'wxpay_small'); break;
    }
  },
  pay: function (order_sn,pay_way, card_code) {
    var that = this;
    wx.showToast({
      title: '调起支付',
      icon: 'loading',
      duration: 10000
    });
    var card_code = card_code || '';
    console.log(card_code)
    if (!pay_way) return;
    app.util.yue_request({
      url: app.globalData.api_domain + '/payment/payment.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        order_sn: order_sn,
        pay_way: pay_way,
        card_code: card_code
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
          switch (pay_way) {
            case 'wxpay_small':
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
                    that.setData({
                      show_payment_fade: 0
                    })
                    wx.navigateTo({
                      url: '/pages/success/success?order_sn=' + order_sn
                    })
                  }, 1500)
                }
              },
                tick.fail = function (res) {
                  console.log(res);
                }
              wx.requestPayment(tick);
              break;
            case 'yypay_mcard':
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 10000
              });

              setTimeout(function () {
                wx.hideToast();
                that.setData({
                  show_payment_fade: 0
                })
                wx.navigateTo({
                  url: '/pages/success/success?order_sn=' + order_sn
                })
              }, 1500)
              break;
          }

        }
        else {
          wx.showModal({
            title: '提示',
            content: packages.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  page: 1,
                  order_list: [],
                  has_next: true,
                  show_payment_fade: 0
                })
                that.fetch();
              } else if (res.cancel) {
              }
            }
          })
        }


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
  go_to_child : function(){
    var that = this;
      app.navigateTo(that,{
        url: "/pages/order_subsets/order_subsets?order_sn=" + that.data.sn
      })
  },
  preview : function(e){
    var that = this;
    var qr = e.currentTarget.dataset.qr;
    console.log(qr);
    wx.previewImage({
      current: qr, // 当前显示图片的http链接
      urls: [qr] // 需要预览的图片http链接列表
    })
  }
})