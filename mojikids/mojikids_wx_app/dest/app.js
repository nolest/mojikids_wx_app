//app.js
var mta = require('/utils/mta_analysis.js');
var util = require('/utils/util.js');
var event = require('/utils/event.js');
var file_op = require('/modules/upload/upload.js');
App({
  events: new event(),
  onLaunch: function () {
    //调用统计
    mta.App.init({
      "appID": "500405474",
      "eventID": "500405689",
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
    var that = this;
    that.globalData.mta = mta;
    //调用API从本地缓存中获取数据
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
      }
    })
  },
  ready: function (cb, cb2) {
    //cb成功
    //cb2失败
    var that = this;
    //that.getUserInfo(cb,cb2,cb3);
    that.get_app_session(cb, cb2);
  },
  get_app_session: function (cb, cb2) {
    var that = this;
    if (that.globalData.app_session) {
      //已获取登录状态
      typeof cb == "function" && cb(that.globalData)
    } else {
      wx.login({
        success: function (data) {
          var code = data.code;
          var encryptedData = '';
          var iv = '';
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
          })
          wx.getUserInfo({
            success: function (resr) {
              // success
              console.log(resr);
              that.globalData.userInfo = resr.userInfo;
              encryptedData = resr.encryptedData;
              iv = resr.iv;
              that.util.yue_request({
                url: that.globalData.api_domain + '/app_login.php',//'https://yp.yueus.com/wx_snap/ajax/app_login.php', 
                data: {
                  encryptedData: encryptedData,
                  iv: iv,
                  code: code
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (r,res_2) {
                  that.globalData.app_session = res_2.data.result_data.result_data.app_session;
                  that.globalData.account_type = res_2.data.result_data.result_data.result;//2
                  that.globalData.cellphone = res_2.data.result_data.result_data.cellphone;
                  that.globalData.yue_login_id = res_2.data.result_data.result_data.user_id;

                  typeof cb == "function" && cb(that.globalData);
                  //荣少说 无用就不要管了 union_id 用于绑定手机
                  that.session_check(that.globalData.app_session);
                }
              })
            },
            fail: function (resr) {
              // fail
              wx.showModal({
                title: '微信授权失败',
                content: '请点击「确定」>「设置」中打开「用户信息」，令小程序获得授权。如您有任何问题，请直接勾搭客服吧！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (ress) => {
                        /*
                         * res.authSetting = {
                         *   "scope.userInfo": true,
                         *   "scope.userLocation": true
                         * }
                         */
                        console.log(ress);
                        wx.reLaunch({
                          url: '/pages/index/index'
                        })
                      }
                    })
                  } else if (res.cancel) {
                  }
                }
              })
            },
            complete: function (resr) {
              // complete

            }
          })
        },
        fail: function (res) {
          // fail
          typeof cb2 == "function" && cb2(that.globalData);
        },
        complete: function (res) {
          // complete
          wx.hideToast();
        }
      })
    }
  },
  session_check: function (app_session, cb3) {
    console.log("in_check");
    var that = this;
    that.util.yue_request({
      url: that.globalData.api_domain + '/app_session.php',//https://yp.yueus.com/wx_snap/ajax/app_session.php',
      data: {
        app_session: app_session
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r,res) {
        that.globalData.union_id = res.data.result_data.union_id;
        console.log('app_session');
        console.log(res);
        typeof cb3 == "function" && cb3(that.globalData)
      }
    })
  },
  globalData: {
    userInfo: null, //账户信息
    account_type: null,
    app_session: null,
    union_id: null,
    cellphone: null,
    yue_login_id: null,
    systemInfo: null, //设备信息
    confirm: {
      goods_id: null,
      store_id: null,
      standard_id: null,
      buy_num: null,
      timezone_id: null,
      service_time: null
    },
    router: {
      index: {
        tap_cur: 0,
        change_by: ''
      }
    },
    form_ewm: {
      index: null,
      details: null
    },
    first_in:{
      date_pick : true
    },
    api_domain: 'https://mojikids.yueus.com/wx_api_v_1_2',//'https://mojikids.yueus.com/wx_api',//,
    coupon_choose: {
      list: null,
      coupon_sn: null,
      coupon_name: null
    },
    page_details_set_store:0
  },
  util: util,
  file_op: file_op,
  get_window_info: function (page) {
    var that = this;
    //获取当前页面的窗口信息，在每个page 调用
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          window: res
        })
      }
    })

    // try {
    //   res = wx.getSystemInfoSync()
    //   page.setData({
    //     window: res
    //   })
    //   console.info('app');
    // } catch (e) {
    //   // Do something when catch error
    //   console.log('app get_window error in get_window_info');
    //   console.log(e);
    // }
  },
  navigateTo: function (page,options) {
    var url = options.url || '',
      page = page || {},
      success = options.success || function () { },
      fail = options.fail || function () { },
      complete = options.complete || function () { };

    if (!page.data.navigating) {
      wx.navigateTo({
        url: url,
        success: function (e) {
          console.log(e);
          if (typeof success == 'function') { success.call(page,e) }
        },
        fail: function (e) {
          if (typeof fail == 'function') { fail.call(page,e) }
        },
        complete: function (e) {
          if (typeof complete == 'function') { complete.call(page,e) }
        }
      })
    }
    page.setData({
      navigating: true
    })
    setTimeout(function () {
      page.setData({
        navigating: false
      })
    }, 1000)
  },
  redirectTo : function(page,options){
    var url = options.url || '',
      page = page || {},
      success = options.success || function () { },
      fail = options.fail || function () { },
      complete = options.complete || function () { };

    if (!page.data.redirecting) {
      wx.redirectTo({
        url: url,
        success: function (e) {
          console.log(e);
          if (typeof success == 'function') { success.call(page, e) }
        },
        fail: function () {
          if (typeof fail == 'function') { fail.call(page, e) }
        },
        complete: function (e) {
          if (typeof complete == 'function') { complete.call(page, e) }
        }
      })
    }
    page.setData({
      redirecting: true
    })
    setTimeout(function () {
      page.setData({
        redirecting: false
      })
    }, 1000)
  }
})