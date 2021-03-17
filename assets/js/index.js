// 入口函数
$(function () {
  // 1.获取用于信息
  getUserInof();
});

// 退出
let layer = layui.layer;
$('#btnLogout').on('click', function () {
  // 框架提供的询问框
  layer.confirm('是否确定退出', { icon: 3, title: '提示' }, function (index) {
    //do something
    // 1.清空本地teoken
    localStorage.removeItem('token');
    // 2.页面跳转
    location.href = '/login.html';
    // 关闭询问框
    layer.close(index);
  });
})

// 获取用于信息(封装导入口函数的外面了)
// 原因:后面其他页面要调用
function getUserInof() {
  // 发送ajax
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // Headers: {
    //   // 重新登陆,因为token过期时间12小时
    //   Authorization: localStorage.getItem('token') || ""
    // },
    dataType: 'json',
    success: (res) => {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      }
      // 请求成功,渲染头像
      renderAvatar(res.data);
    }
  })
}

function renderAvatar(user) {
  // 渲染名称(nickname优先,如果没有,就用username)
  let name = user.nickname || user.username;
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  // 2.渲染头像
  if (user.user_pic !== null) {
    $('.layui-nav-img').show().attr('src', user.user_pic);
    $('.text-avater').hide();
  } else {
    // 没有头像
    $('.layui-nav-img').hide();
    let text = name[0].toUpperCase();
    $('.text-avater').show().html(text);
  }

}