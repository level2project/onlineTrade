var formidable = require('formidable'),
    http = require('http'),
    fs = require('fs'),
    sys = require('sys');
http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (error, fields, files) {
            var date = new Date();
            var ms = Date.parse(date);
            if (files.upload1) {
                var types1 = files.upload1.name.split('.');
                fs.renameSync(files.upload1.path, "./data/" + ms + "1.jpg");
            }
            if (files.upload2) {
                var types2 = files.upload2.name.split('.');
                fs.renameSync(files.upload2.path, "./data/" + ms + "2.jpg");
            }
            if (files.upload3) {
                var types3 = files.upload3.name.split('.');
                fs.renameSync(files.upload3.path, "./data/" + ms + "3.jpg");
            }
            var resString = "";
            if (files.upload1) {
                resString += '"1":"' + ms + '1.jpg",';
            }
            if (files.upload2) {
                resString += '"2":"' + ms + '2.jpg",';
            }
            if (files.upload3) {
                resString += '"3":"' + ms + '3.jpg",';
            }
			//resString[resString.length-1] = "}"; 为什么这样不行？ 改到前台处理
            console.log(resString);
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end(resString);
        });
        return;
    }
}).listen(8888, function () {
    console.log('Listening on 8888');
});