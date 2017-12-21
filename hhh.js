var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var array = new Array();

app.get(/\//, function (req, res) {
  if(req.path == "/") {
    if(req.query.username === undefined) {
      res.sendFile( __dirname + "/" + "index/1.html" );
    }
    else {
      var num = 0;
      for(var i = 0; i < array.length; i++)
        if(array[i].username == req.query.username)
          num++;
      if(num == 1) 
        var pathname = "/info/2.html";
      else 
        var pathname = "/index/1.html";
      res.sendFile( __dirname + "/" + pathname );     
    }
  }
  else if(req.path == '/index/1.css' || req.path == '/index/1.js' ||
    req.path == '/info/2.css' || req.path == '/info/2.js' ||
    req.path == '/picture/simple-codelines.svg')
    res.sendFile( __dirname + req.path);
  else if(req.path == '/data') {
    for (var i = 0; i < array.length; i++)
      if (array[i].username == req.query.username) {
        res.send(array[i].username + " " + array[i].number + " " +
                     array[i].tel + " " + array[i].mail + " ");
      }    
  }
})

app.post('/', urlencodedParser, function (req, res) {
    if (req.body.username) {                   //POST                                 
      tmp = {};                            //just post infomation from UI to server 
      tmp.username = req.body.username;        // and save it in an Array temporarily
      tmp.number = req.body.number;
      tmp.tel = req.body.tel;
      tmp.mail = req.body.mail;
      var result = new Array("0","0","0","0");
      for(var i = 0; i < array.length; i++) {
        if(array[i].username == tmp.username)
          result[0] = '1';
        if(array[i].number == tmp.number)
          result[1] = '1';
        if(array[i].tel == tmp.tel)
          result[2] = '1';
        if(array[i].mail == tmp.mail)
          result[3] = '1';
      }
      if(parseInt(result[0]+result[1]+result[2]+result[3]) == 0)
        array.push(tmp);
      res.send(result[0]+result[1]+result[2]+result[3]);
    }
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
