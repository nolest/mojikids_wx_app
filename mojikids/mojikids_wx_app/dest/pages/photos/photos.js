// photos.js
var app = getApp();

/**
 * 判断元素是否存在
 * @param  {[type]} needle   [description]
 * @param  {[type]} haystack [description]
 * @return {[type]}          [description]
 */
function in_array(needle, haystack) {
  var length = haystack.length;
  var gettype = Object.prototype.toString;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) {
      return true;
    }
  }
  return false;
}

/**
 * 删除数组指定元素
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function removeByValue(val, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }

  return arr;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    "list": [],
    "mode": 'view',
    "count": 1,
    "preview": false,
    "preview_img": '',
    "zzhb_list": [],
    "wysq_list": [],
    "selected_list": [],
    "show_tips": true,
    "hide_bottom": '',
    "order_sn": '',
    "description": '',
    "selected_tys": true,
    "new_tag" : true,
    "hide_fail_page" : true,
    "hide_success_page" : true,
    "error_message" : '',
    "item_width" :'',
    "item_height":'',
    "hide_tips": true,
    "hide_tys": true,
    "ban_zzhb": true,
    "ban_wysq": true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    var order_sn = options.order_sn || '';

    self.setData({
      order_sn : order_sn
    });

    app.get_window_info(self);

    // 计算方格
    self.cul_item_size();
    
    //调用应用实例的方法获取全局数据
    app.ready(
      function (globalData) {
        // 加载数据

        self.get_list();
      },
      function () {
        
      })
    

    wx.setNavigationBarTitle(
      {
        title: 'EMOJI #最萌九宫格#'
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;

    self.util = app.util;
    
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

  // ================
  // 下面开始是当前页面的 methods
  // hudw 2017.5.17
  // ================

  cul_item_size: function(){
    var self = this;

    var win = self.data.window;

    var total_width = win.windowWidth - self.get_px_by_rpx(9);

    var item_size = parseFloat(total_width / 3).toFixed(2);


    self.setData({
      item_width: item_size + 'px',
      item_height: item_size + 'px',
    });
  },
  get_px_by_rpx: function (val) {
    var self = this;

    var ratio = 750 / self.data.window.screenWidth;

    return parseFloat(val / ratio).toFixed(2);
  },
  /**
   * 显示圆形数字
   */
  show_circle: function (item) {
    var self = this;
    var tag = false;
    if (self.data.mode == 'zzhb' && !item.selected) {
      tag = true;
    }
    else if (self.data.mode == 'wysq' && (!item.selected && item.is_up == 0)) {
      tag = true;
    }

    return tag
  },
  /**
   * 显示阴影遮罩
   */
  show_fade: function (item) {
    var self = this;
    var tag = false;
    if (self.data.mode == 'zzhb' && item.selected) {
      tag = true;
    }
    else if (self.data.mode == 'wysq' && (item.selected || item.is_up == 1)) {
      tag = true;
    }

    return tag
  },
  /**
   * 隐藏底部按钮bar
   */
  hide_bottom_bar: function () {
    var self = this;
    if (!self.data.hide_bottom) {
      self.data.hide_bottom = 'fn-hide';
    }
    else {
      self.data.hide_bottom = '';
    }

  },
  /**
   * 显示选中
   */
  show_select: function (item) {
    var self = this;
    var tag = false;
    if (self.data.mode == 'zzhb' && item.selected) {
      tag = true;
    }
    else if (self.data.mode == 'wysq' && item.selected) {
      tag = true;
    }

    return tag
  },
  /**
   * 根据id获取对应子项
   */
  get_item_by_id: function (image_id) {
    var self = this;

    var item = null;
    var list = self.data.list;

    for (var i = 0; i < list.length; i++) {
      if (list[i].image_id && list[i].image_id == image_id) {
        item = list[i];
        break;
      }
    }

    return item;
  },
  /**
   * 根据url 获取对应id
   * 
   */
  get_id_by_url: function (url) {
    var self = this;

    var id = 0;
    var list = self.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].url && list[i].url == url) {
        id = list[i].image_id;
        break;
      }
    }

    return id;
  },
  /**
   * 根据当前索引获取当前选中子项
   */
  get_cur_index: function (url) {
    var self = this;

    var index = 0;
    var list = self.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].url && list[i].url == url) {
        index = i;
        break;
      }
    }

    return index;
  },
  show_big_img: function () {

  },
  /**
   * 选中某一个图片
   * @return {[type]} [description]
   */
  select_item: function (event) {
    var self = this;
    var list = self.data.list;
    var index = event.currentTarget.dataset.index;
    var cur_img_url = event.currentTarget.dataset.imgUrl;


    if (self.data.mode == 'view') {

      // 预览状态下      
      app.navigateTo(self,{
        url: '/pages/photos_list/photos_list?img_url=' + encodeURIComponent(cur_img_url),
      })
      return;
    }


    if (list[index] && list[index].selected == false) {
      if (self.data.mode == 'zzhb') {
        if (self.data.selected_list.length >= 9) {
          app.util.toast({
            title: '最多只能选择9张照片 ￣□￣',
            icon : 'warn',
            duration: 2000
          })
          return;
        }

        list[index].selected = true;

        self.setData({
          list: list,
          ban_zzhb: false,
        })

        self.add(self.data.list[index]);
      }
      else if (self.data.mode == 'wysq') {
        if (list[index].is_up == 0) {
          var ban_wysq = true;
          list[index].selected = true;          

          self.setData({
            list: list,
          });

          self.add(self.data.list[index]);

          if (self.data.selected_tys && self.data.selected_list.length>0) {
            ban_wysq = false;
          }

          self.setData({
            ban_wysq: ban_wysq,
          });
        }
        else {
          app.util.toast
            ({
              icon : 'warn',
              title: '图片已经上墙',
              duration: 2000
            });
        }

      }


    }
    else {

      list[index].selected = false;

      self.setData({
        list: list
      })

      self.minus(list[index], index);
    }

    // 重置按钮
    if (self.data.selected_list.length == 0) {
      self.setData({
        ban_zzhb: true,
        ban_wysq: true,
      })
    }
  },
  /**
   * 添加一项
   * @param {[type]} item [description]
   */
  add: function (item) {
    var self = this;
    var selected_list = self.data.selected_list;
    if (!in_array(item.images, selected_list)) {
      item.num = selected_list.length + 1;
      selected_list.push(item.image_id);
      self.setData({
        selected_list: selected_list
      });
    }

    self.init_list();

  },
  cancel: function () {
    var self = this;

    self.reset();

  },
  /**
   * 减少一项
   * @param  {[type]} item  [description]
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  minus: function (item, index) {
    var self = this;

    var temp_num = item.num;
    var list = self.data.list;
    var selected_list = removeByValue(item.image_id, self.data.selected_list);

    self.setData({ selected_list: selected_list })

    for (var i = 0; i < list.length; i++) {
      if (list[i].num && list[i].num > temp_num) {
        list[i].num--;
      }
    }

    self.setData({
      list: list
    });

    self.init_list();
  },
  /**
   * 初始化列表
   */
  init_list: function () {
    var self = this;

    var list = self.data.list;

    var margin_left = self.get_px_by_rpx(4);
    var margin_right = 2.5;
    var margin_bottom = 2.5;

    console.info(margin_right, margin_bottom)

    var mid_item_size = self.data.window.screenWidth - parseFloat(self.data.item_width) * 2 - 2.5 * 2;


    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      list[i].show_fade = self.show_fade(item);
      list[i].show_select = self.show_select(item);
      list[i].show_circle = self.show_circle(item);
      list[i].margin_bottom = margin_bottom + 'px';
      list[i].margin_left = '0px';
      list[i].margin_right = '0px';

      list[i].item_width = self.data.item_width;
      list[i].item_height = self.data.item_height;
      

      if ((i - 1) % 3 == 0){
        list[i].item_width = mid_item_size + 'px';
        list[i].item_height = self.data.item_height;

        list[i].margin_left = margin_right+'px';
        list[i].margin_right = margin_right + 'px';        
      }

      if (i == list.length-1 || i == list.length-2 || i == list.length-3){
        list[i].margin_bottom = '0px';
      }
    }

    self.setData({
      list: list,
    });
  },
  /**
   * 重置
   */
  reset: function () {
    var self = this;

    var list = self.data.list;

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      list[i].show_fade = false;
      list[i].show_select = false;
      list[i].show_circle = false;
      list[i].selected = false;
      list[i].num = 0;

    }

    self.setData({
      mode: 'view',
      selected_list: [],
      hide_tys: true,
      list: list
    });
  },
  /**
   * 我要上墙
   */
  wysq: function () {
    var self = this;

    if(self.data.list.length == 0){
      return false;
    }    

    self.setData({
      hide_tys: false,
      hide_tips: true
    });

    self.setData({
      mode: 'wysq'
    });

    self.init_list();

    if (self.data.selected_list.length > 0 && self.data.selected_tys) {

      wx.showModal({
        title: '谢谢您的分享！',
        content: '提交上墙照片后，该照片有可能被展示在MOJIKIDS官方宣传渠道',
        confirmText: '确认上墙',
        cancelText: '取消上墙',
        success: function (res) {
          if (res.confirm) {
            self.submit_wysq(self.data.selected_list);
          }
        }
      })

    }
  },
  /**
   * 制作海报
   * @return {[type]} [description]
   */
  zzhb: function () {
    var self = this;

    if (self.data.list.length == 0) {
      return false;
    }  

    self.setData({
      mode: 'zzhb',
      hide_tips: true
    });

    self.init_list();

    if (self.data.selected_list.length > 0) {

      self.setData({ ban_zzhb: false });

      if (self.data.selected_list.length > 9) {
        app.util.toast
          ({
            title: '制作海报数量不能超过9张',
            icon : 'warn',
            duration: 2000
          });
        return;
      }

      wx.hideLoading();
      var image_ids = self.data.selected_list.join(',');

      //todo 跳转到宝宝卡片
      app.navigateTo(self,{
        url: "/pages/bb/bb?car_type=hb&image_ids=" + image_ids,
      });
    }
    else {
      self.setData({ ban_zzhb: true });
    }

  },
  /**
   * 根据模式显示底部按钮
   */
  show_btn_by_mode: function () {
    var self = this;
    var mode = self.data.mode;
    var tag = true;

    if (mode == 'view') {
      tag = false;
    }
    else if (mode == 'zzhb') {
      tag = false;
    }
    else if (mode == 'wysq') {
      tag = false;
    }

    return tag;
  },
  /**
   * 获取图片列表
   */
  get_list: function (callback) {
    var self = this;

    callback = callback || function () { };

    wx.showLoading({
      title: '加载中...',
    })

    app.util.yue_request
      ({
        url: app.globalData.api_domain + '/photos/get_list.php',
        data: {
          app_session: app.globalData.app_session,
          order_sn: self.data.order_sn
        },       
        success: function (response, res) {

          wx.hideLoading();

          var data = response.res.data;

          if (data.result < 1) {
            
            self.setData({              
              hide_success_page: true,
              hide_fail_page: false,
              error_message: data.message
            });

            return;
          }        

          self.setData({ 
            list: data.list,
            hide_success_page : false,
            hide_fail_page : true 
          });

          self.init_list();

          self.setData({
            description: data.description
          });

          setTimeout(function () {
            self.setData({ hide_tips: false });
          }, 500);

          if (typeof callback == 'function') {
            callback.call(this);
          }

        },
        fail: function () {
          wx.hideLoading();

          wx.showModal({
            title: '提示',
            content: '网络异常，请点击确认重试',
            showCancel: false,
            success: function (res_v2) {
              self.get_list();
            }
          });
        }
      });
  },
  /**
   * 提交上墙数据
   */
  submit_wysq: function (list) {
    var self = this;    

    if (list.length == 0) {
      app.util.toast
        ({
          title: '请选择照片',
          icon : 'warn',
          duration: 2000
        });
      return;
    }

    if (list.length > 30) {
      app.util.toast
        ({
          title: '上墙照片数不能超过30张',
          icon : 'warn',
          duration: 2000
        });
      return;
    }

    var list_str = list.join(',');

    app.util.yue_request
      ({
        url: app.globalData.api_domain + '/photos/submit_wysq.php',
        data: {
          image_ids: list_str,
          app_session: app.globalData.app_session
        },
        beforeSend: function () {

          wx.showLoading({
            title: '正在提交...',
          });
        },
        success: function (response) {
          var data = response.res.data;

          wx.hideLoading();

          if (data.result > 0) {
            wx.showToast
              ({
                title: '谢谢~\(≧▽≦)/~',                
              });

            self.get_list(function () {
              self.reset();
            });
          }
          else {
            app.util.toast
              ({
                title: data.message,
                icon : 'warn',                
                duration: 2000
              });
          }
        },
        error: function () {
          app.util.toast
            ({
              icon : 'warn',                
              title: '网络异常',
              duration: 2000
            });
        },
        complete: function () {
          
        }
      });
  },
  /**
   * 选择肖像权协议书
   */
  select_tys: function (event) {
    
    if (event.target.id == "link"){
      return;
    }
    
    var self = this;
    var tag = self.data.selected_tys
    var ban_wysq = false;
    var new_tag = event.currentTarget.dataset.select == 1 ? false : true;

    if (event.target.id == 'cbkSelect'){
      new_tag = event.target.dataset.select == 1 ? false : true;
    }

    if (tag || self.data.selected_list.length == 0) {
      ban_wysq = true;
    }
    else{
      ban_wysq = false;      
    }

    self.setData({
      selected_tys: !tag,
      ban_wysq: ban_wysq,
      new_tag: new_tag
    });
  },
  close_tips: function () {
    var self = this;
    self.setData({
      hide_tips: true
    });
  },
  /**
   * 打开协议书
   */
  go_xys: function(){
    var self = this;

    app.navigateTo(self,{
      url: '/pages/agree/agree?id=2',
    })
  },
  /**
   * 跳转到首页
   */
  go_to_index : function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})