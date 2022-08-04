importScripts('../js/decimal.js','11100.js', '../../html_css_javascript/WebWorkerLoop/WebWorkerLoop.js');
WebWorkerLoop.setLocation("http://followjohn.epizy.com/html_css_javascript/WebWorkerLoop/");

onmessage = function(e){
    var n = parseInt(e.data[0]);
    var n1 = n+1;
    Decimal.precision = n1;
    var spn = Math.ceil(n1/Math.ceil(60/(1+1*Math.exp(-0.00001*n1))-30));
    var geted = false;
    var loopobj = WebWorkerLoop({start:0, iter:n1, split_num:spn, iter_script_path:"http://followjohn.epizy.com/math/11100/iter.js",
                    integrate_script_path:"http://followjohn.epizy.com/math/11100/int.js"});
    loopobj.sendWorkerData(n);
    loopobj.onmessage = function(data){
        if(geted) return;
        if(data != null){
            geted = true;
            data = Decimal(data);
            postMessage([String(data.divToInt(n).toFixed()), String(data.toFixed()),e.data[1] ]);
            loopobj.terminate();
            loopobj.terminateIntegrate();
            setTimeout(function(){loopobj.forceTerminate()}, 10000);
        }else if(data==="error"){
            postMessage(["error", "error"]);
        }
    }
    loopobj.run({import_list:["http://followjohn.epizy.com/math/js/decimal.js"]});
}
/*
onmessage = function(e) {
  Decimal.precision = parseInt(e.data[0])+1;
  var tmp = get110mul(e.data[0]);
  var num = e.data[0];
  if(tmp===null){
      postMessage(["error", "error"]);
      return;
  }
  postMessage([String(tmp.divToInt(num).toFixed()), String(tmp.toFixed()),e.data[1] ]);
}*/