// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_notice_fade : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.get_window_info(this);
    var is_card_user = options.is_card_user;
    console.log(is_card_user);
    if (is_card_user == 'card'){
      that.setData({
        show_notice_fade : 1
      })
    }
    that.fresh_title();

    var empty = false;
    if (app.globalData.coupon_choose.list.available.length == 0 && app.globalData.coupon_choose.list.forbidden.length == 0){
      empty = true
    }
    that.setData({
      choose_sn: app.globalData.coupon_choose.coupon_sn,
      info: app.globalData.coupon_choose.list,
      empty: empty
    })

    app.globalData.coupon_choose.just_in_choose = 1;
    
    //调用应用实例的方法获取全局数据
    // if (app.globalData.coupon.list != null){
    //   //从确认页进
    //   that.setData({
    //     from_confirm : true,
    //     info: app.globalData.coupon.list
    //   })
    // }
    // else{
    //   //从我的进 我的页面清空全局数据
    //   app.ready(
    //     function (globalData) {
    //       that.fetch();
    //     },
    //     function () {

    //     })
    // }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    console.log('123');
    console.log(app.globalData.coupon_choose)
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
      title: '选择优惠券'
    })
  },
  choosen_coupon: function (e) {
    var sn = e.currentTarget.dataset.sn;
    var name = e.currentTarget.dataset.name;
    app.globalData.coupon_choose.coupon_sn = sn;
    app.globalData.coupon_choose.coupon_name = name;
    wx.navigateBack({
      delta: 1
    })
  },
  dont_use : function(){
    app.globalData.coupon_choose.coupon_sn = null;
    app.globalData.coupon_choose.coupon_name = null;
    wx.navigateBack({
      delta: 1
    })
  },
  fvck_arrow: function (e) {
    console.log(e);
    var that = this;
    var fidx = e.currentTarget.dataset.fidx;
    var cidx = e.currentTarget.dataset.cidx;
    var ftype = e.currentTarget.dataset.ftype;
    var temp = that.data.info;
    temp[ftype][fidx].cur ? temp[ftype][fidx].cur = false : temp[ftype][fidx].cur = true;
    that.setData({
      info: temp
    })
  },
  notice_cancel_fade : function(){
    console.log('cancel')
    var that = this;
    that.setData({
      show_notice_fade : 0
    })
  },
  notice_confirm : function(){
    console.log('confirm')
    var that = this;
    wx.navigateBack({
      delta : 1
    })
  }
})