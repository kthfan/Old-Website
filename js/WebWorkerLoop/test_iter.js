
workerState.run=function(start, iter){
  iter += start;
  for(var i=start;i<iter;i++){
    if(!(i%1000)){
       workerState.sendback(i);
       console.log("In worker", i);
    }
  }
}

