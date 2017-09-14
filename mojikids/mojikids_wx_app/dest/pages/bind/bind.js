// pages/bind/bind.js
var app = getApp();
Page({
  data:{
    phone : '',
    code:'',
    check : false,
    systemInfo : '',
    counting : false,
    code_str : '获取验证码',
    windowHeight : app.globalData.systemInfo.windowHeight,
    windowWidth : app.globalData.systemInfo.windowWidth,
    show_confirm_fade : 0,
    fade_message : '',
    fade_title : ''
  },
  fetch : function(){

  },
  cancel_fade : function(){
    if(this.data.cancel_types == "cb"){
      this.cancel_fade_cb();
    }
    else{
      this.setData({
        show_confirm_fade:0
      })
    }
  },
  fresh_title : function(str){
    //刷新顶部栏
    wx.setNavigationBarTitle({
      title : str
    })
  },
  bindPhoneInput : function(e){
    this.setData({
      phone: e.detail.value
    })
    this.check();
  },
  bindCodeInput : function(e){
    this.setData({
      code: e.detail.value
    })
    this.check();
  },
  check : function(){
    if((this.data.phone.toString().length >= 11) && (this.data.code.toString().length == 6)){
      this.setData({
        check : true
      })
    }
    else{
      this.setData({
        check : false
      })
    }
  },
  confirm_bind : function(){
    var that = this;
    if(this.data.check){
      app.util.yue_request({
        url: app.globalData.api_domain + '/bind/wechat_login.php',//'https://mojikids.yueus.com/wx_api/',
        data: {
          phone:that.data.phone,
          code :that.data.code,
          union_id : that.data.systemInfo.union_id
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(r,res) {
          var types = res.data.res.data.result;
          if(types == "1"){
            console.log('bind_success');
            console.log(app.globalData)
            app.globalData.account_type = 3;
            app.globalData.yue_login_id = res.data.res.data.user_id;
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500
            })
            if (that.data.no_back == '1'){
              var urls = ''
              switch (that.data.page_from){
                case 'mine': urls = '/pages/mine/mine';break;
                case 'order_list': urls = '/pages/order_list/order_list';break;
                default : urls = '/pages/index/index';break;
              }
              wx.switchTab({
                url: '/pages/index/index', //写死跳首页，留条后路比自己啊
                success: function (res) {
                  // success
                },
                fail: function (res) {
                  // fail
                },
                complete: function (res) {
                  // complete
                }
              })
            }else{
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }

          }
          else{
            that.setData({
              show_confirm_fade:1,
              fade_title:'提示',
              fade_message :res.data.res.data.message
            })
          }
          console.log('in_bind_success_ajax');
          console.log(res);
        }
      })
    }
  },
  get_code : function(){
    var that = this;
    if(that.data.counting){
      return
    }
    if(that.data.phone.length != 11){
      that.setData({
        show_confirm_fade:1,
        fade_title:'提示',
        fade_message :'请正确填写手机号'
      })
    }
    else{
      app.util.yue_request({
        url: app.globalData.api_domain + '/bind/getcode.php', //仅为示例，并非真实的接口地址
        data: {
          phone:that.data.phone,
          union_id : that.data.systemInfo.union_id
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(r,res) {
          var content = '';
          if(res.data.res.data.result == 1){
            content = '发送成功';
            var sec = 60;
            that.setData({
              counting : true
            })
            var timer = setInterval(function(){
              --sec;
              that.setData({
                code_str : sec + 's'
              })
              if(sec == 0){
                clearInterval(timer);
                that.setData({
                  counting : false,
                  code_str : '获取验证码'
                })
              }
            },1000)
          }
          else{
            content = res.data.res.data.message
          }
            that.setData({
              show_confirm_fade:1,
              fade_title:'提示',
              fade_message :content
            })
          // wx.showModal({
          //   title: '提示',
          //   showCancel : false,
          //   confirmColor : "#ffc430",
          //   content: content,
          //   success: function(res) {
          //   }
          // })
        },
        fail : function(){

        },
        complete : function(){
          wx.hideToast();
        }
      })
    }
  },
  onLoad:function(options){
    console.log(options);
    //调用统计
    app.globalData.mta.Page.init();
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      no_back: options.no_back,
      page_from: options.page_from
    })
    that.fresh_title('手机验证');
    app.ready(function(systemInfo){
      console.log(systemInfo)
      that.setData({
        systemInfo : systemInfo
      })
    },
    function(userInfo){

    },
    function(){
      
    });
  },
  onReady:function(){
    // 页面渲染完成
    app.get_window_info(this);
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})