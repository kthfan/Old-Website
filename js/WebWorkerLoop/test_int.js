date = new Date();
workerState.run=function(data){
  console.log("In integrate_worker", data, new Date()-date);
  workerState.sendback( new Date()-date);
  date = new Date();
  
}

