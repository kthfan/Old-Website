
var res_pi_str="3.14",LambertW=gsl_sf_lambert_W0,res1,res2,done=0,timei,timeo;

function pi(n){

  var a_5=new Big("0.2"),
    a_2=new Big("1"),
    a_2=a_2.div(239);
  res1=new Big("0"),res2=new Big("0");
  n++;
  for(var i=0;i<n;i++){
    var a=(i<<1)+1;
    if(i%2){
      res1=res1.sub(a_5.pow(a).div(a));
      res2=res2.sub(a_2.pow(a).div(a));
    }else{
      res1=res1.add(a_5.pow(a).div(a));
      res2=res2.add(a_2.pow(a).div(a));
    }
  }
  res1=(res1.mul(4).sub(res2));
  done=1;
  return res1.mul(4).toString();
}
function remainder(n){
  var ln=Math.log
    ,b = (n<<1)+1
    ,res=(ln(16))-ln(b)+b*ln(0.2);
  return Math.abs(Math.ceil(res/ln(10)));
}
function DP2n(k){
  
  return Math.ceil(0.621334934559612*LambertW(25.7510065989456*10.0**k));
}
function master_do_pi(n){
    var myWorker = new Worker("worker.js");
    myWorker.onmessage = function(e) {
        console.log(e.data);
    }
    myWorker.postMessage(n);
}
