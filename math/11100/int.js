
var master_map = new Map();

workerState.run=function(data){
    if(data instanceof Map){
        var res = [...data.keys()].filter(x => master_map.has(x));
        if(res.length!==0){
            var k = res[0];
            var t = "1".repeat(master_map.get(k)), t2 = "1".repeat(data.get(k));
            workerState.sendback(Decimal.max(t, t2).sub(Decimal.min(t, t2)).toString());
        }else{
            workerState.sendback(null);
        }
        master_map = new Map([...master_map, ...data]);
    }else{
        workerState.sendback(data);
    }
    
}
