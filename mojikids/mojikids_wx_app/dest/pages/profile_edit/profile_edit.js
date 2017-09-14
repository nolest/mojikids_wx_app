// pages/profile_edit/profile_edit.js
var app = getApp();
Page(
{

    /**
     * 页面的初始数据
     */
    data:
    {
        user_img: '' ,
        user_name: '',
        user_id : '',
        mr_img :'http://mojikids.yueus.com/static/wap/image/bb/file/user-img.png',
        upload_img_loading: ''
    },


    // 图片加载
    imageOnLoad : function(){
        var self = this;
        console.log('图片加载成功');
        wx.hideLoading()
        wx.hideToast()
    },

    imageOnLoadError : function(){
        var self = this;
        wx.hideLoading()
        wx.hideToast()
        wx.showToast({
          title: '图片加载失败，请刷新重试',
          icon: 'loading',
          duration: 2000
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        app.ready(
          function (globalData) {
            self.get_user_info();
          },
          function () {

          })

        wx.setNavigationBarTitle(
        {
            title: '个人资料 - 莫吉照相馆'
        })

        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

        var self = this;

        var file_op = app.file_op;
        self.util = app.util;

        // 加载上传类
        self.upload_obj = new file_op.yue_file();

    },


    // 上传图片
    fetch_upload: function()
    {
        // console.log('上传图片');
        var self = this;

        

        wx.chooseImage(
        {
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res)
            {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var api_url = app.globalData.api_domain + '/file/get_file_info.php';


                if (tempFilePaths.length == 0)
                {
                    return false;
                }


                wx.showLoading(
                {
                    title: '上传中，请稍等...',
                })


                // 选择1张图片，做传图的操作
                self.upload_obj.upload(
                {
                    url: api_url,
                    promise: true,
                    file_path: tempFilePaths[0],
                    data:
                    {
                        upload_type : 'icon',
                        app_session: app.globalData.app_session,
                        ext: 'jpg' // 默认jpg
                    },


                    upload_success: function(res)
                    {

                        wx.hideLoading()
                        
                        var user_img = res.server_file_url;

                        if(user_img.indexOf('?') != -1){
                          user_img = user_img + '&' + new Date().getTime();
                        }
                        else{
                          user_img = user_img + '?' + new Date().getTime();
                        }


                        console.log('上传成功');

                        // 转换图片格式
                        user_img = self.util.change_img_size_v2(user_img,'s86','s86');

                        self.setData(
                        {
                            user_img: user_img,
                            mr_img : '',
                            upload_img_loading : user_img

                        })



                        // self.is_can_click();

                    },

                    fail: function(res)
                    {
                        wx.hideLoading()
                        wx.hideToast()
                            // 上传失败
                    },
                    complete: function()
                    {
                        // wx.hideLoading()
                        //     // 上传完成
                        // wx.hideToast()
                    }
                })
            }
        })
    },


   
    // 获取用户昵称
    bindKeyInput: function(e) {
        var self = this;
        this.setData({
            user_name: e.detail.value
        })

    },


    save_profile: function() {
        var self = this;
        var user_name = self.data.user_name;
        var user_img = self.data.user_img;

        if (!user_img)
        {
            wx.showToast(
            {
                title: '请上传宝宝图片',
                icon: 'loading',
                duration: 1500
            })
            return;
        }


        if (!user_name)
        {
            wx.showToast(
            {
                title: '请输入修改的用户昵称',
                icon: 'loading',
                duration: 1500
            })
            return;
        }

        if (user_name.length>10)
        {

            wx.showToast(
            {
                title: '输入用户昵称不能超过11个字',
                icon: 'loading',
                duration: 1500
            })
            return;
        }



        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/mine/chang_mine_info.php',
            data:
            {
                nickname: user_name,
                app_session: app.globalData.app_session
                // user_img: user_img
            },
            beforeSend: function()
            {
                wx.showLoading(
                {
                    title: '上传中，请稍等...',
                })
            },
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {
                wx.hideLoading()
                // console.log(response);
                var data = response.res.data;

                wx.showToast(
                {
                    title: data.message,
                    icon: 'loading',
                    duration: 1500
                })



                if (data.result == 1) 
                {
                    console.log('跳转');
                    wx.switchTab({
                      url: "/pages/mine/mine",
                      success: function(res){
                        // success
                      },
                      fail: function() {
                        // fail
                      },
                      complete: function() {
                        // complete
                      }
                    })

                }

                    

            },
            fail: function(response)
            {
                wx.hideLoading()
                wx.showToast(
                {
                    title: '网络异常',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: function(response)
            {
                // wx.hideLoading()

            }
        });
    
    },



    get_user_info: function() {
        var self = this;
        
        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/profile_edit/get_user_info.php',
            data:
            {
                app_session: app.globalData.app_session
                // user_img: user_img
            },
            beforeSend: function()
            {
                wx.showLoading(
                {
                    title: '上传中，请稍等...',
                })
            },
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {
                wx.hideLoading()
                
                var data = response.res.data;
                console.log(data);
                self.setData(
                {
                    user_id: data.user_id,
                    user_img : data.avatar,
                    user_name : data.nickname

                })

            },
            fail: function(response)
            {
                wx.hideLoading()
                wx.showToast(
                {
                    title: '网络异常',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: function(response)
            {
                wx.hideLoading()

            }
        });
    },
    

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    }
})