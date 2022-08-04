
var div_mod = function(a,b){
 return [Math.floor(a/b),a%b];
}
var repeat11 = function(n){
 var res = "";
 for(var i=0;i<n;i++){
  res+="1";
 }
 return res;
}
var get110mul = function(n,begin,len){
 Decimal.precision = parseInt(n)+1;
 n = Decimal(n);
 var m = new Map();
 var n1 = n+1;
 var os = "";
 for(var i=1;i<=n1;i++){
  var t = Decimal(os+="1");
  var tm = t.mod(n);
  var ts = tm.toString();
  if(m.has(ts)){
     var t2 = Decimal("1".repeat(m.get(ts)));
     return  Decimal.max(t, t2).sub(Decimal.min(t, t2));//String(m1.sub(n1));
  }
  m.set(ts,i);
 }
 return null;
}
var test110 = function(n){
 for(var i=1;i<=n;i++){
  if(get110mul(i)%i !==0 ) return i;
 }
}