
var randint = (start, end) => Math.floor(Math.random()*(end-start)+start)
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function ab2str(buf) {
  var tmp, more = "";
  if(buf.length%2) {
    tmp = buf[buf.length-1];
    more = String.fromCharCode(tmp)
    // buf[buf.length-1] = 0;
    // buf = [...buf, tmp];
    if(buf instanceof Array) buf.pop()
    else buf = buf.subarray(0, buf.length-1)
  }
  return String.fromCharCode.apply(null, new Uint16Array(new Uint8Array(buf).buffer)) + more;
}
function string2array(s, encoding = "utf-8"){
    //if(encoding==="utf-16") return new Uint8Array(str2ab(s));
    var enc = new TextEncoder(encoding);
    return enc.encode(s);
}
function array2string(a, encoding = "utf-8"){
  //if(encoding==="utf-16") return ab2str(a);
    var dec = new TextDecoder(encoding);
    return dec.decode(new Uint8Array(a));
}
function test(mod, data, encoding="utf-8"){
    var start = new Date().getTime();
    var txt, dedata;
    try{
        var txt = mod.encode(data)
        var dedata = mod.decode(txt);
    }catch(e){
        return e;
    }
    var end = new Date().getTime() - start;
    var size = data.length;
    var correct = true;
    var isText = true;
    if(dedata.length!==data.length) correct = false;
    else{
        for(var i=0;i<data.length;i++){
            if(dedata[i]!==data[i]){
                correct = false;
                break;
            }
        }
    }
    try{
        isText = string2array(JSON.stringify(txt), encoding).length/size
    }catch(e){isText = false;}
    return {
        time: end,
        correct,
        size: string2array(txt, encoding).length/size,
        isText
    }
}

async function doTest(testData , log=console.log){
    log("base16", test(baseEncoding.base16, testData))
    log("base32", test(baseEncoding.base32, testData))
    log("base36", test(baseEncoding.base36, testData))
    log("base58", test(baseEncoding.base58, testData))
    log("base62", test(baseEncoding.base62, testData))
    log("base64", test(baseEncoding.base64, testData))
    log("base85", test(baseEncoding.base85, testData))
    log("base91", test(baseEncoding.base91, testData))
    log("base92", test(baseEncoding.base92, testData))
    log("base122", test(baseEncoding.base122, testData))
    log("base2048", test(baseEncoding.base2048, testData))
    log("base32768", test(baseEncoding.base32768, testData))
    log("base65536", test(baseEncoding.base65536, testData))
    log("base131072", test(baseEncoding.base131072, testData))
}
var test_log = document.getElementById("test-log");
var test_size = document.getElementById("test-size");
var test_bn = document.getElementById("test-bn");
test_bn.addEventListener("click", function(){
    const SIZE = Number.parseInt(test_size.value);
    var testData;
    if(isNaN(SIZE)) testData = input_file_before_arr;
    else testData = new Uint8Array(Array.from(new Array(SIZE)).map(e=>randint(0,256)))
    doTest(testData, tableLog);
});
function tableLog(name, obj){
    var tr = document.createElement("tr");
    var title = document.createElement("td");
    var sizeRate = document.createElement("td");
    var correct = document.createElement("td");
    var time = document.createElement("td");
    var jsonString = document.createElement("td");
    if(obj instanceof Error) {
        title.innerText = name;
        sizeRate.innerText = obj.toString();
        tr.appendChild(title)
        tr.appendChild(sizeRate)
        test_log.appendChild(tr);
        return;
    }
    title.classList.add("title-td");
    time.classList.add("border");
    correct.classList.add("border");
    sizeRate.classList.add("border");
    jsonString.classList.add("border");

    title.innerText = name;
    time.innerText = obj.time
    correct.innerText = obj.correct
    sizeRate.innerText = obj.size
    jsonString.innerText = obj.isText;
    tr.appendChild(title)
    tr.appendChild(correct)
    tr.appendChild(time)
    tr.appendChild(sizeRate)
    tr.appendChild(jsonString)
    test_log.appendChild(tr);
}
//enc = baseEncoding.base122.encode(testData)
//dbg = array2string(string2array(baseEncoding.base122.encode(testData)), "utf-16")
