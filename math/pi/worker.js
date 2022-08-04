importScripts('lambertw.js','pi.js', 'big.js');
function get_res4pi(res1,res2,k){
  res1=(res1.mul(4).sub(res2));
  return res1.mul(4).toString().substr(0,k+2);
}
function post_pi(pi_str){
  postMessage(pi_str);
}

function worker_pi(k){
  Big.DP=k+2;
  var a_5=new Big("0.2"),
    a_2=new Big("1"),
    a_2=a_2.div(239),
    n=DP2n(k)+1;
  res1=new Big("0"),res2=new Big("0");
  
  for(var i=0;i<n;i++){
    var a=(i<<1)+1,to_post=!(i%2);
    
    if(i%2){
      res1=res1.sub(a_5.pow(a).div(a));
      res2=res2.sub(a_2.pow(a).div(a));
    }else{
      res1=res1.add(a_5.pow(a).div(a));
      res2=res2.add(a_2.pow(a).div(a));
    }
    //if(to_post){
      post_pi(get_res4pi(res1,res2,k)+" "+i);
    //}
  }
  post_pi(get_res4pi(res1,res2,k));
  post_pi("end");
}

onmessage = function(e) {
  //postMessage(pi(e.data[0]));
  worker_pi(e.data[0]);
}

