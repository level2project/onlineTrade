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
    return true;
}


var pictureName1 = null;
var alreadyUploaded = 0; //标志是否已经点过上传
/**
 * 图片的上传 需要获得图片的文件名（服务端的是以日期命名的）
 */
$('#uploaded-picture').on('click', function (event) {
    event = event || window.event;
    event.preventDefault();
//    console.log('1: '+$('#Picture1').val());
//    console.log('2: '+$('#Picture2').val());
//    console.log('3: '+$('#Picture3').val());
    if (alreadyUploaded) {//如果已经上传过了，那么不能再上传
        return;
    }
    alreadyUploaded = 1;
    $('#picture').ajaxSubmit(function (text, status) {
        if (status == 'success') {
            pictureName1 = text; //返回的是文件名 如 123456.jpg
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
    if(pictureName1){
        data+='&picture1=http://10.33.28.7:15000/'+pictureName1;
    }
    //处理卖家ID 从cookie中拿 （sellerid 对应 user表中的 uid）
    var getUid = document.cookie;
    var uid = '';
    for (i = getUid.indexOf('id=') + 3; i < getUid.length && getUid[i] != ';'; i++) {
        uid += getUid[i];
    }
    data+='&sellerid='+uid;
    console.log(data)
    $.post('/verify/addGood',data,function(text, status){
        if(/添加成功/.test(JSON.stringify(text))){
            location.href = '/';
        }else{
            alert(JSON.stringify(text));
            return;
        }
    })
});