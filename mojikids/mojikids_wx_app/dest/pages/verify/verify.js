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
        code_btn_html : '获取验证码',
        code_btn_lock : false,
        count_down_sec : '60',
        count_down_sec_static :'60',
        disabled_css : 'disabled'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options)
    {
        var self = this;
        app.ready(
            function(globalData)
            {
                self.get_user_phone();
            },
            function() {

            })

        wx.setNavigationBarTitle(
        {
            title: '更换手机号 - 莫吉照相馆'
        })

    },

    // 获取用户昵称
    bindKeyInput: function(e) {
        var self = this;
        this.setData({
            v_num: e.detail.value
        })


        if (e.detail.value) 
        {
            this.setData({
                disabled_css: ''
            })
        }


    },


    


    get_v_num : function()
    {
        console.log('验证码');
        var self = this;

        if (self.data.code_btn_lock) 
        {
            return ;
        }

        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/verify/get_ver_code.php',
            data:
            {

                phone : self.data.user_phone,
                phone_type : 'old',
                app_session: app.globalData.app_session
                    // user_img: user_img
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
        

        // 开关
        // self.data.code_btn_lock = true;

        self.setData({
            code_btn_lock : true
        })


        var interval_value = setInterval(function(){
            self.data.count_down_sec--;

            self.setData({
                count_down_sec: self.data.count_down_sec,
                code_btn_html: self.data.count_down_sec
            })

            if(self.data.count_down_sec == 0)
            {
                clearInterval(interval_value);


                self.setData({
                    count_down_sec: self.data.count_down_sec_static,
                    code_btn_html: "获取验证码",
                    code_btn_lock : false
                })

                // self.data.count_down_sec = self.data.count_down_sec_static;
                // self.data.code_btn_html = "获取验证码";
                // self.data.code_btn_lock = false;
            
            }
            else
            {
                //html结构显示
                // self.data.code_btn_html = self.data.count_down_sec+"s";

                self.setData({
                    code_btn_html: self.data.count_down_sec+"s"
                })
            }
        },1000);


    },



    save_profile: function()
    {
        console.log('提交表单');
        var self = this;
        var v_num = self.data.v_num;

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
                phone : self.data.user_phone,
                code: v_num,
                app_session: app.globalData.app_session,
                phone_type : 'old'
                    // user_img: user_img
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


                    // window.location.href = window.__MOJIKIDS_GLOBAL['PAGE_URL']['auth'] + 'bind_phone.php?code=' + self.v_num +'&phone=' + self.phone;
           
                    app.navigateTo(self,
                    {
                        url: '/pages/bind_phone/bind_phone'+'?code=' + v_num + '&phone=' + self.data.user_phone,
                        success: function(res)
                        {
                            // success
                        },
                        fail: function()
                        {
                            // fail
                        },
                        complete: function()
                        {
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },


    get_user_phone: function()
    {
        var self = this;

        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/verify/get_user_phone.php',
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
                console.log(response);

                self.setData(
                {
                    user_phone: response.res
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

    }
})