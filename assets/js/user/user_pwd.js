// 入口函数
$(function () {
  // 1.定义密码规则
  let form = layui.form;
  form.verify({
    // 1.1密码
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 1.2新旧密码不重复
    samePwd: function (value) {
      // value是新密码,旧密码需要获取
      if (value == $('[ name="oldPwd"]').val()) {
        return "新旧密码不能相同";
      }
    },
    // 1.3两次密码必须相同;
    rePwd: function (value) {
      // value是再次输入的新密码,新密码需要获取
      if (value !== $('[ name="newPwd"]').val()) {
        return "两次新密码不一致";
      }
    }
  });

  //提交功能
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    // 请求ajax
    $.ajax({
      type: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg(res.message);
        }
        // 成功提示
        layui.layer.msg("密码修改成功");
        // 重新渲染页面
        $('.layui-form')[0].reset();
      }
    })
  })
})