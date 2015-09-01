/**
 * Created by joe on 15-8-18.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');
//直接进入index.html 参数 进行路由转换
var server = http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var path = url.parse(req.url, true);
    var whatKind = path.pathname.match(/\.\w+$/);
    switch ('.' + whatKind) {
        case "..jpg":
            var picture = 'C:\\Users\\joe\\data' + decodeURI(path.pathname);
            fs.exists(picture, function (exists) {
                if(exists){
                    res.writeHead(200, {"Content-Type": "application/x-jpg"});
                    fs.createReadStream(picture).pipe(res);
                    console.log('successfully return a picture '+picture);
                } else{
                    res.end('cannot find the picture on my server');
                    console.log('someone finding a nonexistent picture '+picture)
                }
            });
            break;
        case "..ico":
            res.end('');
            break;
        default:
            res.end('I donot know what happen...');
            console.log('someone try to do something I cannot support...');
    }

})
server.listen(15000, function () {
    console.log('server listening on port 15000');
});

