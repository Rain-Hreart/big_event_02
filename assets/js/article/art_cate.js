$(function () {
  // 1.文章类别列表展示
  initArCateList();
  function initArCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      data: {},
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        let htmlStr = template('tpl-art-cate', { data: res.data });
        $('tbody').html(htmlStr);
      }
    })
  };

  //2. 显示添加文章分类列表
  let layer = layui.layer;
  $('#btnAdd').click(function () {
    // 利用框架代码,显示提示添加文章类别区域
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 3.提交文章分类添加(事件委托)
  let indexAdd = null;
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 添加成功,重新渲染页面数据
        initArCateList();
        layer.msg("文章类别添加成功");
        layer.close(indexAdd);
      }
    })
  });

  // 4.修改-展示表单
  let indexEdit = null;
  let form = layui.form;
  $('tbody').on('click', '.btn-edit', function () {
    // 利用框架代码,显示提示添加文章类别区域
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    });
    // 4.2获取Id,发送ajax获取数据,渲染到页面
    let Id = $(this).attr("data-id");
    // alert(Id);
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + Id,
      data: {},
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        form.val('form-edit', res.data)
      }
    })
  });

  // 5.修改提交
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 修改成功并渲染
        initArCateList();
        layer.msg("修改成功");
        layer.close(indexEdit);
      }
    })
  });

  // 6.删除
  $('tbody').on('click', '.btn-delete', function () {
    // 6.1先修改Id,进入到函数中this代指就改变了;
    let Id = $(this).attr("data-id");
    // 显示对话框
    layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + Id,
        data: {},
        dataType: 'json',
        success: (res) => {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          //成功,渲染
          initArCateList();
          layer.msg("删除成功");
          layer.close(index);
        }
      })
    });
  })
})
