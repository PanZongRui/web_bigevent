$(function() {
    var layer = layui.layer;
    // 调用 getUserInfo 函数获取用户基本信息
    getUserInfo();

    // 点击按钮，实现推出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1.清空本地存储的 token 值
            localStorage.removeItem('token');
            // 2.跳转到 login.html 页面
            location.href = '/code/login.html';
            layer.close(index);
        });
    });

});

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头字段
        // headers: {
        //     Authorization: localStorage.getItem('token'),
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户失败！')
            }

            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        // 不论请求成功还是失败，最终都会调用complete回调函数
        // complete: function(res) {
        //     // console.log('执行了 complete 回调');
        //     // console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1.强制清空 token 值
        //         localStorage.removeItem('token');
        //         // 2.跳转到 login.html 页面
        //         location.href = '/code/login.html';
        //     }
        // }
    });
}

function renderAvatar(data) {
    // 1. 获取用户的名称
    var name = data.nickname || data.username;
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3. 按需渲染用户的头像
    if (data.user_pic !== null) {
        // 3.1 渲染图片头像 
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}