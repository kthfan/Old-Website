


function gen_a(str, h){
  var a = document.createElement("a");
  a.innerText = str;
  a.href = h;
  return a;
}

function getBrowserWidth(){
  return window.innerWidth || Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
function getBrowserHeight(){
  return window.innerHeight || Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}
function load4tutorials(url, template_url){
  template_url = template_url || "../index_template.html";
  var fra = document.getElementsByTagName("iframe")[0];
  fra.style.position = "absolute";
  fra.style.width = getBrowserWidth();
  fra.style.height = getBrowserHeight();
  fra.style.left = 0;
  fra.style.top = 0;
  fra.style.borderWidth = 0;
  window.addEventListener("resize", function(){
    fra.style.width = getBrowserWidth();
    fra.style.height = getBrowserHeight();
  });
  fra.src = template_url;
  var win = fra.contentWindow;
  fra.onload = function(){
    var sub_fra = win.document.getElementById("inner-frame");
    sub_fra.src = url;
  }
}
function tutSrcElem(text, temp, src){
  var elem = document.createElement("div");
  elem.innerText = text;
  elem.addEventListener("click", function(){
    inner_frame.src = "template/"+temp+".html?json="+src;
  });
  return elem;
}
function loadJSON(callback, file) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}
  
