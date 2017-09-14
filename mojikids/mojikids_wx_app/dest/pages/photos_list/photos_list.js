// photos_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      img_url: 'https://image19.yueus.com/yueyue/20170829/20170829170719_138684_100001_55282.png?1x1_130',
    width : '',
    height : '',
    screen_height : '',
    show_img : false,
    has_show_tips: false,
    has_downloaded : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;

    var img_url = options.img_url || '';    

    if(img_url){
      img_url = decodeURIComponent(img_url);
    }    

    app.get_window_info(self);

    self.setData({
      img_url: img_url
    });

    wx.setNavigationBarTitle(
      {
        title: '我的照片-莫吉照相馆'
      })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;    

    self.setData({
      screen_height: (self.data.window.windowHeight - self.get_px_by_rpx(98) + 1) + 'px'
    })
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
  // ==

  img_loaded : function(event){
    var self = this;

    var detail = event.detail;
    var ori_width = detail.width;
    var ori_height = detail.height;
    var ratio = parseFloat(ori_width/ori_height).toFixed(2);
    var real_width = 0;
    var real_height = 0;

    self.setData({ show_img : true});
    
    // 计算比例
    if (ori_width > ori_height){
      
      real_height = self.data.window.windowWidth / ratio;
      
      // 横向图
      self.setData({
        width : '100%',
        height: real_height + 'px;'
      });  
    }    
    else if (ori_width < ori_height){
      console.log(self.get_px_by_rpx(98))
      real_width = (self.data.window.windowHeight - self.get_px_by_rpx(98)) * ratio;

      console.log(ratio)

      self.setData({
        width: real_width + 'px;',
        height: (self.data.window.windowHeight - self.get_px_by_rpx(98)) + 'px;'
      });
    }
    else{

      real_width = self.data.window.windowWidth;
      self.setData({
        width: real_width + 'px;',
        height: real_width + 'px;',
      });
    }

  }, 
  img_error : function(){
    var self = this;

    self.setData({ show_img: true });

    wx.showToast({
      title: '图片加载失败，请重试',
    })
  },
  /**
   * rpx 转 px
   */
  get_px_by_rpx : function(val){
    var self = this;

    var ratio = 750 / self.data.window.screenWidth ;

    return parseFloat(val / ratio).toFixed(2);
  },
  /**
   * 下载原图
   */
  download : function(){
    var self = this;

    if(!self.data.img_url){
      return;
    }  

    if (self.data.has_downloaded){
      wx.showToast({
        title: '图片已下载',
      })
      return;
    }


    var img_url = self.data.img_url;

    // 转换原图
    img_url = app.util.change_img_size_v2(img_url) ;

    // 兼容旧版不能保存图片的做法
    if (!wx.canIUse('saveImageToPhotosAlbum')){

      // 先下载原图
      wx.downloadFile({
        url: img_url
      });

      var cotent = '点击右上角`···`按钮，选择`保存图片`';      

      if (/ios/i.test(self.data.window.system)){
        // is ios
        cotent = '长按照片即可保存图片哟~';      
      }

      if (!self.data.has_show_tips) {
        wx.showModal({
          title: '提示',
          content: cotent,
          showCancel : false,
          confirmText : '知道了',
          success: function (res) {
            if (res.confirm) {
              self.setData({
                has_show_tips: true,
              })

              wx.previewImage({
                urls: [img_url],
              });
            } 
            else{
              wx.showToast({
                title: '保存失败',
              })
            }
          }
        })
      }    
      else{

        wx.previewImage({
          urls: [img_url],
        });
      }

      return;
    }

    wx.showLoading({
      title: '正在加载原图...',
    });

    self.setData({
      show_img : false
    });

    wx.downloadFile({
      url: img_url,
      success: function (res) { 

        console.log(res)     

        wx.hideLoading();

        self.setData({ show_img: true });

        // 兼容保存图片到相册
        if (wx.canIUse('saveImageToPhotosAlbum')) {            
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {

              console.info('saveImageToPhotosAlbum 保存成功');

              setTimeout(function(){
                wx.showToast({
                  title: '保存成功',
                });
              },500);

              self.setData({                
                has_downloaded: true
              });
            },
            fail: function (m_res) {
              if (m_res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
                if (!wx.openSetting) {
                  return;
                }

                // 调用设置权限界面
                wx.openSetting({
                  success: function (n_res) {
                    console.log(n_res)
                    if (n_res.authSetting['scope.writePhotosAlbum']) {
                      wx.showToast({
                        title: '设置成功',
                        duration: 3000
                      });
                    }
                  }
                });
              }
              else {
                wx.showToast({
                  title: m_res.errMsg,
                  duration: 3000
                });
              }


            },
            complete: function(){
              self.setData({ show_img: true });
            }
          })
        }  

        self.setData({
          img_url: img_url,            
        });
      },
      complete: function () {


      },
      fail: function () {
        wx.hideLoading();

        self.setData({ show_img: true });
      }
    })

    
  }
})