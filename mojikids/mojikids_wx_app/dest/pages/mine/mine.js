// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: '储值卡', url: '', types: 'prepaid', show: '1' },
      { name: '打开储值卡', url: '', types: 'open_prepaid', show: '0' },
      { name: '优惠券', url: '/pages/coupon/coupon', types: 'coupon', show: '1' },
      { name: '设置', url: '/pages/setting/setting', types: 'setting', show: '1' },
      { name: '预约协议', url: '/pages/agree/agree?id=1', types: 'agreement', show: '1' },
      { name: '致电客服', url: '/pages/call/call', types: 'call', show: '1' },
      { name: '关于我们', url: '/pages/about/about', types: 'about', show: '1' },
      { name: '邀请有礼', url: '/pages/invite/invite', types: 'coupon', show: '0' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //清楚全局优惠券状态
    // app.globalData.coupon.list = null;
    // app.globalData.coupon.coupon_sn = null;
    // app.globalData.coupon.coupon_name = null;
  },
  go_to_edit: function () {
    var that = this;
    app.navigateTo(that, {
      url: '/pages/profile_edit/profile_edit'
    })
  },
  fetch: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    app.util.yue_request({
      url: app.globalData.api_domain + '/mine/mine.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        target_id: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(res);
        //var temp = res.data.res.data;
        //temp.user_info.data.is_card_user = 1;
        that.setData({
          info: res.data.res.data
        })

        if (res.data.res.data.user_info.data.is_card_user == 1) {
          var temp = that.data.list;
          temp[0].show = '1';
          that.setData({
            list: temp
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
  taps: function (e) {
    var that = this;
    var types = e.currentTarget.dataset.types;
    var url = e.currentTarget.dataset.url;
    console.log(url);
    if (types == "call") {
      wx.showActionSheet({
        itemList: ['13602408810', '18664673184'],
        success: function (res) {
          console.log(res);
          var phone = '';
          switch (res.tapIndex) {
            case 0: phone = '13602408810'; break;
            case 1: phone = '18664673184'; break;
          }
          if (phone) {
            wx.makePhoneCall({
              phoneNumber: phone //仅为示例，并非真实的电话号码
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
    else if (types == "prepaid") {
      console.log(types)
      if (that.data.info.user_info.data.is_card_user == 1) {
        var card_list = that.data.info.user_info.data.card_list;
        if (card_list[0].is_add_wxpackage == "0"){
          console.log("add")
          that.get_card(card_list[0]);
        }
        else{
          console.log("open")
          wx.openCard({
            cardList: [card_list[0]],
            success: function (ss) {
              console.log(ss)
            },
            fail: function (ss) {
              console.log(ss)
            }
          })
        }
        
      }
      else {
        wx.showModal({
          title: '提示',
          content: '咦，您还没有办理储值卡，请到门店申请办理吧！',
          showCancel: false,
          success: function (s) {
            if (s.confirm) {
            } else if (s.cancel) {
            }
          }
        })
      }
    }
    else if (types == "open_prepaid"){
      console.log(123)
      var a = that.data.info.user_info.data.card_list;
      console.log(that.data.info.user_info.data.card_list)
      wx.openCard({
        cardList: a,
        success: function (ss) {
          console.log(ss)
        },
        fail: function (ss) {
          console.log(ss)
        } 
      })
    }
    else {
      console.log('1')
      app.navigateTo(that, {
        url: url
      })

    }

  },
  get_card: function (card_obj){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    app.util.yue_request({
      url: app.globalData.api_domain + '/mine/add_card.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        wx_card_id: card_obj.cardId,//数组，但写死第一张卡
        wx_card_code: card_obj.code
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r, res) {
        console.log(res);
        var a = res.data.res.data.data
        wx.addCard({
          cardList: [a],
          success: function (ss) {
            
            console.log(ss)
            console.log(ss.cardList) // 卡券添加结果
          },
          fail: function (ss){
            console.log(ss)
          }
        })
        setTimeout(function(){
          that.fetch();
        },1500)
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  go_to_bb: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;

    app.navigateTo(that, {
      url: '/pages/bb/bb?image_ids=' + id
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
    var that = this;
    that.fresh_title();
    //调用应用实例的方法获取全局数据
    //每次显示页面刷新状态
    app.ready(
      function (globalData) {
        if (app.globalData.account_type == 3) {
          that.fetch();
        }
        else {
          app.redirectTo(that, { //navigateTo
            url: '/pages/bind/bind?no_back=1&page_from=mine',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  fresh_title: function () {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },
  go_to_bb_list: function () {
    var that = this;

    app.navigateTo(that, {
      url: '/pages/bb_list/list'
    })

  },
  go_to_file: function () {
    var that = this;
    app.navigateTo(that, {
      url: '/pages/bb_file/file'
    })

  }
})