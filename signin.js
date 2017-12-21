var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var array = new Array();

http.createServer(function(request, response) {
  console.log(request.method + ': ' + request.url);
  var params = url.parse(request.url, true).query;
  if (request.method == "GET") {
    if (params.username) {
      var pathname = url.parse(request.url).pathname;                //deal with GET request
      console.log("Request for " + pathname + " received.");
      if (pathname == "/") {
        var num = 0;
        for(var i = 0; i < array.length; i++)
          if(array[i].username == params.username)
            num++;
        console.log(num);
        if(num == 1) 
          pathname = "/info/2.html";
        else
          pathname = "/index/1.html";
          fs.readFile(pathname.substr(1), function(err, data) {        //three kinds of problems
            if (err) {                                                 //1. GET without username:
              console.log(err);                                        //   offer register UI
              response.writeHead(404, {'Content-Type' : 'text/html'}); //2. GET with username
            } else {                                                   //   give infomation UI and change url in the meanwhile
              response.writeHead(200, {'Content-Type' : 'text/html'}); //3. GET with username(2)
              response.write(data.toString());                         //   give infomation from server to UI
            }
            response.end();
          });
      } else {
      var pathname = url.parse(request.url).pathname;                //deal with GET request
      console.log("hello Request for " + pathname + " received.");
        for (var i = 0; i < array.length; i++)
          if (array[i].username == params.username) {
            response.end(array[i].username + " " + array[i].number + " " +
                         array[i].tel + " " + array[i].mail + " ");
          }
      }
    } else {
      var pathname = url.parse(request.url).pathname;
      console.log("Request for " + pathname + " received.");
      if (pathname == "/")
        pathname = "/index/1.html";
      fs.readFile(pathname.substr(1), function(err, data) {
        if (err) {
          console.log(err);
          response.writeHead(404, {'Content-Type' : 'text/html'});
        } else {
          if(pathname == "/picture/simple-codelines.svg") {
            response.writeHead(200, {'Content-Type' : 'image/svg+xml'});
          }
          else
          response.writeHead(200);
          response.write(data.toString());
        }
        response.end();
      });
    }
  } else if (request.method == "POST") {
    var body = "";
    request.on('data', function(chunk) { body += chunk; });
    request.on('end', function() {
      body = querystring.parse(body);
      response.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'}); 
      if (body.username) {                   //POST                                 
        tmp = {};                            //just post infomation from UI to server 
        tmp.username = body.username;        // and save it in an Array temporarily
        tmp.number = body.number;
        tmp.tel = body.tel;
        tmp.mail = body.mail;
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
        response.end(result[0]+result[1]+result[2]+result[3]);
        //  var fs = require("fs");
        //  console.log("准备写入文件");
        //  fs.writeFile('output', body.username,  function(err) {
        //   if (err) {
        //       return console.error(err);    if we need to save information, we can write to file.
        //   }
        // });
      }
    });
  }
})
.listen(8000);

console.log('Server running at http://127.0.0.1:8000/');