// pages/feedback/feedback.js
var app = getApp();
Page(
{

    /**
     * 页面的初始数据
     */
    data:
    {
        disabled_css: 'disabled',
        txt_val: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        wx.setNavigationBarTitle(
        {
            title: '意见反馈 - 莫吉照相馆'
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

    bindButtonTap: function(e)
    {
        this.setData(
        {
            txt_val: e.detail.value
        })

        if (e.detail.value)
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

    submit_feedback_info: function()
    {
        var self = this;
        if (!self.data.txt_val)
        {

            app.util.toast(
            {
                title: '请输入内容哦',
                icon: 'warn',
                duration: 20000
            });
            return;
        }

        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/feedback/submit_feedback_info.php',
            data:
            {
                content : self.data.txt_val,
                app_session: app.globalData.app_session
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