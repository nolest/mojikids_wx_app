// pages/storepick/storepick.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_notice_fade: 0,
    current_store: 100,
    goods_id: '',
    schedule_id: '',
    standard_id: '',
    store_id: '',
    store_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var from_page = options.from_page;
    that.setData({
      from_page: from_page
    })
    if (from_page == 'order_list') {
      console.log('order_list', options)
      that.setData({
        order_sn: options.order_sn,
        goods_id: options.goods_id,
        first_in: true
      })
    }
    else if (from_page == 'details') {
      that.setData({
        goods_id: options.goods_id,
        schedule_id: options.schedule_id,
        standard_id: options.standard_id,
        store_id: options.store_id,
        store_name: options.store_name,
        first_in: true
      })
    }
    else {

    }

    app.ready(function (systemInfo) {
      that.fetch();
    },
      function (userInfo) {

      },
      function () {

      });
  },
  fetch: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    app.util.yue_request({
      url: app.globalData.api_domain + '/details/details.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        location_id: '',
        goods_id: that.data.goods_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(r);
        console.log(res);
        var store = r.res.data.store;
        that.setData({
          store: store
        })
        that.fresh_title('门店选择');
        //console.log(that.data.first_in , app.globalData.first_in.date_pick)
        if (that.data.first_in && app.globalData.first_in.date_pick) {
          that.setData({
            show_notice_fade: 1,
            first_in: false
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
  fresh_title: function (str) {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: str
    })
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
  notice_confirm: function () {
    var that = this;
    that.setData({
      show_notice_fade: 0
    })
  },
  notice_cancel_fade: function () {
    var that = this;
    app.globalData.first_in.date_pick = false
    that.setData({
      show_notice_fade: 0
    })
  },
  choose_store_in_fade: function (e) {
    var that = this;
    var storeindex = e.currentTarget.dataset.storeindex;
    var scheduleid = e.currentTarget.dataset.scheduleid;
    var storeid = e.currentTarget.dataset.storeid;
    var storenamestr = e.currentTarget.dataset.storenamestr;
    console.log(storeindex)
    that.setData({
      current_store: storeindex,
      schedule_id: scheduleid,
      store_id: storeid,
      store_name: storenamestr
    })

    if (that.data.from_page == 'order_list') {

    }
    else if (that.data.from_page == 'details') {
      app.globalData.page_details_set_store = storeindex;
    }
    else {

    }

    app.redirectTo(that, {
      url: '/pages/datepick/datepick?schedule_id=' + that.data.schedule_id + '&goods_id=' + that.data.goods_id + '&standard_id=' + that.data.standard_id + '&store_name=' + that.data.store_name + '&store_id=' + that.data.store_id + '&from_page=' + that.data.from_page + '&order_sn=' + that.data.order_sn
    })
  }
})