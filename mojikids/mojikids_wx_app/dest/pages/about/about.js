// pages/about/about.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: '门店信息', url: '/pages/store/store?store_id=231449', types: 'store', show: '1' },
      { name: '拍摄须知', url: '/pages/agree/agree?id=3', types: 'agree', show: '1' },
      { name: '意见反馈', url: '/pages/feedback/feedback', types: 'feedback', show: '1' }
    ]
  },
  taps: function (e) {
    var that = this;
    var types = e.currentTarget.dataset.types;
    var url = e.currentTarget.dataset.url;
    console.log(url);
    if (types == "call") {
      
    }
    else {
        app.navigateTo(that,{
          url: url
        })

    }

  },
  fresh_title: function () {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: '关于我们 - 莫吉照相馆'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this;
  that.fresh_title();
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  on : function(){
    var that =  this;
    wx.showModal({
      title: '',
      content : JSON.stringify(that.data.window)
    })
  }
})