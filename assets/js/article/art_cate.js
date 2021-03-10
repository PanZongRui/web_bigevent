$(function() {

    var layer = layui.layer;
    var form = layui.form;
    initArtcateList()

    function initArtcateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }


    // 这是为添加类别绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        // 弹出一个添加文章分类的层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    });

    // 通过代理的形式，为form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                initArtcateList();
                layer.msg('新增文章分类成功');
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });

    // 这是为修改文章分类绑定点击事件
    var indexEdit = null;
    // 通过代理的形式，为 btn-edit 按钮绑定 click 事件
    $('tbody').on('click', '#btn-edit', function() {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });
        var id = $(this).attr('data-id');
        // 发起请求获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('formEdit', res.data);
            }
        });
    });

    // 通过代理的形式，为修改文章分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败')
                }
                initArtcateList();
                layer.msg('修改文章分类成功');
                // 根据索引关闭对应的弹出层
                layer.close(indexEdit);
            }
        });
    });

    // 这是为删除文章分类绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    initArtcateList();
                    layer.msg('删除文章分类成功');
                    layer.close(index);
                }
            });

        })


    });

})