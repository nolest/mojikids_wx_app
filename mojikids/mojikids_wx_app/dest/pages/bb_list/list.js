// pages/bb/list.js
var app = getApp();
Page(
{

    /**
     * 页面的初始数据
     */
    data:
    {
        list: [],
        target_id: '',
        title: '',
        list_hidden : 'dn',
        no_data_hidden : 'dn',
        btn_is_show : 'dn'

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options)
    {
        var that = this;

        wx.setNavigationBarTitle(
            {
                title: '宝宝档案 - 莫吉照相馆'
            })
            // 页面初始化 options为页面跳转所带来的参数

        app.ready(
            function(globalData)
            {
                that.fetch();
            },
            function() {

        })
    },


    fetch: function()
    {
        wx.showToast(
        {
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        var that = this;
        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/bb/list.php',  //仅为示例，并非真实的接口地址
            data:
            {
                app_session: app.globalData.app_session
            },
            header:
            {
                'content-type': 'application/json'
            },
            success: function(r,res)
            {

                var page_data = res.data.res.data;
                console.log(page_data);



                that.setData(
                {
                    list: page_data.list,
                    target_id: page_data.target_id,
                    title: page_data.title,
                    btn_is_show : ''
                })


                if (page_data.no_data) 
                {
                    that.setData({
                        list_hidden: 'dn',
                        no_data_hidden : ''
                    })
                }
                else
                {
                    that.setData({
                        list_hidden: '',
                        no_data_hidden : 'dn'
                    })
                }
                

            },
            fail: function() {

            },
            complete: function()
            {
                wx.hideToast();
            }
        })
    },


    // 修改宝宝档案
    edit_msg: function(e) {
        var self = this;
        var baby_id = e.currentTarget.id;
        app.navigateTo(self,
        {
            url: '/pages/bb_file/file' + '?baby_id=' + baby_id + '&type=edit',
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
    },

    // 新建宝宝档案
    build_msg: function(e)
    {
        var self = this;
        app.navigateTo(self,
        {
            url: '/pages/bb_file/file',
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
        console.log(1);
        this.fetch();
        
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