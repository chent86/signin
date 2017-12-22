var array = new Array();

$(function() {
  var tmp = window.location.href;
  $("#submit").bind("click",signout);
  var raw = Cookies.get('remember');
  if(raw != undefined) {
    var ripe = "";
    for(var i = 2; i < raw.length; i++)
      ripe += raw[i];
    m_cookie = JSON.parse(ripe);
  }
  var p = tmp.indexOf("=");
  var username = "";
  for(var i = p+1; i < tmp.length; i++)
    username += tmp[i];
  if(raw == undefined)
    warning("You haven't logined yet!");
  if(raw != undefined) {
    if(p != -1 && username != m_cookie.username)
      warning("You can only get your information!");
    username = m_cookie.username;
    $.get("data","username="+username,function(info) { 
      (function(info) {
        var tmp = "";
        for(var i = 0; i < info.length; i++)    //GET third time
          if(info[i] != ' ')
            tmp += info[i];
          else {
            array.push(tmp);
            tmp = "";
          }
        $(".info:eq(0)").val(array[0]);
        $(".info:eq(1)").val(array[1]);
        $(".info:eq(2)").val(array[2]);
        $(".info:eq(3)").val(array[3]);
      })(info);
    });
  }
});

function signout() {
  window.location.href="http://localhost:8000";
  Cookies.remove('remember');
}

function warning(report) {
  $(".warning").text(report).removeClass("hide").addClass("show");
}