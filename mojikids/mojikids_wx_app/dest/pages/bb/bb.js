// pages/bb/bb.js
var app = getApp();
Page(
  {

    /**
     * 页面的初始数据
     */
    data:
    {
      is_show: '',
      title: '',
      bb_img: 'https://image19.yueus.com/yueyue/20170829/20170829170719_138684_100001_55282.png?1x1_130',
      image_ids: '',
      hide_page: true, 
      has_show_tips: false,
      has_downloaded: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      console.log('页面传过来的参数');
      console.log(options);

      var that = this;
      var car_type = options.car_type || 'bb_car';

      that.setData({ car_type: car_type });

      app.get_window_info(that);

      switch (car_type) {

        // 宝宝卡片
        case 'bb_car':
          that.setData(
            {
              is_show: 1,
              title: '宝宝卡片-莫吉照相馆'
            })
          break;


        // 海报
        case 'hb':

          that.setData(
            {
              is_show: 0,
              title: '我的海报-莫吉照相馆'
            })

          break;

      }

      that.setData(
        {
          // bb_img: img,
          image_ids: options.image_ids || ''
        });

      wx.setNavigationBarTitle(
        {
          title: that.data.title
        })

      that.get_data();



    },

    go_url: function (e) {
      var id = e.currentTarget.id;

      wx.switchTab(
        {
          url: "/pages/index/index",
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

    },


    get_data: function () {

      var that = this;
      app.util.yue_request({

        url: app.globalData.api_domain + '/bb/get_bb_img.php',//仅为示例，并非真实的接口地址
        data:
        {
          image_ids: that.data.image_ids,
          car_type: that.data.car_type,
          app_session: app.globalData.app_session
        },
        header:
        {
          'content-type': 'application/json'
        },
        success: function (r, res) {

          // var page_data = res.data.res.data;
          console.log(res);

          console.log(res.data.res.img_url);

          that.setData(
            {
              bb_img: res.data.res.img_url
            })



        },
        fail: function () {
          wx.showModal({
            title: '提示',
            content: '图片加载失败，请点击确认重试',
            showCancel: false,
            success: function (res_v2) {
              if (res_v2.confirm) {
                that.get_data();
              }
            }
          })
        },
        complete: function () {
          wx.hideToast();


        }
      })
    },
    /**
     * 保存图片
     */
    download: function () {
      var self = this;

      if (self.data.has_downloaded) {
        wx.showToast({
          title: '图片已下载',
        })
        return;
      }


      var img_url = self.data.bb_img;

      // 转换原图
      img_url = app.util.change_img_size_v2(img_url);

      // 兼容旧版不能保存图片的做法
      if (!wx.canIUse('saveImageToPhotosAlbum')) {

        // 先下载原图
        wx.downloadFile({
          url: img_url
        });

        self.setData({
          bb_img: img_url,
        });

        var cotent = '点击右上角`···`按钮，选择`保存图片`';

        if (/ios/i.test(self.data.window.system)) {
          // is ios
          cotent = '长按照片即可保存图片哟~';
        }

        if (!self.data.has_show_tips) {
          wx.showModal({
            title: '提示',
            content: cotent,
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
              if (res.confirm) {
                self.setData({
                  has_show_tips: true,
                })

                wx.previewImage({
                  urls: [img_url],
                });
              }
              else {
                wx.showToast({
                  title: '保存失败',
                })
              }
            }
          })
        }
        else {

          wx.previewImage({
            urls: [img_url],
          });
        }

        return;
      }

      wx.showLoading({
        title: '正在下载图片...',
      });

      self.setData({
        show_img: false
      });

      console.info(img_url);

      wx.downloadFile({
        url: img_url,
        success: function (res) {

          wx.hideLoading();
          console.log(res)
          // 兼容保存图片到相册          
          if (wx.canIUse('saveImageToPhotosAlbum')){            
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
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
                console.error(m_res)
                if (m_res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
                  if (!wx.openSetting) {
                    return;
                  }

                  // 调用设置权限界面
                  wx.openSetting({
                    success: function (n_res) {
                      console.log(n_res)
                      if (res.authSetting['scope.writePhotosAlbum']) {
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


              }
            })
          }         

          self.setData({
            bb_img: img_url,
          });
        },
        complete: function () {
          self.setData({
            show_img: true
          });
        },
        fail: function (res) {
          wx.hideLoading();

          wx.showToast({
            title: res.errMsg,
            duration: 3000
          });
        }
      })
    },
    /**
     * 加载图片完成时
     */
    img_load: function () {
      var that = this;

      that.setData({
        hide_page: false
      });

      wx.hideLoading();
    },
    /**
     * 加载图片失败时
     */
    img_error: function () {
      var that = this;

      wx.hideLoading();

      wx.showModal({
        title: '提示',
        content: '图片加载失败，请点击确认返回上一页',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            });
          }
        }
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      wx.showLoading({
        title: '正在加载图片',
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

    }
  })