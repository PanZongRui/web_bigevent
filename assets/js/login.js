$(function() {
    // 从 layui中获取form对象
    var form = layui.form;
    // 从 layui中获取layer对象
    var layer = layui.layer;

    // 点击"去注册账号"的连接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击"去登录"的连接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });


    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验聊两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name="password"]').val();
            if (value !== pwd) {
                return '两次密码不一致！'
            }
        }
    });


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起Ajax的请求
        var data = {
            username: $('.reg-box [name="username"]').val(),
            password: $('.reg-box [name="password"]').val()
        }
        $.post(
            '/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录！');
                // 模拟人的点击行为
                $('#link_login').click();
            }
        )
    });


    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取登录表单里的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！');
                // 将登录成功后得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 登录成功后跳转到后台主页
                location.href = '/code/index.html';
            }
        });
    });
})