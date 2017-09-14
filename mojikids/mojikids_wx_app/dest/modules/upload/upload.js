/**
 * 文件操作类
 */
class yue_file {
  constructor(options) {
    var self = this;
    self.init(options);
  }
  init(options) {
    var self = this;
    options = options || {};

    self.app = getApp();
  }
  /**
   * 上传请求
   */
  upload(options) {
    var self = this;
      
    options = options || {};

    self.app.util.yue_request(options)
      .then(function (res) {
        // 获取file 请求
        var data = res.data.res;
        var server_url = data.server_url;
        var server_file_url = data.file_url;
        var file_url = options.file_path;
        var upload_params = data.upload_params;

        console.log(data)
        var params = {
          url: server_url, //上传接口
          filePath: file_url,
          headers: {

          },
          name: 'file',
          formData: {
            data: JSON.stringify(upload_params)
          },
          success: function (res) {

            if (res.data) {
              var obj = JSON.parse(res.data);

              obj.server_file_url = server_file_url;

              if (typeof options.upload_success == 'function') {
                options.upload_success.call(this, obj);
              }

            }
          },
          fail: function (res) {
            // 上传文件失败
            debugger;
            wx.showToast({
              title: res.errMsg
            })
          }
        };

        var params = Object.assign({}, params);

        wx.uploadFile(params)
      })
      .then(function (res) {
        // 请求file info 失败
        console.warn(3333)        
      })


  }
}

module.exports = {
  yue_file: yue_file
}