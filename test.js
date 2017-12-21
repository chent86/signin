var express = require('express');
var app = express();
 
app.use(express.static('public'));
 
app.get('/index/1.css', function (req, res) {
  res.sendFile( __dirname + "/" + "index/1.css" );
})

app.get('/', function (req, res) {
 res.sendFile( __dirname + "/" + "index/1.html" );
})

app.get('/picture/simple-codelines.svg', function (req, res) {
  console.log("hi");
 res.sendFile( __dirname + "/" + "picture/simple-codelines.svg" );
})
 
app.get('/process_get', function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       "first_name":req.query.first_name,
       "last_name":req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
  console.log("1");
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})