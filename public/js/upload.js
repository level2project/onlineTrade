$(document).ready(function () {
    $(".memenu").memenu();
    $("#toTop").hide();
});


/**
 * 用于页面预览图片
 * @param imgId  图片ID
 * @param previewId 预览的位子的ID
 * @returns {boolean}
 */
function setImagePreview(imgId, previewId) {
    var docObj = document.getElementById(imgId);

    var imgObjPreview = document.getElementById(previewId);
    if (docObj.files && docObj.files[0]) {
        imgObjPreview.style.display = 'inline';
        imgObjPreview.style.width = '150px';
        imgObjPreview.style.height = '150px';
        //imgObjPreview.src = docObj.files[0].getAsDataURL();

        imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);

    } else {
        docObj.select();
        var imgSrc = document.selection.createRange().text;
        var loadPicture = document.getElementById("loadPicture");
        loadPicture.style.width = "450px";
        loadPicture.style.height = "150px";
        try {
            loadPicture.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            loadPicture.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
        } catch (e) {
            return false;
        }
        imgObjPreview.style.display = 'block';
        document.selection.empty();
    }
    //如果文件有修改 那么应该恢复上传功能 并把原始的pictureName置空
    $('#tip').addClass('hide');//上传成功 提示删除
    alreadyUploaded = 0;
    //恢复对应的图片上传功能
    switch (imgId) {
        case 'Picture1':
            $('#Picture1').attr('name', 'upload1');
            break;
        case 'Picture2':
            $('#Picture2').attr('name', 'upload2');
            break;
        case 'Picture3':
            $('#Picture3').attr('name', 'upload3');
            break;
    }
}

/**
 * 点击“再加一张”按钮响应
 */
$('#add-picture').on('click', function () {
    if ($('#Picture2').hasClass('hide')) {//第一次点。
        $('#Picture2').removeClass('hide');
        $('#tip').addClass('hide');//上传成功 提示删除   恢复上传功能
        alreadyUploaded = 0;
    } else {//第二次点。
        $('#Picture3').removeClass('hide');
        $('#tip').addClass('hide');//上传成功 提示删除   恢复上传功能
        alreadyUploaded = 0;
        $('#add-picture').hide();//不能再点了。
    }
});

var pictureName1 = null;
var pictureName2 = null;
var pictureName3 = null;
var alreadyUploaded = 0; //标志是否已经点过上传
/**
 * 图片的上传 需要获得图片的文件名（服务端的是以日期命名的）
 */
$('#uploaded-picture').on('click', function () {
    if (!$('#Picture1').val() && !$('#Picture2').val() && !$('#Picture3').val()) {
        //如果一张图片都没选择 提示返回
        alert('请先选择一张图片。');
        return;
    }
    if (alreadyUploaded) {//如果已经上传过了，那么不会再上传
        return;
    }
    //开始上传
    var temp;
    $('#picture').ajaxSubmit(function (text, status) {
        if (status === 'success') {
            //返回的是3个文件名 格式接近json格式 最后个,改成}后就可以直接转换 （后端处理不了 不知道为什么）
//            console.log(text[text.length-1])
//            text[text.length-1]='}';
//            console.log(text);
            temp = '{';                         //这个鬼地方真是莫名其妙。。。
            temp += text.toString().substr(0, text.toString().length - 1);
            temp += '}';
            var pic = JSON.parse(temp);
//            console.log(pic['1'])
//            console.log(pic['2'])
//            console.log(pic['3'])
            //处理pictureName1～3
            if (pic['1']) {
                pictureName1 = pic['1'];
                $('#Picture1').removeAttr('name');//删除name 避免重复提交
            }
            if (pic['2']) {
                pictureName2 = pic['2'];
                $('#Picture2').removeAttr('name');//删除name 避免重复提交
            }
            if (pic['3']) {
                pictureName3 = pic['3'];
                $('#Picture3').removeAttr('name');//删除name 避免重复提交
            }
            alreadyUploaded = 1;
            $('#tip').removeClass('hide');
        }
    });

});
/**
 * 商品信息提交 注意处理图片
 */
$('#affirm').on('click', function () {
    var data = $('input').serialize();  //  pname price amount ptext 要额外处理pcstyle(pcid[默认为1]外键)（这个还没处理。。。）
    data += '&' + $('textarea').serialize();  // introduction

    //处理图片
    var pictureNum = 0;
    if (pictureName1) {
        pictureNum++;
        data += '&picture1=http://10.33.28.7:15000/' + pictureName1;
    }
    if (pictureName2) {
        pictureNum++;
        data += '&picture2=http://10.33.28.7:15000/' + pictureName2;
    }
    if (pictureName3) {
        pictureNum++;
        data += '&picture3=http://10.33.28.7:15000/' + pictureName3;
    }
    if (pictureNum === 0) {
        alert('至少上传一张图片。。');
        return;
    }
    //处理卖家ID 从cookie中拿 （sellerid 对应 user表中的 uid）
    var getUid = document.cookie;
    var uid = '';
    for (i = getUid.indexOf('id=') + 3; i < getUid.length && (getUid[i] != ';' && getUid[i] != '&'); i++) {
        uid += getUid[i];
    }
    data += '&sellerid=' + uid;
    console.log(data)
    $.post('/verify/addGood', data, function (text, status) {
        if (/添加成功/.test(JSON.stringify(text))) {
            if (confirm("添加成功,继续添加？")) {
                location.href = '/upload.html';
            } else {
                location.href = '/';
            }
        } else {
            alert(JSON.stringify(text));
            return;
        }
    })
});