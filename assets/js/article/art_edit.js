$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
    var params = new URLSearchParams(location.search);
    var artId = params.get('id');

    // 定义加载文章分类的方法
    initCate();
    // initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                form.render();
                getArticleById()
            }
        });
    }


    // // 1. 初始化图片裁剪器
    // var $image = $('#image');

    // // 2. 裁剪选项
    // var options = {
    //     aspectRatio: 400 / 280,
    //     preview: '.img-preview',
    //     // 初始化图片裁剪框的大小
    //     autoCropArea: 1
    // }

    // // 3. 初始化裁剪区域
    // $image.cropper(options);


    // 2. 根据文章的 Id，获取文章的详情，并初始化表单的数据内容
    function getArticleById() {
        // 发起请求，获取文章详情
        $.get('/my/article/' + artId, function(res) {
            // 获取数据失败
            if (res.status !== 0) {
                return layer.msg('获取文章失败！')
            }
            // 获取数据成功
            var art = res.data;
            // console.log(art.cover_img);
            // 为 form 表单赋初始值
            form.val('addArticle', {
                'Id': art.Id,
                'title': art.title,
                'cate_id': art.cate_id,
                'content': art.content
            })

            // 手动初始化富文本编辑器
            initEditor();
            // 初始化图片裁剪器
            var $image = $('#image')

            $image.attr('src', 'http://api-breakingnews-web.itheima.net' + art.cover_img)
                // $image.attr('src', 'http://www.liulongbin.top:3007' + art.cover_img)

            // 裁剪选项
            var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',
                    // 初始化图片裁剪框的大小
                    autoCropArea: 1
                }
                // 初始化裁剪区域
            $image.cropper(options)


        })
    }

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function(e) {
        e.preventDefault();
        $('#coverFile').click();
    });

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        console.log(newImgURL);
        // 为裁剪区域重新设置图片
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });



    var art_state = '已发布';
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });
    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.基于Form 表单，快速的创建一个 FormData 对象
        var fd = new FormData($(this)[0]);

        // 3.将文章发布状态，存放到 fd 中
        fd.append('state', art_state);
        // 4. 将裁剪后的图片，输出为一个文件对象
        $('#image')
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象存储到fd 中
                fd.append('cover_img', blob);
                // 6.发起Ajax请求
                publishArticle(fd);
            });

    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('编辑文章失败!')
                }
                location.href = '/code/article/art_list.html'
            }
        })
    }
})