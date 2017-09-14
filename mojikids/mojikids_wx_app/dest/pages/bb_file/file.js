// pages/bb_file/file.js
var app = getApp();
Page(
{

    /**
     * 页面的初始数据
     */
    data:
    {
        items: [
        {
            name: '小王子',
            value: '男',
            cur : ''
        },
        {
            name: '小公主',
            value: '女',
            cur : ''
        }],
        date: '宝宝生日',
        btn_disabled: 'disabled',
        name: '',
        time: false,
        sex: '',
        user_img: '',
        baby_id: '',
        type : '',
        date_end : '',
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
    onLoad: function(options)
    {

        console.log(options);

        var that = this;

        wx.setNavigationBarTitle(
        {
            title: '新建宝宝档案 - 莫吉照相馆'
        })

        if (options && options.type == "edit")
        {
            that.get_data(options);

            wx.setNavigationBarTitle(
            {
                title: '修改宝宝档案 - 莫吉照相馆'
            })


            that.setData(
            {
                baby_id: options.baby_id,
                type :  options.type
            })
        }


        


        app.ready(
        function(globalData)
        {

        },
        function() {

        })


        // 出生日期截止时间
        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }

        
        that.setData(
        {
            date_end : getNowFormatDate()
        })
     

    },

    // 编辑，获取数据
    get_data: function(options)
    {

        var that = this;
        // app 从getApp() 返回
        // header 默认参数为 { 'Content-Type': 'json' }
        // 
        console.log(options);


        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/bb/file.php',
            data: {
                baby_id : options.baby_id,
                app_session: app.globalData.app_session
            },
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {
                var data = response.res.data;
                console.log(data);


                for (var i = 0; i < that.data.items.length; i++)
                {
                    if (that.data.items[i]['value'] == data.baby_gender)
                    {
                        that.data.items[i]['checked'] = true;
                    }
                };

                that.sex_is_sex(data.baby_gender)


                that.setData(
                {
                    name: data.baby_name,
                    date: data.baby_birth,
                    user_img: data.baby_image,
                    items: that.data.items,
                    sex: data.baby_gender
                })

                that.is_can_click();

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

            }
        });


    },



    // 性别选择
    radioChange: function(e)
    {
        var that = this;
        this.setData(
        {
            sex: e.detail.value
        })

        that.sex_is_sex(e.detail.value)


        that.is_can_click();
    },


    // 选择性别，文字是否高亮
    sex_is_sex : function(type){
        var that = this;
        switch (type)
        {
            case '男': 
                that.setData({
                    'items[0].cur': 'cur',
                    'items[1].cur': ''
                })
            break;

            case '女': 
                that.setData({
                    'items[0].cur'  : '',
                    'items[1].cur': 'cur'
                })
            break;
        }
    },


    // 日期选择
    bindDateChange: function(e)
    {
        var that = this;
        that.time = true;
        this.setData(
        {
            date: e.detail.value
        })
        that.is_can_click();
    },

    // 点击输事件
    bindKeyInput: function(e)
    {
        var that = this;
        if (that.data.date == '宝宝生日')
        {
            that.data.date = ''
        }

        this.setData(
        {
            name: e.detail.value
        })

        if (!e.detail.value)
        {
            that.data.name = '';
        }
        that.is_can_click();
    },

    // 按钮变色，是否可以提交
    is_can_click: function()
    {
        var that = this;
        if (that.data.date && that.data.name && that.data.sex && that.data.user_img)
        {
            this.setData(
            {
                btn_disabled: ''
            })
        }
        else
        {
            this.setData(
            {
                btn_disabled: 'disabled'
            })
        }
    },


    // 点击保存数据
    save_data: function()
    {
        console.log('提交表单');
        var that = this;
        // 提交表单
        if (that.data.btn_disabled)
        {

            if (!that.data.user_img)
            {
                wx.showToast(
                {
                    title: '请设置宝宝头像',
                    icon: 'loading',
                    duration: 1500
                })
                return;
            }


            if (!that.data.name)
            {
                wx.showToast(
                {
                    title: '请输入宝宝小名',
                    icon: 'loading',
                    duration: 1500
                })
                return;
            }


            if (that.data.date == '' || that.data.date == '宝宝生日')
            {
                wx.showToast(
                {
                    title: '请选择宝宝生日',
                    icon: 'loading',
                    duration: 1500
                })
                return;
            }

            if (!that.data.sex)
            {
                wx.showToast(
                {
                    title: '请选择宝宝性别',
                    icon: 'loading',
                    duration: 1500
                })
                return;
            }

            return;
        }

        wx.showToast(
        {
            title: '提交中...',
            icon: 'loading',
            duration: 2000
        })


        var sex_key;

        switch (that.data.sex)
        {
            case '男':
                sex_key = 1;
                break;

            case '女':
                sex_key = 2;
                break;
        }

        wx.showLoading(
        {
          title: '提交中...',
        })

        // app 从getApp() 返回
        // header 默认参数为 { 'Content-Type': 'json' }
        app.util.yue_request(
        {
            url: app.globalData.api_domain + '/bb/bb_file.php',
            data:
            {
                baby_image: that.data.user_img,
                baby_name: that.data.name,
                baby_sex: that.data.sex,
                baby_birth: that.data.date,
                baby_id: that.data.baby_id,
                app_session: app.globalData.app_session

            },            
            // response 为过滤过的数据，res为小程序直接下发数据，两者层级仅此不同而已
            success: function(response, res)
            {
                wx.hideLoading()

                var data = response.res.data;
                var image_ids = '';

                console.info(data);

                //宝宝年龄
                var bb_age = (parseInt(that.data.date_end.substring(0,4))-parseInt(that.data.date.substring(0,4))); 

                if (bb_age < 1) 
                {
                    bb_age = 1
                }
         
                bb_age =   bb_age + '岁';


                // 判断是否有 last_id，如果有是新建，否则是修改
                if (data.last_id) 
                {
                    image_ids = data.last_id;
                }
                else
                {
                    image_ids = that.data.baby_id;
                }


                app.redirectTo(that,
                {
                    url: '/pages/bb/bb' + '?&car_type=bb_car&sex_key=' + sex_key + '&name=' + that.data.name +"&age=" + bb_age + "&image_ids="+ image_ids,
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


    // 上传图片
    fetch_upload: function()
    {
        console.log('上传图片');
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
                        app_session: app.globalData.app_session,
                        ext: 'jpg' // 默认jpg
                    },


                    upload_success: function(res)
                    {

            
                        console.log(res)
                        console.log(res.server_file_url)

                        var user_img = res.server_file_url;
                        // 转换图片格式
                        user_img = self.util.change_img_size_v2(user_img,'s86','s86');


                        console.log('上传成功');


                        self.setData(
                        {
                            user_img: user_img,
                            mr_img : '',
                            upload_img_loading : user_img
                        })

                        self.is_can_click();

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
                            // 上传完成
                        // wx.hideToast()
                    }
                })
            }
        })
    },



    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function()
    {

        var self = this;

        var file_op = app.file_op;
        self.util = app.util;

        // 加载上传类
        self.upload_obj = new file_op.yue_file();


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