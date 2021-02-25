$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    // 全局统一挂载complete回调函数
    // 不论请求成功还是失败，最终都会调用complete回调函数
    options.complete = function(res) {
        // console.log('执行了 complete 回调');
        // console.log(res);
        // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强制清空 token 值
            localStorage.removeItem('token');
            // 2.跳转到 login.html 页面
            location.href = '/code/login.html';
        }
    }
})