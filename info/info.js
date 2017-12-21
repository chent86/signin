var array = new Array();

$(function() {
  var tmp = window.location.href;
  $("#submit").bind("click",signout);
  var raw = Cookies.get('remember');
  var ripe = "";
  for(var i = 2; i < raw.length; i++)
    ripe += raw[i];
  m_cookie = JSON.parse(ripe);
  console.log(m_cookie.username + "hhh" + m_cookie.password);
  var p = tmp.indexOf("=");
  var username = "";
  for(var i = p+1; i < tmp.length; i++)
    username += tmp[i];
  if(p == -1)
    username = "error";
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
});

function signout() {
  window.location.href="http://localhost:8000";
}