// pages/order_subsets/order_subsets.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page : 1,
    fetching: false,
    has_next: true,
    list : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.fresh_title();
    if (!options.order_sn) {
      wx.showModal({
        title: '提示',
        content: '订单号不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
          }
        }
      })
    }
    else {
      that.setData({
        sn: options.order_sn
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
  fetch: function () {
    var that = this;
    console.log()
    if (!that.data.fetching && that.data.has_next) {
      that.setData({
        fetching: true
      })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    app.util.yue_request({ 
      url: app.globalData.api_domain + '/order_subsets/order_subsets.php', //仅为示例，并非真实的接口地址
      data: {
        app_session: app.globalData.app_session,
        order_sn: that.data.sn,
        page : that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (r,res) {
        console.log(res);
        var has_next_page = res.data.res.has_next_page;
        if (res.data.res.data.result != 1 && that.data.page == 1){
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.res.data.message,
          //   showCancel: false,
          //   success: function (res) {
          //     if (res.confirm) {
          //       wx.navigateBack({
          //         delta: 1
          //       })
          //     } else if (res.cancel) {
          //     }
          //   }
          // })
          that.setData({
            show_empty: true
          })
        }
        else{
          if (res.data.res.data.result == 1) {
            console.log(res.data.res.data)
            var end = that.data.list.concat(res.data.res.data.list);
            that.setData({
              info: res.data.res.data,
              page: ++that.data.page,
              has_next: has_next_page,
              list: end
            })
          }
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
  fresh_title: function (str) {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: '子订单记录'
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
  bot : function(){
    var that = this;
    console.log(321);
    that.fetch();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})