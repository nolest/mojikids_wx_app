// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fetch_types: [
      { types: 'available', page: 1, has_next: true, list: [] },
      { types: 'forbidden', page: 1, has_next: true, list: [] }
    ],
    fetch_index: 0,
    fetching: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.fresh_title();
    console.log(options);
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

    app.ready(
      function (globalData) {
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

    if (that.data.fetch_types[that.data.fetch_index].has_next && !that.data.fetching) {
      app.util.yue_request({
        url: app.globalData.api_domain + '/mine/get_coupon_list.php', //仅为示例，并非真实的接口地址
        data: {
          app_session: app.globalData.app_session,
          coupon_type: that.data.fetch_types[that.data.fetch_index].types,
          page: that.data.fetch_types[that.data.fetch_index].page
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (r,res) {
          
          var list = res.data.res.data;
          console.log(list);
          var has_next_page = res.data.res.has_next_page;
          var temp = that.data.fetch_types;
          temp[that.data.fetch_index].list = temp[that.data.fetch_index].list.concat(list);
          temp[that.data.fetch_index].page = ++temp[that.data.fetch_index].page;
          temp[that.data.fetch_index].has_next = has_next_page;
          that.setData({
            fetch_types: temp
          })
          if (that.data.fetch_index == 0 && !has_next_page ){
            that.setData({
              fetch_index : 1
            })
            that.fetch();
          }
          else if (that.data.fetch_index == 1 && !has_next_page && that.data.fetch_types[1].list.length == 0 && that.data.fetch_types[0].list.length == 0 ){
            that.setData({
              empty: 1
            })
          }
          else{

          }
        },
        fail: function () {

        },
        complete: function () {
          that.setData({
            fetching: false
          }
          )
          wx.hideToast();
        }
      })
    }
    else {

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
    var that = this;
    if (that.data.fetch_types[that.data.fetch_index].has_next && !that.data.fetching) {
      that.fetch();
    }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  fresh_title: function () {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: '我的优惠券'
    })
  },
  choosen_coupon: function (e) {
    var sn = e.currentTarget.dataset.sn;
    var name = e.currentTarget.dataset.name;
    // app.globalData.coupon.coupon_sn = sn;
    // app.globalData.coupon.coupon_sn = name;

    wx.navigateBack({
      delta: 1
    })
  },
  fvck_arrow : function(e){
    var that = this;
    var fidx = e.currentTarget.dataset.fidx;
    var cidx = e.currentTarget.dataset.cidx;
    var ftype = e.currentTarget.dataset.ftype;
    var temp = that.data.fetch_types;
    temp[ftype].list[fidx].cur ? temp[ftype].list[fidx].cur = false : temp[ftype].list[fidx].cur = true;
    that.setData({
      fetch_types: temp
    })
  }
})