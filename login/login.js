window.onload = function() {
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
}

function ready_for_check() {
  if(this.name == "username" && $("input:eq(0)").val() != "") {
    $.ajax({
      method: 'POST',
      url: "/login",
      data: {
        type: "username",
        username: $("input:eq(0)").val()
      },
      success: function(data) {
        if(data == "0") {
          warn("0","This username hasn't been registered!");
        }
      }
    });    
  }
  if(this.name == "password" && $("input:eq(0)").val() != "" && $("input:eq(1)").val() != "") {
    $.ajax({
      method: 'POST',
      url: "/login",
      data: {
        type: "password",
        username: $("input:eq(0)").val(),
        password: $.md5($("input:eq(1)").val())
      },
      success: function(data) {
        if(data[0] == '0')
          warn("0","This username hasn't been registered!");
        else if(data[1] == '0') 
          warn("1","Password is not correct!");
      }
    });     
  }
   
}

function clean() {
  $(".info").val("");
  clean_warn();
}

function change() {
  var check = true;
  if($("input:eq(0)").val() == "") {
    check = false;
    warn("0","Please enter username");
  }
  if($("input:eq(1)").val() == "") {
    check = false;
    warn("1","Please enter password");
  }
  if(check) {
    $.ajax({
      method: 'POST',
      url: "/login",
      data: {
        type: "password",
        username: $("input:eq(0)").val(),
        password: $.md5($("input:eq(1)").val())
      },
      success: function(data) {
        if(data[0] == '0')
          warn("0","This username hasn't been registered!");
        else if(data[1] == '0') 
          warn("1","Password is not correct!");
        else 
          window.location.href="http://localhost:8000?username="+$("input:eq(0)").val();
      }
    });     
  }
}

function warn(id, report) {
  $(".warning:eq("+id+")").text(report).removeClass("hide").addClass("show");
}

function clean_warn() {
  $(".warning").removeClass("show").addClass("hide");
}