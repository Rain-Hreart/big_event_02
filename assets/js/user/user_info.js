// 入口函数
$(function () {
  // 1.校验表单数据
  let form = layui.form;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称必须在1~6个字符之间!"
      }
    }
  });

  // 2.用户渲染
  initUserInfo();
  // 导出layer
  let layer = layui.layer;
  // 封装函数
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      data: {},
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 成功,后渲染
        form.val('formUserInfo', res.data);
      }
    })
  };

  // 绑定提交按钮
  $('#btnReset').click(function (e) {
    console.log(1);
    // 阻止浏览器默认行为
    e.preventDefault();
    // 从新用户渲染页面
    initUserInfo();
  });

  // 提交修改
  $('form').on('submit', function (e) {
    // 阻止浏览器默认行为
    e.preventDefault();
    // 请求ajax
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //成功提示
        layer.msg("更改信息成功");
        // 调用父页面,重新渲染
        window.parent.getUserInof();
      }
    })
  })
})