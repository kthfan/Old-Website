
workerState.run = function(s, iter){
    n = workerState.dataQueue.pop();
    Decimal.precision = parseInt(n)+1;
    n = Decimal(n);
    var m = new Map();
    var n1 = s + iter;
    s++;
    var os = "1".repeat(s-1);
    //console.log(s,n1);
    for(var i=s;i<=n1;i++){
        var t = Decimal(os+="1");
        var tm = t.mod(n);
        var ts = tm.toString();
        if(m.has(ts)){
            var t2 = Decimal("1".repeat(m.get(ts)));
            workerState.sendback(Decimal.max(t, t2).sub(Decimal.min(t, t2)).toString());
            return;
        }
        m.set(ts,i);
        if(!(i%100)){
            if(workerState.terminated) return;
            workerState.sendback(m);
            m = new Map();
        } 
    }
    workerState.sendback(m);
}