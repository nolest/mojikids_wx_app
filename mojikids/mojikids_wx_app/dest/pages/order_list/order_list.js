// pages/order_list/order_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taps: [
      { types: 'all', text: '全部' },
      { types: 'unpaid', text: '待付款' },
      { types: 'tbc', text: '待到店' },
      { types: 'checkin', text: '待完成' },
      { types: 'completed', text: '已完成' }
    ],
    taps_index: 0,
    fetching: false,
    page: 1,
    order_list: [],
    has_next: true,
    show_empty: false,
    payway : [],
    payment_fade : 0,
    current_payment : 0,
    current_pay_order : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  fetch: function () {
    var that = this;
    if (!that.data.fetching && that.data.has_next) {
      that.setData({
        fetching: true
      })
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      //ajax拉数据
      app.util.yue_request({
        url: app.globalData.api_domain + '/order_list/order_list.php', //仅为示例，并非真实的接口地址
        data: {
          app_session: app.globalData.app_session,
          trade_type: that.data.taps[that.data.taps_index].types,
          page: that.data.page
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (r,res) {
          console.log(res);
          var list = res.data.res.data.list;
          var temp = that.data.order_list.concat(list);
          var has_next_page = res.data.res.has_next_page;
          if (temp.length == 0 && has_next_page == false && that.data.page == 1) {
            that.setData({
              show_empty: true
            })
          }
          else {
            that.setData({
              show_empty: false,
              order_list: temp,
              has_next: has_next_page,
              page: ++that.data.page
            })
          }


        },
        fail: function () {

        },
        complete: function () {
          wx.hideToast();
          that.setData({
            fetching: false
          })
        }
      })
    }
  },
  taps_btn: function (e) {
    console.log('taps');
    console.log(e);
    var that = this;
    if (that.data.tapping) {

    }
    else {
      that.setData({
        tapping: true
      })
      var action = e.target.dataset.action;
      var value = e.target.dataset.value;
      var order_sn = e.target.dataset.ordersn;
      var goods_id = e.target.dataset.goodsid;
      var pay_way = e.target.dataset.payway; //数组

      switch (action) {
        case 'pay': 
          app.globalData.mta.Event.stat('order_confirm', { '1qdbzf': 'true' }); 
          //that.pay(order_sn);
          that.setData({
            current_payment : 0
          })
          that.show_payment(pay_way, order_sn);
        break;
        case 'oncall':
          wx.makePhoneCall({
            phoneNumber: value, //仅为示例，并非真实的电话号码
            complete: function () {
              that.setData({
                tapping: false
              })
            }
          })
          break;
        case 'showmap':
          var str = value;
          var arr = str.split(",");
          // that.setData({
          //   show_map: 1,
          //   for_maps: {
          //     longitude: parseFloat(arr[0]),//113.345489,//经度113+-
          //     latitude: parseFloat(arr[1]),//23.141894, //纬度23+-
          //     markers: [{
          //       iconPath: "",///image/index/address-icon-32x32.png",
          //       id: 0,
          //       latitude: parseFloat(arr[1]),//23.141894,
          //       longitude: parseFloat(arr[0]) //113.345489//(arr[0]),
          //     }]
          //   }
          // });
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

          that.setData({
            tapping: false
          })
          break;
        case 'exhibit' : 
        console.log(123);
            app.navigateTo(that,{
              url: "/pages/photos/photos?order_sn=" + order_sn
            })

          that.setData({
            tapping: false
          })
        break;
        case 'restructure':
          app.navigateTo(that, {
            url: "/pages/storepick/storepick?order_sn=" + order_sn + "&goods_id=" + goods_id +"&from_page=" + 'order_list'
          })
          that.setData({
            tapping: false
          })
          break;
      }
    }


  },
  open_map : function(e){
    var that = this;
    if (that.data.tapping) {

    }
    else {
      that.setData({
        tapping: true
      })
      console.log(e);
      var value = e.currentTarget.dataset.value;
      var str = value;
      var arr = str.split(",");
      // that.setData({
      //   show_map: 1,
      //   for_maps: {
      //     longitude: parseFloat(arr[0]),//113.345489,//经度113+-
      //     latitude: parseFloat(arr[1]),//23.141894, //纬度23+-
      //     markers: [{
      //       iconPath: "",///image/index/address-icon-32x32.png",
      //       id: 0,
      //       latitude: parseFloat(arr[1]),//23.141894,
      //       longitude: parseFloat(arr[0]) //113.345489//(arr[0]),
      //     }]
      //   }
      // });
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
      that.setData({
        tapping: false
      })
    }
  },
  go_to_detail : function(e){
    console.log('detail');
    console.log(e);
    var that = this;
    var sn = e.currentTarget.dataset.sn;
      app.navigateTo(that,{
        url: '/pages/order_detail/order_detail?sn=' + sn
      })

  },
  change_tap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      taps_index: index,
      page: 1,
      order_list: [],
      has_next: true
    })
    that.fetch();
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
    var that = this;
    that.fresh_title();
    //调用应用实例的方法获取全局数据
    app.ready(
      function (globalData) {
        var index = that.data.taps_index;
        that.setData({
          taps_index: index,
          page: 1,
          order_list: [],
          has_next: true
        })
        if (app.globalData.account_type == 3){
          that.fetch();
        }
        else{
          app.redirectTo(that, { //navigateTo redirectTo
            url: '/pages/bind/bind?no_back=1&page_from=order_list',
          })
        }
        
      },
      function () {

      })
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
    var that = this;
    that.fetch();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  fresh_title: function () {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
  },
  pay: function (order_sn, pay_way, card_code) {
    var that = this;
    wx.showToast({
      title: '调起支付',
      icon: 'loading',
      duration: 10000
    });
    var card_code = card_code || '';
    console.log(card_code)
    if (!pay_way)return;
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
          switch (pay_way){
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
            case 'yypay_mcard' : 
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
        else{
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
  show_payment: function (pay_way, order_sn){
    var that = this;
    that.setData({
      current_pay_order: order_sn,
      show_payment_fade : 1,
      payway : pay_way,
      tapping: false
    })
    //that.pay(order_sn); 
  },
  hide_fade : function(){
    var that = this;
    that.setData({
      show_payment_fade: 0,
      tapping: false
    })
  },
  choose_payway : function(e){
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
  payment_confirm : function(e){
    var that = this;
    var way = that.data.payway[that.data.current_payment].value;
    var usable = e.currentTarget.dataset.usable
    var card_code = that.data.payway[that.data.current_payment].card_code;
    console.log(e);
    if (usable == '0')return
    console.log('go pay')
    switch (way){
      case 'card': 
        that.pay(that.data.current_pay_order, 'yypay_mcard', card_code);break;
      case 'weixin' : 
        that.pay(that.data.current_pay_order, 'wxpay_small'); break;
    }
  }
})