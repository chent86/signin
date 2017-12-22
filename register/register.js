window.onload = function() {
  $("#set").bind("click",clean);
  $("#submit").bind("click",change);
  $(".info").focus(writing);
  $(".info").blur(ready_for_check);

  document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode == 13)  //left
          change();      
  };   
}

function writing() {
  if(this.name == "username")
    $(".warning:eq(0)").removeClass("show").addClass("hide");
  if(this.name == "password")
    $(".warning:eq(1)").removeClass("show").addClass("hide");  
  if(this.name == "confirm")
    $(".warning:eq(2)").removeClass("show").addClass("hide");  
  if(this.name == "number")
    $(".warning:eq(3)").removeClass("show").addClass("hide"); 
  if(this.name == "tel")
    $(".warning:eq(4)").removeClass("show").addClass("hide");   
  if(this.name == "mail")
    $(".warning:eq(5)").removeClass("show").addClass("hide");  
}

function ready_for_check() {
  var check = true;
  var name = /^[a-zA-Z][_0-9a-zA-Z]{5,17}$/;
  var number = /^[1-9]\d{7,7}$/;
  var tel = /^[1-9]\d{10,}$/;
  var mail = /^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/;
  var password = /^[_\-0-9a-zA-Z]{6,12}$/;
  if(this.name == "username" && $("input:eq(0)").val() != "")
    if(!name.test($("input:eq(0)").val())) {
        warn("0","Use letter,numeral or underline and begin with letter.\
                   (minimum is 6 and maximum is 18)");
    } else {
      $.post("/register/one",{"username":$("input:eq(0)").val()},function(data) {
        if(data == "error")
          warn("0","Username is already taken");
      });
    }
  if(this.name == "password")
    if($("input:eq(1)").val() != "") {
      if($("input:eq(2)").val() != "" && $("input:eq(1)").val() != $("input:eq(2)").val())
        warn("1","You typed different password");    
      else if(!password.test($("input:eq(1)").val()))
          warn("1","Use lettet,numeral,underline and strikethrough.\
            (minimum is 6 and maximum is 12)");
    }
  if(this.name == "confirm")
    if($("input:eq(2)").val() != "") {
      if($("input:eq(1)").val() != "" && $("input:eq(2)").val() != $("input:eq(1)").val())
        warn("2","You typed different password");        
      else if(!password.test($("input:eq(2)").val()))
          warn("2","Use lettet,numeral,underline and strikethrough.\
            (minimum is 6 and maximum is 12)");      
      }
  if(this.name == "number" && $("input:eq(3)").val() != "")
    if(!number.test($("input:eq(3)").val()))
        warn("3","Use 8 numeral and should not begin with zero")
    else {
      $.post("/register/one",{"number":$("input:eq(3)").val()},function(data) {
        if(data == "error")
          warn("3","Id is already taken");
      });      
    }    
  if(this.name == "tel" && $("input:eq(4)").val() != "")
    if(!tel.test($("input:eq(4)").val()))
        warn("4","Use 11 numeral and should not begin with zero");
    else {
      $.post("/register/one",{"tel":$("input:eq(4)").val()},function(data) {
        if(data == "error")
          warn("4","Telephone is already taken");
      });      
    }  
  if(this.name == "mail" && $("input:eq(5)").val() != "")
    if(!mail.test($("input:eq(5)").val()))
        warn("5","Email format is not correct");
    else {
      $.post("/register/one",{"mail":$("input:eq(5)").val()},function(data) {
        if(data == "error")
          warn("5","Email is already taken");
      });       
    }         
}

function clean() {
  $(".info").val("");
  clean_warn();
}

function change() {
  if(!check())
    return;
  // clean_warn();
  $.ajax({
    method: 'POST',
    url: "/register",
    data: {
      username: $("input:eq(0)").val(),
      password: $.md5($("input:eq(1)").val()),
      number: $("input:eq(3)").val(),
      tel: $("input:eq(4)").val(),
      mail: $("input:eq(5)").val()
    },
    success: function(data) {
      if(data != "error") {    //if not pass check in the server, server will return string error
        if(data[0] == "1")
          warn("0","Username is already taken");
        if(data[1] == "1")
          warn("3","Id is already taken");
        if(data[2] == "1")
          warn("4","Telephone is already taken");
        if(data[3] == "1")
          warn("5","Email is already taken");
        if(data[0] == "0" && data[1] == "0" && data[2] == "0" && data[3] == "0")
          window.location.href="http://localhost:8000?username="+$("input:eq(0)").val();    //GET second time
      }
    }
  });
}

function check() {
  var check = true;
  var name = /^[a-zA-Z][_0-9a-zA-Z]{5,17}$/;
  var number = /^[1-9]\d{7,7}$/;
  var tel = /^[1-9]\d{10,}$/;
  var mail = /^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/;
  var password = /^[_\-0-9a-zA-Z]{6,12}$/;
  if(!$("input:eq(0)").val()) {
    warn("0","Username shouldn't be blank");
    check = false;
  }
  else if(!name.test($("input:eq(0)").val())) {
    warn("0","Use letter,numeral or underline and begin with letter.\
               (minimum is 6 and maximum is 18)");
    check = false;
  }
  if(!$("input:eq(1)").val()) {
    warn("1","Password shouldn't be blank");
    check = false;
  }
  else if(!password.test($("input:eq(1)").val())) {
    warn("1","Use lettet,numeral,underline and strikethrough.\
            (minimum is 6 and maximum is 12)");
    check = false;
  }
  if(!$("input:eq(2)").val()) {
    warn("2","Please type your password again");
    check = false;
  }
  else if($("input:eq(2)").val() != $("input:eq(1)").val()) {
    warn("2","You typed different password");
    check = false;
  }
  if(!$("input:eq(3)").val()) {
    warn("3","Id shouldn't be blank");
    check = false;
  }
  else if(!number.test($("input:eq(3)").val())) {
    warn("3","Use eight numeral and should not begin with zero")
    check = false;
  }
  if(!$("input:eq(4)").val()) {
    warn("4","Telephone shouldn't be blank");
    check = false;
  }
  else if(!tel.test($("input:eq(4)").val())) {
    warn("4","Use elevent numeral and should not begin with zero");
    check = false;
  }
  if(!$("input:eq(5)").val()) {
    warn("5","Email shouldn't be blank");
    check = false;
  }
  else if(!mail.test($("input:eq(5)").val())) {
    warn("5","Email format is not correct");
    check = false;
  }
  return check;
}

function warn(id, report) {
  $(".warning:eq("+id+")").text(report).removeClass("hide").addClass("show");
}

function clean_warn() {
  $(".warning").removeClass("show").addClass("hide");
}