var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var mongojs = require('mongojs');
var app = express();
app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get(/\//, function (req, res) {
  console.log(req.path);
  console.log(req.cookies);
  var db = mongojs('signin', ['important']);
  if(req.path == "/") {
    if(JSON.stringify(req.cookies) != "{}" && req.cookies.remember != undefined) {
      db.important.findOne({"username": req.cookies.remember.username}, function(err, doc) {
          if(doc != null)
            var pathname = "/info/info.html";
          else
            var pathname = "/login/login.html";
          res.sendFile( __dirname + pathname ); 
      });       
    }
    else if(req.query.username === undefined) {
        res.sendFile( __dirname + "/login/login.html" );
    }
  }
  else if(req.path == "/regist") {
    res.sendFile( __dirname + "/register/register.html" );
  }
  else if(req.path == '/login/login.css' || req.path == '/login/login.js' ||
    req.path == '/register/register.css' || req.path == '/register/register.js' ||
    req.path == '/picture/simple-codelines.svg' || req.path == '/picture/flag.png'||
    req.path == '/info/info.css' || req.path == '/info/info.js' || req.path == '/encrypt/jquery.md5.js')
      res.sendFile( __dirname + req.path);
  else if(req.path == '/data') {
    db.important.findOne({"username": req.cookies.remember.username, "password":req.cookies.remember.password},
    function(err, doc) {
      if(doc != null)
        res.send(doc["username"] +  " " + doc["number"] + " " 
          + doc["tel"] + " " + doc["mail"] + " ")
    })       
  }
})

app.post(/\//, urlencodedParser, function (req, res) {
  var db = mongojs('signin', ['important']);
  if(req.path == "/register/one") {
    if(req.body.username != undefined) {
      db.important.findOne({"username": req.body.username}, function(err, doc) {
        if(doc != null)
          res.send("error")
      });
    }
    else if(req.body.number != undefined) {
      db.important.findOne({"number": req.body.number}, function(err, doc) {
        if(doc != null)
          res.send("error")
      });
    }
    else if(req.body.tel != undefined) {
      db.important.findOne({"tel": req.body.tel}, function(err, doc) {
        if(doc != null)
          res.send("error")
      });
    }
    else if(req.body.mail != undefined) {
      db.important.findOne({"mail": req.body.mail}, function(err, doc) {
        if(doc != null)
          res.send("error")
      });
    }
  }
  else if(req.path == "/register") {
    if (check(req.body.username, req.body.password, req.body.number,
    req.body.tel, req.body.mail)) {                   //POST                                 
      tmp = {};                            //just post infomation from UI to server 
      tmp.username = req.body.username;        // and save it in an Array temporarily
      tmp.password = req.body.password;
      tmp.number = req.body.number;
      tmp.tel = req.body.tel;
      tmp.mail = req.body.mail;
      var result = new Array("0","0","0","0","0");
      db.important.findOne({"username": tmp.username}, function(err, doc) {
          if(doc != null)
            result[0] = '1';
          db.important.findOne({"number": tmp.number}, function(err, doc) {
              if(doc != null)
                result[1] = '1';
              db.important.findOne({"tel": tmp.tel}, function(err, doc) {
                  if(doc != null)
                    result[2] = '1';
                  db.important.findOne({"mail": tmp.mail}, function(err, doc) {
                      if(doc != null)
                        result[3] = '1';
                      if(parseInt(result[0]+result[1]+result[2]+result[3]) == 0)
                        db.important.insert(tmp);
                      res.cookie('remember', {username: req.body.username, password: req.body.password},
                              {'expires':new Date(Date.now() + 900000)});
                      res.send(result[0]+result[1]+result[2]+result[3]);
                  });
              });
          });
      });
    }
    else {
      res.send("error");
    }
  }
  else if(req.path == "/login") {
    console.log(req.body.type);
    if(req.body.type == "username") {
      var result = "0";
      db.important.findOne({"username": req.body.username}, function(err, doc) {
          if(doc != null)
            result = "1";
          res.send(result);
      });
    }
    else if(req.body.type == "password") {
      var result = "00";
      db.important.findOne({"username": req.body.username}, function(err, doc) {
          if(doc != null) {
            result = "10";
            db.important.findOne({"username": req.body.username, "password": req.body.password}, function(err, doc) {
                if(doc != null) {
                  result = "11";
                  res.cookie('remember', {username: req.body.username, password: req.body.password},
                    {'expires':new Date(Date.now() + 900000)});
                  res.send(result);                  
                } else 
                  res.send(result);
            });            
          } else
            res.send(result);
      });
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
  // var password_check = /^[_\-0-9a-zA-Z]{6,12}$/;
  var number_check = /^[1-9]\d{7,7}$/;
  var tel_check = /^[1-9]\d{10,}$/;
  var mail_check = /^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/;
  if(username == "" || password == "" || number == "" || tel == "" || mail == "")
    result = false;
  else if(!name_check.test(username) || !number_check.test(number)
    || !tel_check.test(tel) || !mail_check.test(mail))
    result = false;
  return result;
}
