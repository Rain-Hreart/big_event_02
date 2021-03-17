//入口函数
$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 2.点击按钮
  $('#btnChooseTmage').click(function () {
    $('#file').click();
  });

  // 3.修改裁剪图片
  let layer = layui.layer;
  $('#file').on('change', function (e) {
    // 3.1拿到用户选择的文件
    let file = e.target.files[0];
    // 非空校验
    if (file == undefined) {
      return layer.msg("请选择图片");
    }
    // 3.2根据选择的文件,创建一个对应的URL地址:
    let imgURL = URL.createObjectURL(file);
    // 3.3先销毁旧的裁剪区域,在重新设置图片路径,之后在创建
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域

    // 4.上传头像
    $('#btnUpload').click(function () {
      // console.log(1);
      // 获取 base64类型头像(字符串)
      var dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png');
      // console.log(dataURL);
      $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
          avatar: dataURL
        },
        dataType: 'json',
        success: (res) => {
          // console.log(res);
          // 非空校验
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          // 成功提示
          layer.msg("上传头像成功");

          // 渲染页面
          window.parent.getUserInof();
        }
      })
    })
  });
})