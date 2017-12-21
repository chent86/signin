var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var array = new Array();

app.get(/\//, function (req, res) {
  console.log(req.path);
  console.log(req.cookies);
  if(req.path == "/") {
    if(JSON.stringify(req.cookies) != "{}") {
      var num = 0;
      for(var i = 0; i < array.length; i++)
        if(array[i].username == req.cookies.remember.username)
          num++;
      if(num == 1) 
        var pathname = "/info/info.html";
      else 
        var pathname = "/login/login.html";
      res.sendFile( __dirname + pathname );        
    }
    else if(req.query.username === undefined) {
        res.sendFile( __dirname + "/login/login.html" );
    }
    else {
      var num = 0;
      for(var i = 0; i < array.length; i++)
        if(array[i].username == req.query.username)
          num++;
      if(num == 1) 
        var pathname = "/info/info.html";
      else 
        var pathname = "/login/login.html";
      res.sendFile( __dirname + pathname );     
    }
  }
  else if(req.path == "/regist") {
    res.sendFile( __dirname + "/register/register.html" );
  }
  else if(req.path == '/login/login.css' || req.path == '/login/login.js' ||
    req.path == '/register/register.css' || req.path == '/register/register.js' ||
    req.path == '/picture/simple-codelines.svg' || req.path == '/picture/flag.png'||
    req.path == '/info/info.css' || req.path == '/info/info.js')
      res.sendFile( __dirname + req.path);
  else if(req.path == '/data') {
    for (var i = 0; i < array.length; i++)
      if (array[i].username == req.query.username) {
        res.send(array[i].username +  " " + array[i].number + " " 
          + array[i].tel + " " + array[i].mail + " ");
      }    
  }
})

app.post(/\//, urlencodedParser, function (req, res) {
  if(req.path == "/register") {
    if (check(req.body.username, req.body.password, req.body.number,
    req.body.tel, req.body.mail)) {                   //POST                                 
      tmp = {};                            //just post infomation from UI to server 
      tmp.username = req.body.username;        // and save it in an Array temporarily
      tmp.password = req.body.password;
      tmp.number = req.body.number;
      tmp.tel = req.body.tel;
      tmp.mail = req.body.mail;
      var result = new Array("0","0","0","0","0");
      for(var i = 0; i < array.length; i++) {
        if(array[i].username == tmp.username)
          result[0] = '1';
        // if(array[i].password == tmp.password)
        //   result[1] = '1';        
        if(array[i].number == tmp.number)
          result[2] = '1';
        if(array[i].tel == tmp.tel)
          result[3] = '1';
        if(array[i].mail == tmp.mail)
          result[4] = '1';
      }
      if(parseInt(result[0]+result[1]+result[2]+result[3]+result[4]) == 0)
        array.push(tmp);
      res.cookie('remember', {username: req.body.username, password: req.body.password});
      res.send(result[0]+result[1]+result[2]+result[3]+result[4]);
    }
    else {
      res.send("error");
    }
  }
  else if(req.path == "/login") {
    console.log(req.body.type);
    if(req.body.type == "username") {
      var result = "0";
      for(var i = 0; i < array.length; i++)
        if(array[i].username == req.body.username) {
          result = "1";
          break;
        }
      res.send(result);
    }
    else if(req.body.type == "password") {
      var result = "00";
      for(var i = 0; i < array.length; i++)
        if(array[i].username == req.body.username) {
          result = "10";
          if(array[i].password == req.body.password)
            result = "11";
          break;
        }
        console.log(result);
      res.send(result);
    }
  }
})

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Signin is runing in http://localhost:8000");
})

function check(username, password, number, tel, mail) {
  var result = true;
  var name_check = /^[a-zA-Z][_0-9a-zA-Z]{5,17}$/;
  var password_check = /^[_\-0-9a-zA-Z]{6,12}$/;
  var number_check = /^[1-9]\d{7,7}$/;
  var tel_check = /^[1-9]\d{10,}$/;
  var mail_check = /^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/;
  if(username == "" || password == "" || number == "" || tel == "" || mail == "")
    result = false;
  else if(!name_check.test(username) || !password_check.test(password) || !number_check.test(number)
    || !tel_check.test(tel) || !mail_check.test(mail))
    result = false;
  return result;
}
