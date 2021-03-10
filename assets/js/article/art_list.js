$(function() {
    var layer = layui.layer;
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + '  ' + hh + ':' + ss + ':' + mm;
    };
    // 定义补零函数
    function padZero(dt) {
        return dt > 9 ? dt : '0' + dt;
    }


    // 定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求参数队形提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认显示两条
        cate_id: '', // 文章分类的Id
        state: '' // 文章的发布状态
    }
    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        });
    }

    // 获取文章分类列表方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                // 通知 layui 重新渲染表单区域的UI结构
                form.render();
            }
        });
    }

    // 为筛选表单绑定 submit 事件
    $('#formSearch').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分业容器的ID
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认选中第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits: [2, 3, 5, 10],
            // 分页发生且换的时候，触发jump 回调
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表并渲染
                if (!first) {
                    initTable();
                }
            },
        });
    }

    // 通过代理的形式为为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            });
            layer.close(index);

        });
    });

    // 监听编辑按钮的点击事件
    $('tbody').on('click', '.btn-edit', function() {
        location.href = '/code/article/art_edit.html?id=' + $(this).attr('data-id');
    })
})