// pages/datepick/datepick.js
var app = getApp();
Page({
  data: {
    schedule_id: '',
    goods_id: '',
    standard_id: '',
    buy_num: '1', //伟标说写死是1
    store_id: '',
    account_type: '',
    show_date: '',
    date_title: '',
    title: '档期选择',
    display: {
      year: '',
      month: ''
    },
    day: ['日', '一', '二', '三', '四', '五', '六'],
    windowWidth: app.globalData.systemInfo.windowWidth,
    windowHeight: app.globalData.systemInfo.windowHeight,
    date_pick_distr: '',
    date_pick_str: '',
    date_pick_zone: [],
    zone: {
      title: "",
      value: "",
      sotck: ""
    },
    zone_pick_index: null,
    show_confirm_fade: 0,
    store_name: '',
    navigating: false,
    show_notice_fade: 0
  },
  onLoad: function (options) {
    console.log(options);
    //调用统计
    app.globalData.mta.Page.init();
    app.globalData.mta.Event.stat("order", {});
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    var that = this;
    if (options.from_page == 'order_list') {
      that.setData({
        order_sn: options.order_sn
      })
    }
    else if (options.from_page == 'details') {

    }
    else {

    }

    that.setData({
      //first_in: true,
      from_page: options.from_page
    })
    // 页面初始化 options为页面跳转所带来的参数
    app.ready(function (systemInfo) {
      that.setData({
        account_type: systemInfo.account_type,
        schedule_id: options.schedule_id,
        show_date: options.show_date,
        goods_id: options.goods_id,
        standard_id: options.standard_id,
        store_name: options.store_name,
        store_id: options.store_id
      })


      that.strict_days(that.data.show_date);
      // var m ='',y='';
      // if(!that.data.show_date){
      //   //无传日期，计算显示日期和提交日期
      //   var months = "";
      //   if(new Date().getMonth()+''.length ==1 ){
      //     months = '0'+ (new Date().getMonth() + 1)
      //   }
      //   else{
      //     months = new Date().getMonth()+1
      //   }
      //   var year = new Date().getFullYear() + '';
      //   var str = year + months;
      //   that.setData({
      //     show_date : str,
      //     display : {
      //       year : year,
      //       month : parseInt(months)
      //     }
      //   });
      // }
      // else{
      //   //有传日期，做分割，计算显示日期
      //   var ori = that.data.show_date
      //   var year_for_display = ori.substring(0,4);
      //   var month_for_display = ori.substring(4,ori.length);
      //   that.setData({
      //     display : {
      //       year : year_for_display,
      //       month : parseInt(month_for_display)
      //     }
      //   });
      // }

      console.log('fetch')
      
    },
      function (userInfo) {

      },
      function () {

      });
  },
  strict_days: function (show_date) {
    var that = this;
    var m = '', y = '';
    if (!show_date) {
      //无传日期，计算显示日期和提交日期
      var months = "";
      if ((new Date().getMonth() + '').length == 1) {
        months = '0' + (new Date().getMonth() + 1);
      }
      else {
        months = new Date().getMonth() + 1;
      }
      var year = new Date().getFullYear() + '';
      var str = year + months;
      that.setData({
        show_date: str,
        display: {
          year: year,
          month: parseInt(months)
        }
      });
    }
    else {
      //有传日期，做分割，计算显示日期
      var ori = show_date;
      var year_for_display = ori.substring(0, 4);
      var month_for_display = ori.substring(4, ori.length);
      if (month_for_display.length == 1) {
        show_date = year_for_display + '0' + month_for_display
      }
      that.setData({
        show_date: show_date,
        display: {
          year: year_for_display,
          month: parseInt(month_for_display)
        }
      });
    }
  },
  tap_day: function (e) {
    console.log(e);
    var date_pick_distr = e.currentTarget.dataset.distr;
    var date_pick_str = e.currentTarget.dataset.str;
    var date_pick_zone = e.currentTarget.dataset.zone;
    var can_book = e.currentTarget.dataset.canbook;
    app.globalData.mta.Event.stat('order', { '1xzrq': 'true' });
    if (can_book != "1") {
      return
    }
    this.setData({
      date_pick_distr: date_pick_distr,
      date_pick_str: date_pick_str,
      date_pick_zone: date_pick_zone,
      zone_pick_index: null
    })
  },
  zone_child: function (e) {
    var title = e.target.dataset.title;
    var value = e.target.dataset.value;
    var stock = e.target.dataset.stock;
    var index = e.target.dataset.index;
    app.globalData.mta.Event.stat('order', { '2xzsj': 'true' });
    this.setData({
      zone_pick_index: index,
      show_confirm_fade: 1,
      zone: {
        title: title,
        value: value,
        stock: stock
      }
    });
  },
  cancel_fade: function () {
    app.globalData.mta.Event.stat('order', { '4qx': 'true' });
    this.setData({
      show_confirm_fade: 0
    })
  },
  confirm: function () {
    app.globalData.mta.Event.stat('order', { '3qr': 'true' });
    var that = this;
    if (that.data.from_page == 'order_list') {
      that.submit_operate(that.data.order_sn, that.data.zone.value, that.data.store_id, that.data.date_pick_str)
    }
    else if (that.data.from_page == 'details') {
      app.navigateTo(that, {
        url: '/pages/confirm/confirm?goods_id=' + that.data.goods_id + '&standard_id=' + that.data.standard_id + '&buy_num=' + that.data.buy_num + '&service_time=' + that.data.date_pick_str + '&timezone_id=' + that.data.zone.value + "&store_id=" + that.data.store_id
      })
    }
    else {

    }
  },
  submit_operate: function (order_sn, timezone_id, store_id, service_time) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    app.util.yue_request({
      url: app.globalData.api_domain + '/order_list/order_operate.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        order_sn: order_sn,
        timezone_id: timezone_id,
        store_id: store_id,
        service_time, service_time
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: res.data.res.data.message,
          showCancel: false,
          success: function (s) {
            if (s.confirm) {
              console.log(res);
              if (res.data.res.data.result == 1) {
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
              }
            } else if (s.cancel) {
            }
          }
        })
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  fetch: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    app.util.yue_request({
      url: app.globalData.api_domain + '/datepick/datepick.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        schedule_id: that.data.schedule_id,//4,//
        show_date: that.data.show_date
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(res);
        var info = res.data.res.data;

        that.setData({
          info: info,
          zone_pick_index: null
        })

        that.fresh_title(info.title);

        if (that.data.first_in && app.globalData.first_in.date_pick) {
          // that.setData({
          //   show_notice_fade: 1,
          //   first_in: false
          // })
        }
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  fresh_title: function (str) {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: str
    })
  },
  fresh_days: function (e) {
    var that = this;
    var action = e.currentTarget.dataset.action;
    var str = '';
    var temp, y, m;
    console.log(str);
    switch (action) {
      case 'front':
        temp = new Date(that.data.display.year, parseInt(that.data.display.month));
        y = temp.getFullYear();
        m = temp.getMonth() + 1;
        str = y + '' + m;
        break;
      case 'back':
        temp = new Date(that.data.display.year, parseInt(that.data.display.month) - 2);
        y = temp.getFullYear();
        m = temp.getMonth() + 1;
        str = y + '' + m;
        break;
    }
    console.log(str);
    that.strict_days(str);
    that.fetch();
  },
  onReady: function () {
    // 页面渲染完成
    app.get_window_info(this);
  },
  onShow: function () {
    // 页面显示
    var that = this;
    console.log('onshwo');
    that.setData({
      date_pick_distr: '',
      date_pick_str: '',
      date_pick_zone: [],
      zone: {
        title: "",
        value: "",
        sotck: ""
      },
      zone_pick_index: null,
      show_confirm_fade: 0
    })
    that.fetch();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  notice_confirm: function () {
    var that = this;
    that.setData({
      show_notice_fade: 0
    })
  },
  notice_cancel_fade: function () {
    var that = this;
    // app.globalData.first_in.date_pick = false
    // that.setData({
    //   show_notice_fade: 0
    // })
  }
})