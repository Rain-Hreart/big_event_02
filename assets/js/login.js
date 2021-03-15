// 函数入口
$(function () {
  $('#link_reg').click(() => {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  $('#link_login').click(() => {
    $('.reg-box').hide();
    $('.login-box').show();
  });

  // 自定义验证规则
  let form = layui.form;
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 确认密码规则
    repwd: function (value) {
      console.log(value);
      let pwd = $('.reg-box input[name=password]').val();
      console.log(pwd);
      // 比较
      if (value !== pwd) {
        return "两次密码不一样"
      }
    }
  });

  // 需求:3注册功能
  let layer = layui.layer;
  $('#form_reg').on('submit', function (e) {
    // 阻止表单默认提交
    e.preventDefault();
    // 发送ajax
    $.ajax({
      type: 'POST',
      url: 'http://api-breakingnews-web.itheima.net/api/reguser',
      data: {
        username: $('.reg-box input[name=username]').val(),
        password: $('.reg-box input[name=password]').val(),
      },
      dataType: 'json',
      success: (res) => {
        console.log(res);
        // 注册失败提示
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 5 });;
        }
        // 注册成功提示
        layer.msg("恭喜您,用户名注册成功", { icon: 6 });
        // 切换登录模块
        $('#link_login').click();
        //表单清空
        $('#form_reg')[0].reset();
      }
    })
  });

  // 需求4: 登录功能
  $('#form_login').submit(function (e) {
    // 阻止表单默认提交
    e.preventDefault();
    //发送ajax
    $.ajax({
      type: 'POST',
      url: 'http://api-breakingnews-web.itheima.net/api/login',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        // 校验返回成功
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 5 });;
        }
        // 提示信息,保存token,跳转页面
        layer.msg("登录成功", { icon: 6 });
        // 跳转页面
        location.href = '/index.html';
        // 保存token,未来的接口要使用token
        localStorage.setItem('token', res.token);
      }
    })
  })


})
