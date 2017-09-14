// pages/details/details.js
var app = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
var util = require('../../utils/util.js');
Page({
  data: {
    goods_id: '',
    windowHeight: app.globalData.systemInfo.windowHeight,
    windowWidth: app.globalData.systemInfo.windowWidth,
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    info: null,
    body_taps: ['拍摄样片', '套餐内容'],
    body_taps_index: 0,
    next_btn: '立即预约',
    next_btn_2: '下一步',
    step: 0,
    standard_text: '请选择套餐规格：',
    standard_pick: 0, //默认选中第一个套餐
    standard_id_pick: '',
    to_shop_url: '/pages/store/store',
    show_map: 0,
    for_maps: {},
    account_type: '',
    schedule_id: '',//用于下一步 跳转到档期选择页
    store_name_str: '',
    navigating: false,
    current_store: 0,
    show_store: 0,
    store_id: ''
  },
  onLoad: function (options) {
    console.log("here!");
    console.log(options);
    //=============================调用统计
    app.globalData.mta.Page.init();
    app.globalData.mta.Event.stat("detail_goods", {});
    //=============================扫码标记
    if (options.form == "ewm") {
      //从二维码进来
      app.globalData.form_ewm.details = true
    }
    //=============================页面逻辑
    var that = this;
    //=============================获取全局账号状态
    that.setData({
      account_type: app.globalData.account_type
    })
    //=============================发起请求
    that.setData({
      goods_id: options.goods_id
    })
    that.fetch();
  },
  nav_shop: function (e) {
    var that = this;
    console.log(e);
    app.navigateTo(that, {
      url: that.data.to_shop_url + "?store_id=" + e.currentTarget.dataset.storeid
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
        console.log(res);
        var info = res.data.res.data;
        var arr = info.cover;
        // var exhibition = info.exhibition.replace(new RegExp(/(.jpg)/g),'_440.jpg');//替换大图，图片体积大会卡，估计是内存占用限制了
        // exhibition = exhibition.replace(new RegExp(/(.JPG)/g),'_440.JPG');
        // var i;
        // for(i = 0 in arr){
        //   arr[i].value = util.change_img_size(arr[i].value,440);
        // }
        // info.exhibition = exhibition;
        info.cover = arr;
        //=============================设置店铺展示首个
        var store_index = app.globalData.page_details_set_store;

        that.setData({
          info: info,
          store_name_str: info.store[store_index].property[store_index].value,//默认第一个店名
          schedule_id: info.store[store_index].schedule_id,
          standard_id_pick: info.standard[0].standard_id, //默认选中第一个套餐,
          store_id: info.store[store_index].store_id,
          current_store: store_index
        })
        //=============================设置标题
        that.fresh_title(info.title);

        var article = info.exhibition;
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        WxParse.wxParse('article', 'html', article, that, 15);
      },
      fail: function () {

      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  // wxParseImgError : function(e){
  //   console.log('error')
  //   console.log(e)
  // },
  // wxParseImgLoad : function(e){
  //   console.log('Load')
  //   console.log(e);
  // },
  fresh_title: function (str) {
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title: str
    })
  },
  detail_body_taps: function (e) {
    var index = e.target.dataset.index;
    if (index == 1) {
      app.globalData.mta.Event.stat('detail_goods', { '1tcjg': 'true' });
    }
    else {
      app.globalData.mta.Event.stat('detail_goods', { '2psyp': 'true' })
    }
    this.setData({
      body_taps_index: index
    })
  },
  next_btn: function () {
    var that = this;
    //开启浮层
    app.globalData.mta.Event.stat('detail_goods', { '3lkyy': 'true' });
    app.ready(function (systemInfo) {
      console.log(systemInfo)
      that.setData({
        step: 1
      })
      that.setData({
        account_type: app.globalData.account_type
      })
    },
      function (userInfo) {

      },
      function () {

      });

  },
  next_btn_2: function () {
    //下一步按钮
    console.log("next!!!")
  },
  standard_btn: function (e) {
    var index = e.target.dataset.index;
    var standard = e.target.dataset.standard
    console.log(e);
    this.setData({
      standard_pick: index,
      standard_id_pick: standard
    });
  },
  close_fade: function () {
    //关闭浮层
    this.setData({
      step: 0
    })
  },
  to_shop: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    switch (index) {
      case 0: break;
      case 1:
        var str = e.currentTarget.dataset.position;
        var arr = str.split(",");
        console.log(arr);
        console.log(parseFloat(arr[1]));
        console.log(parseFloat(arr[0]));
        // that.setData({
        //   show_map : 1,
        //   for_maps:{
        //     longitude : parseFloat(arr[0]),//113.345489,//经度113+-
        //     latitude : parseFloat(arr[1]),//23.141894, //纬度23+-
        //     markers: [{
        //             iconPath: "",///image/index/address-icon-32x32.png",
        //             id: 0,
        //             latitude: parseFloat(arr[1]),//23.141894,
        //             longitude: parseFloat(arr[0]) //113.345489//(arr[0]),
        //     }]
        //   }
        // })
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
        break;
      case 2:
        var phone = e.currentTarget.dataset.value;
        wx.makePhoneCall({
          phoneNumber: phone //仅为示例，并非真实的电话号码
        })
        break;
    }
  },
  map_close: function () {
    //关闭地图浮层
    this.setData({
      show_map: 0
    })
  },
  onReady: function () {
    // 页面渲染完成
    app.get_window_info(this);
  },
  onShow: function () {
    // 页面显示
    var that = this;
    that.change_store();
  },
  onHide: function () {
    // 页面隐藏
    var that = this;
    that.reset_store();
  },
  onUnload: function () {
    // 页面关闭
    console.log("close");
    var that = this;
    that.reset_store();
  },
  onShareAppMessage: function () {
    var that = this;
    app.globalData.mta.Event.stat("share", {});
    return {
      title: that.data.info.title,
      path: '/pages/details/details?goods_id=' + that.data.goods_id
    }
  },
  choose_store: function () {
    var that = this;
    console.log(that.data.info)
    that.setData({
      show_store: 1
    })
  },
  change_store : function(){
    var that = this;
    var store_index = app.globalData.page_details_set_store;

    if(that.data.info){
      var info = that.data.info
      that.setData({
        store_name_str: info.store[store_index].property[store_index].value,//默认第一个店名
        schedule_id: info.store[store_index].schedule_id,
        store_id: info.store[store_index].store_id,
        current_store: store_index
      })
    }

  },
  reset_store : function(){
    app.globalData.page_details_set_store = 0;
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
      show_store: 0,
      schedule_id: scheduleid,
      store_id: storeid,
      store_name_str: storenamestr
    })
  }
})