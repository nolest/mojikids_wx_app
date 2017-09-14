// pages/bind_phone/bind_phone.js
var app = getApp();
Page(
{

    /**
     * 页面的初始数据
     */
    data:
    {
        user_phone: '',
        v_num: '',
        code_btn_html: '获取验证码',
        code_btn_lock: false,
        count_down_sec: '60',
        count_down_sec_static: '60',
        disabled_css: 'disabled',
        interval_value: '',
        old_phone :'',
        old_num : ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        wx.setNavigationBarTitle(
        {
            title: '更换手机号 - 莫吉照相馆'
        })

        this.setData(
        {
            old_phone: options.phone || '',
            old_num: options.code || ''
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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


    input_new_phone: function(e)
    {
        var self = this;
        this.setData(
        {
            user_phone: e.detail.value
        })
        self.is_click();

    },


    bindKeyInput: function(e)
    {
        var self = this;
        this.setData(
        {
            v_num: e.detail.value
        })
        self.is_click();

    },



    is_click : function()
    {
        var self = this;
        if (this.data.v_num && this.data.user_phone) 
        {
            this.setData(
            {
                disabled_css: ''
            })
        }
        else
        {
            this.setData(
            {
                disabled_css: 'disabled'
            })
        }
    },


    get_v_num: function()
    {

        var self = this;
        if (self.data.code_btn_lock)
        {
            return;
        }

        if (self.data.user_phone == '') 
        {
            wx.showToast(
            {
                title: '请填写手机号码',
                icon: 'loading',
                duration: 2000
            })
            return ;
        }

        var phone_len = /^\d{11}$/;
        if(!phone_len.exec(parseInt(self.data.user_phone)))
        { 
            wx.showToast(
            {
                title: '请输入正确手机号码',
                icon: 'loading',
                duration: 2000
            })
            return ;
        }


        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/verify/get_ver_code.php',
            data:
            {

                phone: self.data.user_phone,
                phone_type: 'new',
                app_session: app.globalData.app_session
            },
            beforeSend: function()
            {
                wx.showLoading(
                {
                    title: '加载中...',
                })
            },
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {
                wx.hideLoading()
                console.log(response);
                var data = response.res.data;

                wx.showToast(
                {
                    title: data.message,
                    icon: 'loading',
                    duration: 1500
                })

                if (data.result == 1)
                {
                    
                }
                else
                {
                    clearInterval(self.data.interval_value);
                    // self.code_btn_lock = false;
                    self.setData(
                    {
                        code_btn_lock: false
                    })
                    return;
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

            }
        });

        self.setData(
        {
            code_btn_lock: true
        })


        var interval_value = setInterval(function()
        {
            self.data.count_down_sec--;

            self.setData(
            {
                count_down_sec: self.data.count_down_sec,
                code_btn_html: self.data.count_down_sec
            })

            if (self.data.count_down_sec == 0)
            {
                clearInterval(interval_value);


                self.setData(
                {
                    count_down_sec: self.data.count_down_sec_static,
                    code_btn_html: "获取验证码",
                    code_btn_lock: false
                })
            }
            else
            {
                self.setData(
                {
                    code_btn_html: self.data.count_down_sec + "s"
                })
            }
        }, 1000);

        self.setData(
        {
            interval_value: interval_value
        })


    },


    save_data: function()
    {
        console.log('提交表单');
        var self = this;

        var v_num = self.data.v_num;
        var user_phone = self.data.user_phone;

        if (user_phone == '')
        {
            wx.showToast(
            {
                title: '请输入手机号码',
                icon: 'loading',
                duration: 1500
            })
            return;
        }


        var phone_len = /^\d{11}$/;
        if(!phone_len.exec(parseInt(self.data.user_phone)))
        { 
            wx.showToast(
            {
                title: '请输入正确手机号码',
                icon: 'loading',
                duration: 2000
            })
            return ;
        }


        if (v_num == '')
        {
            wx.showToast(
            {
                title: '请填写验证码',
                icon: 'loading',
                duration: 1500
            })
            return;
        }

        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/verify/send_ver_code.php',
            data:
            {
                phone : self.data.old_phone,
                code : self.data.old_num,
                new_phone : user_phone,
                new_code: v_num,
                app_session: app.globalData.app_session,
                phone_type : ''
            },
            beforeSend: function() {

                wx.showLoading(
                {
                    title: '加载中...',
                })

            },
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {
                wx.hideLoading()
                console.log(response);
                var data = response.res.data;
                wx.showToast(
                {
                    title: data.message,
                    icon: 'loading',
                    duration: 2000
                })
                
                if (data.result == 1) 
                {
                    console.log('成功');

                    wx.switchTab({
                      url: "/pages/mine/mine",
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

                    
                }
                else
                {
    
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

    }
})