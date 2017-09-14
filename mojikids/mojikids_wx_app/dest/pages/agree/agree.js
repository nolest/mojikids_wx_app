// pages/agree/agree.js
var app = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
Page(
{

    /**
     * 页面的初始数据
     */
    data:
    {
        txt_val: '',
        id : '', //显示哪个，1是用户协议，2是肖像权
        img_show  : "dn"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options)
    {
        var id = options.id || '1' ;
        var self = this;
        console.log(options);
        self.get_data(id);
        var title;
        switch (id)
        {
            case '1': 
                title = '预约协议';
            break;

            case '2': 
                title = '肖像权使用授权书';
            break;

            case '3': 
                title = '【用户预约系统】拍摄须知';
            break;
        }   

        wx.setNavigationBarTitle(
        {
            title: title
        })  

    },


    get_data: function(id)
    {
        wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 10000
        });
        var that = this;
        // app 从getApp() 返回
        // header 默认参数为 { 'Content-Type': 'json' }
        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/argee/argee.php',
            data: {
                id:id
            },
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {

                console.log(response);

                /**
                * WxParse.wxParse(bindName , type, data, target,imagePadding)
                * 1.bindName绑定的数据名(必填)
                * 2.type可以为html或者md(必填)
                * 3.data为传入的具体数据(必填)
                * 4.target为Page对象,一般为this(必填)
                * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                */
                var article = response.res.val;
                WxParse.wxParse('txt_val', 'html', article, that, 15);

                that.setData(
                {
                    img_show: ''
                })
                

            },
            fail: function(response)
            {
                wx.showToast(
                {
                    title: '网络异常',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: function(response) {
                wx.hideToast();
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