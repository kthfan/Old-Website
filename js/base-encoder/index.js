

var before_file = document.getElementById("before-file");
var before_fn = document.getElementById("before-fn");
var before_dn = document.getElementById("before-dn");
var before_text = document.getElementById("before-text");
var before_show_text = document.getElementById("before-show-text");

var after_file = document.getElementById("after-file");
var after_fn = document.getElementById("after-fn");
var after_dn = document.getElementById("after-dn");
var after_text = document.getElementById("after-text");
var after_show_text = document.getElementById("after-show-text");

var base16_bn = document.getElementById("base16-bn");
var base32_bn = document.getElementById("base32-bn");
var base36_bn = document.getElementById("base36-bn");
var base58_bn = document.getElementById("base58-bn");
var base62_bn = document.getElementById("base62-bn");
var base64_bn = document.getElementById("base64-bn");
var base85_bn = document.getElementById("base85-bn");
var base91_bn = document.getElementById("base91-bn");
var base92_bn = document.getElementById("base92-bn");
var base122_bn = document.getElementById("base122-bn");
var base2048_bn = document.getElementById("base2048-bn");
var base32768_bn = document.getElementById("base32768-bn");
var base65536_bn = document.getElementById("base65536-bn");
var base131072_bn = document.getElementById("base131072-bn");

var input_file_before_arr = new ArrayBuffer;
var input_file_after_arr = new ArrayBuffer;

var solved_before_arr = new ArrayBuffer;
var solved_after_arr = new ArrayBuffer;

function string2array(s, encoding = "utf-8"){
    var enc = new TextEncoder(encoding);
    return enc.encode(s);
}
function array2string(a, encoding = "utf-8"){
    var dec = new TextDecoder(encoding);
    return dec.decode(new Uint8Array(a));
}
function myAlert(text, func=()=>{}){
    var panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = "calc( 50% + -200px )";
    panel.style.top = "30%";
    panel.style.width = "400px";
    panel.style.height = "200px";
    panel.style.backgroundColor = "#222";
    var txd = document.createElement("div") 
    var ok = document.createElement("button")
    var no = document.createElement("button")
    txd.innerText = text;
    txd.style.margin = "10px";
    ok.style.position = "absolute";
    no.style.position = "absolute";
    ok.style.right = "20px";
    ok.style.bottom = "20px";
    no.style.left = "20px";
    no.style.bottom = "20px";
    ok.innerText = "OK"
    no.innerText = "cancel"
    ok.onclick = e => {document.body.removeChild(panel);func()}
    no.onclick = e => {document.body.removeChild(panel);}
    panel.appendChild(ok)
    panel.appendChild(no)
    panel.appendChild(txd)
    document.body.appendChild(panel);
}

function download(arr, fn){
    var blob = new Blob([arr]);
    var a = document.createElement("a")
    a.href = URL.createObjectURL(blob);
    a.download = fn;
    a.click();
}

function onDownloadBefore(){
    download(solved_before_arr, before_fn.value);
}
function onDownloadAfter(){
    download(solved_after_arr, after_fn.value);
}

function onBeforeFileInput(){
    before_file.files[0].arrayBuffer().then(arr=>{
        input_file_before_arr = arr;
    })
}
function onAfterFileInput(){
    after_file.files[0].arrayBuffer().then(arr=>{
        input_file_after_arr = arr;
    })
}

function getBnFunc(encoder){
    return function(){
        if(before_file.files.length===0) input_file_before_arr = string2array(before_text.value)
        if(after_file.files.length===0) input_file_after_arr = string2array(after_text.value)
        try{
            solved_before_arr = encoder.decode(array2string(input_file_after_arr)).buffer;
        }catch(e){
            myAlert("Error: decode fail.")
        }
        try{
            solved_after_arr = string2array(encoder.encode(new Uint8Array(input_file_before_arr)));
        }catch(e){
            myAlert("Error: encode fail.")
        }
        var todoEnc = true;
        var todoDec = true;
        if(before_show_text.checked && solved_before_arr.byteLength >= 2000){
            myAlert(`Decoded data length: ${solved_before_arr.byteLength} bytes\n, are you sure to show the entire data?`
                , ()=>{todoDec = false})
        }
        if(after_show_text.checked && solved_after_arr.byteLength >= 2000){
            myAlert(`Encoded data length: ${solved_after_arr.byteLength} bytes\n, are you sure to show the entire data?`
                , ()=>{todoEnc = false})
        }
        if(before_show_text.checked && todoDec){
            before_text.value = array2string(solved_before_arr)
        }
        if(after_show_text.checked && todoEnc){
            after_text.value = array2string(solved_after_arr)
        }
    }
}

before_file.addEventListener("input", onBeforeFileInput)
before_file.addEventListener("change", onBeforeFileInput)
after_file.addEventListener("input", onAfterFileInput)
after_file.addEventListener("change", onAfterFileInput)

base16_bn.addEventListener("click", getBnFunc(baseEncoding.base16));
base32_bn.addEventListener("click", getBnFunc(baseEncoding.base32));
base36_bn.addEventListener("click", getBnFunc(baseEncoding.base36));
base58_bn.addEventListener("click", getBnFunc(baseEncoding.base58));
base62_bn.addEventListener("click", getBnFunc(baseEncoding.base62));
base64_bn.addEventListener("click", getBnFunc(baseEncoding.base64));
base85_bn.addEventListener("click", getBnFunc(baseEncoding.base85));
base91_bn.addEventListener("click", getBnFunc(baseEncoding.base91));
base92_bn.addEventListener("click", getBnFunc(baseEncoding.base92));
base122_bn.addEventListener("click", getBnFunc(baseEncoding.base122));
base2048_bn.addEventListener("click", getBnFunc(baseEncoding.base2048));
base32768_bn.addEventListener("click", getBnFunc(baseEncoding.base32768));
base65536_bn.addEventListener("click", getBnFunc(baseEncoding.base65536));
base131072_bn.addEventListener("click", getBnFunc(baseEncoding.base131072));

before_dn.addEventListener("click", onDownloadBefore);
after_dn.addEventListener("click", onDownloadAfter);

document.querySelectorAll("td > a").forEach(a=>{a.href=a.innerText})
