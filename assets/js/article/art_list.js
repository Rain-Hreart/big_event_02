$(function () {
  // 像模板引擎中导入  变量/函数
  template.defaults.imports.dateFormat = function (dtStr) {
    let dt = new Date(dtStr)

    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  function padZero(num) {
    return num < 10 ? "0" + num : num
  }


  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  };

  // 初始化文章列表
  let layer = layui.layer;
  initTable();
  //封装初始化文章列表函数
  function initTable() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 获取成功
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr);

        //调用分页
        renderPage(res.total);
      }
    })
  }

  // 初始化分类
  let form = layui.form; //导入form
  initCate(); //调用函数
  // 封装
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      data: {},
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        // 校验
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        //赋值  渲染form
        let htmlStr = template('tpl-cate', res);
        $('[name="cate_id"]').html(htmlStr);
        form.render();
      }
    })
  }

  // 筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取
    let state = $('[name="state"]').val();
    let cate_id = $('[name="cate_id"]').val();
    // console.log(state, cate_id);
    // 赋值
    q.state = state;
    q.cate_id = cate_id;
    // 初始化文章列表
    initTable();
  })

  // 分页
  var laypage = layui.laypage;
  function renderPage(total) {
    // alert(total)
    //执行一个laypage实例
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,//每页几条
      curr: q.pagenum,//第几页

      // 分页模块设置,显示哪些子模块
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],

      // 触发jump :分页初始化的时候,页码改变的时候
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //首次不执行
        if (!first) {
          //do something
          initTable();
        }
      }
    });
  }

  // 删除
  $('tbody').on('click', '.btn-delete', function () {
    // 先获取 Id,进入到函数中this代指就改变了
    let Id = $(this).attr("data-id");
    // 显示对话框
    layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + Id,
        data: {},
        dataType: 'json',
        success: (res) => {
          // console.log(res); 
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          //成功,渲染
          initTable();
          layer.msg("删除成功");
          // 页面汇总删除按钮个数等于1,页码大于1;
          if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
          layer.close(index);
        }
      })
    });
  })
})