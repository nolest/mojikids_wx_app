// pages/confirm/confirm.js
var app = getApp();
Page({
  data: {
    account_type: '',
    goods_id: '',
    standard_id: '',
    buy_num: '',
    timezone_id: '',
    service_time: '',
    info: null,
    next_btn_2: '确认并支付',
    show_confirm_fade: 0,
    fade_message: '',
    fade_title: '',
    windowHeight: app.globalData.systemInfo.windowHeight,
    windowWidth: app.globalData.systemInfo.windowWidth,
    check: '',
    check_res: '',
    cancel_types: '',
    inputs: {
      username: '',
      phone: '',
      email: '',
      baby_age: '',
      description: '',
      area: ''
    },
    coupon_sn: null,
    coupon_name: null,
    prepaid: 0,
    current_payment: 0
  },
  cancel_fade: function () {
    if (this.data.cancel_types == "cb") {
      this.cancel_fade_cb();
    }
    else {
      this.setData({
        show_confirm_fade: 0
      })
    }

  },
  cancel_fade_cb: function () {
    this.setData({
      cancel_types: ''
    })
    wx.switchTab({
      url: '/pages/order_list/order_list',
    })
  },
  onLoad: function (options) {
    //调用统计
    app.globalData.mta.Page.init();
    app.globalData.mta.Event.stat("order_confirm", {});
    app.globalData.coupon_choose.coupon_sn = null;
    app.globalData.coupon_choose.coupon_name = null;
    app.globalData.coupon_choose.list = null;
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    app.ready(function (systemInfo) {
      that.setData({
        account_type: systemInfo.account_type,
        buy_num: options.buy_num,
        goods_id: options.goods_id,
        service_time: options.service_time,
        standard_id: options.standard_id,
        timezone_id: options.timezone_id,
        store_id: options.store_id
      })

      that.fetch();
    },
      function (userInfo) {

      },
      function () {

      });
  },
  calculate_order: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    app.util.yue_request({
      url: app.globalData.api_domain + '/confirm/calculate_order.php',
      data: {
        app_session: app.globalData.app_session,
        buy_num: that.data.buy_num,
        store_id: '',
        goods_id: that.data.goods_id,
        service_time: that.data.service_time,
        standard_id: that.data.standard_id,
        timezone_id: that.data.timezone_id,
        store_id: that.data.store_id,
        coupon_sn: that.data.coupon_sn
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(res);
        if (res.data.res.data.result == "1") {
          var info = that.data.info;
          info.bill = res.data.res.data.data.bill;
          info.username = that.data.inputs.username;
          info.pay_way = res.data.res.data.data.pay_way;
          info.phone = that.data.inputs.phone;
          info.email = that.data.inputs.email;
          info.baby_age = that.data.inputs.baby_age;
          info.description = that.data.inputs.description;
          info.area = that.data.inputs.area;

          console.log('优惠券计算')
          console.log(info.pay_way);
          that.setData({
            info: info,
            inputs: {
              username: info.username,
              phone: info.phone,
              email: info.email,
              baby_age: info.baby_age,
              description: info.description,
              area: info.area
            }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data.res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        }

      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  fetch: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    var that = this;
    app.util.yue_request({
      url: app.globalData.api_domain + '/confirm/confirm.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        buy_num: that.data.buy_num,
        store_id: '',
        goods_id: that.data.goods_id,
        service_time: that.data.service_time,
        standard_id: that.data.standard_id,
        timezone_id: that.data.timezone_id,
        store_id: that.data.store_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(res);
        var info = res.data.res.data;
        info.area = "";
        console.log(info);
        var re_name = info.coupon.name ? info.coupon.name : '返回无优惠券名称'
        var re_sn = info.coupon.coupon_sn ? info.coupon.coupon_sn : null
        that.setData({
          info: info,
          inputs: {
            username: info.username,
            phone: info.phone,
            email: info.email ? info.email : '',
            baby_age: info.baby_age ? info.baby_age : '',
            description: '',
            area: ''
          },
          coupon_name: re_name,
          coupon_sn: re_sn
        })
        console.log(re_name);

        app.globalData.coupon_choose.coupon_name = re_name;
        app.globalData.coupon_choose.coupon_sn = re_sn;
        app.globalData.coupon_choose.list = that.data.info.coupon_list;
        console.log('加载设置优惠券');
        console.log(app.globalData.coupon_choose)
        that.check();
        that.fresh_title(info.title);
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  hide_fade: function () {
    var that = this;
    // that.setData({
    //   show_payment_fade: 0,
    //   tapping: false
    // })
  },
  bindInput: function (e) {
    var that = this;
    var types = e.target.dataset.type;
    var inputs = that.data.inputs;
    inputs[types] = e.detail.value;
    that.setData({
      inputs: inputs
    })
    this.check();
  },
  check: function () {
    if ((this.data.inputs.username.length != 0) && (this.data.inputs.username != "0") && (this.data.inputs.baby_age != 0) && (this.data.inputs.username.trim()) && (parseInt(this.data.inputs.phone).toString().length == 11) && (this.data.inputs.phone.trim()) && (this.data.inputs.email.trim() == '' || this.data.inputs.email.match(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/))) {
      this.setData({
        check: true,
        check_res: ''
      })
    }
    else {
      var check_res = '';
      if (!(this.data.inputs.username.length != 0)) {
        check_res = 'username';
      }
      else if (!(this.data.inputs.username != "0")) {
        check_res = 'username_zero'
      }
      else if (!(this.data.inputs.baby_age != 0)) {
        check_res = 'baby_age';
      }
      else if (!(this.data.inputs.username.trim())) {
        check_res = 'username_null';
      }
      else if (!(parseInt(this.data.inputs.phone).toString().length == 11)) {
        check_res = 'phone';
      }
      else if (!(this.data.inputs.phone.trim())) {
        check_res = 'phone_null';
      }
      else if (!(this.data.inputs.email.trim() == '' || this.data.inputs.email.match(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/))) {
        check_res = 'email';
      }
      else {
        check_res = ''
      }
      this.setData({
        check: false,
        check_res: check_res
      })
    }
  },
  show_payment: function (pay_way, order_sn) {
    var that = this;
    that.setData({
      current_pay_order: order_sn,
      show_payment_fade: 1,
      outer_pay_way: pay_way,
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
  payment_confirm: function (e) {
    var that = this;
    var way = that.data.outer_pay_way[that.data.current_payment].value;
    var usable = e.currentTarget.dataset.usable
    var card_code = that.data.outer_pay_way[that.data.current_payment].card_code;
    console.log(e);
    console.log(usable);
    console.log(typeof usable);
    if (usable == '0') return
    console.log('go pay')
    switch (way) {
      case 'card':
        that.pay(that.data.current_pay_order, 'yypay_mcard', card_code); break;
      case 'weixin':
        that.pay(that.data.current_pay_order, 'wxpay_small'); break;
    }
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
      success: function (r, res) {
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
              }
                tick.fail = function (res) {
                  app.globalData.router.index.tap_cur = 1;
                  app.globalData.router.index.change_by = "confirm";

                  that.setData({
                    show_confirm_fade: 1,
                    fade_title: '订单已提交，支付失败',
                    fade_message: '请到订单列表页再次发起支付',
                    cancel_types: 'cb'
                  })

                }
              setTimeout(function () {
                wx.hideToast();
                wx.requestPayment(tick);
              }, 1500)
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
  submit: function () {
    var that = this;
    var order_sn = '';
    app.globalData.mta.Event.stat('order_confirm', { '1qdbzf': 'true' });
    if (!that.data.check) {
      var fade_message = '';
      switch (that.data.check_res) {
        case 'username': fade_message = '预约人不能为空'; break;
        case 'username_zero': fade_message = '请正确填写联系人'; break;
        case 'baby_age': fade_message = '宝宝年龄不能为空'; break;
        case 'username_null': fade_message = '预约人不能为空'; break;
        case 'phone': fade_message = '请填写11位手机号'; break;
        case 'phone_null': fade_message = '手机号不能为空'; break;
        case 'email': fade_message = '请正确填写邮箱'; break;
      }
      that.setData({
        show_confirm_fade: 1,
        fade_title: '请检查提交信息',
        fade_message: fade_message
      })
    }
    else {
      wx.showToast({
        title: '提交中',
        icon: 'loading',
        duration: 10000
      })

      app.util.yue_request({
        url: app.globalData.api_domain + '/confirm/submit.php', //仅为示例，并非真实的接口地址
        data: {
          app_session: app.globalData.app_session,
          buy_num: that.data.buy_num,
          store_id: that.data.store_id,
          goods_id: that.data.goods_id,
          service_time: that.data.service_time,
          standard_id: that.data.standard_id,
          timezone_id: that.data.timezone_id,
          store_id: that.data.store_id,
          username: that.data.inputs.username,
          phone: that.data.inputs.phone,
          email: that.data.inputs.email,
          baby_age: that.data.inputs.baby_age,
          description: that.data.inputs.description,
          area: that.data.inputs.area,
          coupon_sn: that.data.coupon_sn,
          trial_code: '',
          trial_version: ''
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (r, res) {
          wx.hideToast();
          if (res.data.res.data.result == "20000") {
            //订单已提交
            wx.showToast({
              title: '订单提交成功',
              icon: 'success',
              duration: 1500
            })
            that.setData({
              current_payment: 0
            })


            if (res.data.res.data.pay_rst.result == "20000") {
              console.log('订单提交成功')
              console.log(that.data.info.pay_way)
              that.show_payment(that.data.info.pay_way, res.data.res.data.order_sn);
            }
            else if (res.data.res.data.pay_rst.result == "20100") {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500
              })
              that.setData({
                current_payment: 0,
                show_payment_fade: 0
              })
              app.navigateTo(that, {
                url: '/pages/success/success?order_sn=' + res.data.res.data.order_sn
              })
            }
            else {
              console.log('123213')
            }
          }
          else {
            //提交订单异常
            that.setData({
              show_confirm_fade: 1,
              fade_title: '提交失败',
              fade_message: res.data.res.data.message
            })
          }
          console.log(res);
        },
        fail: function () {
          wx.hideToast();
          that.setData({
            show_confirm_fade: 1,
            fade_title: '提交失败',
            fade_message: '订单提交失败，请重试'
          })
        },
        complete: function () {
          wx.hideToast();
        }
      })
    }

  },
  fresh_title: function (str) {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: str
    })
  },
  payment: function () {
    wx.requestPayment({
      complete: function () {
        console.log('payment');
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
    app.get_window_info(this);
  },
  onShow: function () {
    // 页面显示
    var that = this;
    console.log("show");
    that.setData({
      coupon_sn: app.globalData.coupon_choose.coupon_sn ? app.globalData.coupon_choose.coupon_sn : '',
      coupon_name: app.globalData.coupon_choose.coupon_sn ? that.get_coupon_name(app.globalData.coupon_choose.coupon_sn) : that.setData({ coupon_sn: '' })
    })
    if (app.globalData.coupon_choose.just_in_choose) {
      that.calculate_order();
      app.globalData.coupon_choose.just_in_choose = null;
    }
  },
  get_coupon_name: function (coupon_sn) {
    var that = this;
    var list = that.data.info.coupon_list.available;
    for (var i in list) {
      if (list[i].coupon_sn == coupon_sn) {
        return list[i].name
      }
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  go_to_coupon: function (e) {
    console.log(e)
    var that = this;
    var url = '';
    if (that.data.info.is_card_user == '1') {
      url = '/pages/coupon_choose/coupon_choose?is_card_user=card'
    }
    else {
      url = '/pages/coupon_choose/coupon_choose'
    }
    app.navigateTo(that, {
      url: url,
      fail: function (e) {
        console.log(e)
      }
    })
  }
})