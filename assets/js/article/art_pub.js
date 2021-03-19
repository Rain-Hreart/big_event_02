$(function () {
  // 初始化分类
  let form = layui.form; //导入form
  let layer = layui.layer; //导入layer
  initCate(); //调用函数
  // 封装
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        // 校验
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        //赋值  渲染form
        let htmlStr = template('tpl-cate', { data: res.data });
        $('[name="cate_id"]').html(htmlStr);
        form.render();
      }
    })
  }
  // 初始化富文本编辑器
  initEditor();
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 4.点击图片,选择图片
  $('#btnChooseImge').click(function () {
    $('#coverFile').click();
  });

  // 5.设置图片
  $('#coverFile').change(function (e) {
    // 拿到用户选择的文件
    let file = e.target.files[0];
    // 费控校验!
    if (file == undefined) {
      return;
    }
    // 根据选择的文件,创建一个对应的URL 地址
    var newImgURL = URL.createObjectURL(file)
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 6.设置状态
  let state = "已发布";
  $('#btnSave2').on('click', function () {
    state = "草稿";
  });

  // 7.添加文章
  $('#form-pud').on('submit', function (e) {
    e.preventDefault();
    // 创建FormData对象,收集数据
    let fd = new FormData(this);
    // 放入状态
    fd.append("state", state);
    // 放入图片
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd);
      });
  })
  // 封装,添加文章的方法
  function publishArticle(fd) {
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      dataType: 'json',
      success: (res) => {
        console.log(res);
        // 失败判断
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("发布成功!");
        // 跳转
        // location.href = '/article/art_list.html';
        setTimeout(() => {
          window.parent.document.getElementById('art_list').click();
        }, 1500);
      }
    })
  }
})