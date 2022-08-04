//

var BlankEval;
(function(){
  var T,A,B=document.getElementsByTagName("body")[0]
    ,C,D,F,G,H,I,J,K,L,M,N,O={},P,Q,R,S;
  //T:this; A:arguments; B:body; C:frameQueue; D:queueSize;
  //F:cmds; G:script; H:chked; I:mainScript; J:idCount;
  //K:mainFrame; L:lastObj; M:lastRes; N:frameMap; O:funcs;
  //P:frameIdName; Q:threadPool; R:dectFunc; S:chkTime;
  function TP(){
    this.c=2;
    this.p={0:null,1:null};
    this.w={0:null,1:null};
    this.q={};
  }
  TP.prototype={
    add:function(f,k){
      var e=k==undefined?Object.keys(this.w):k;
      e==undefined?e=this.c++:delete this.w[e];
      return e;
    },exe:function(k,b){
       var f=this.p[k];
       b?setTimeout(f,0):f();
    },rc:function(k){
      this.p[k]=null;
      this.w[k]=null;
    },thd:function(n){
      this.q[n]=[[],0];
    },run:function(n,b){
      var e=this.q[n],q;
      e&&(q=e[0],q.length)&&
        (e[1]=1,b?setTimeout(q[0],0):q[0]());
    },push:function(n,f){
      var e=this.q[n],q;
      e&&(q=e[0],q.push(function(){
        (q.shift(),f(),e[1])&&q[0]&&q[0]();
      }));
    },stop:function(n){
      var e=this.q[n];
      e&&(e[1]=0);
    }
  }
  function _mfr(){
    K.id=P;
    N[K.id]=K;
    K.src="about:blank";
    K.style.display="none";
    B.appendChild(K);
    var d=K.contentDocument,s=d.createElement("script");
    s.innerHTML=I;
    d.getElementsByTagName("body")[0].appendChild(s);
  }
  BlankEval=function(){
    T=this,A=arguments,C=[],D=2,F=[],H=1,J=0
    ,K=document.createElement("iframe"),L={0:null},N={}
    ,P=A[0]?A[0]:"MF",Q=new TP(),R=1,S=0;
    Q.thd("eg");
    T.oncmd=function(){};
    T.ontab=function(){};
    _mfr();
    for(var i=0;i<D;i++) T.enlarge();
    Object.defineProperties(T,{frameQueue:{get:()=>C},cmds:{get:()=>F,set:(a)=>F=a},lastObj:{get:()=>L},lastRes:{get:()=>M},frameMap:{get:()=>N},chkTime:{get:()=>S}});
  }
  function _renew(f){
    console.log("renew:"+f.id+" id");
    var d=f.contentDocument,s=d.createElement("script");
    s.innerHTML=I;
    d.getElementsByTagName("body")[0].appendChild(s);
    _post(f,"chk",F);
  }
  function _tab(p,t){
    var o=null,c,i=p-1,a={"\"":"\"","\'":"\'"
        ,"\`":"\`",")":"(","]":"[","}":"{"},f,b,s=0;
    if(t[i]=="[") s=1,o=i,i--;
    while(i>=0){
      if(R&&(c=a[t[i]])){
        while(i-->=0&&t[i]!=c);
        i--;continue;
      }
      if(o==null&&t[i]==".") o=i;
      if(!/[a-zA-Z0-9_.]/.test(t[i])){i++;break;}
      i--;
    }
    o==null?(f=t.substring(0,i),b=t.substring(p)
      ,c=t.substring(i,p),o="window")
      :(f=t.substring(0,o+1),b=t.substring(p)
      ,c=t.substring(o+1,p),o=t.substring(i,o));
    if(s){
      f+='"';
      if(b.substring(0,1)==']') b='"'+b;
      else if(b.substring(0,2)!='"]') b='"]'+b;
      c=c.substring(0,c.length-1);
    }
    return {0:[o,c],1:[f,b]};
  }
  function _match(c,m,p){
    var s=c.length,r=[],f=p[0],b=p[1];
    if(b.substring(0,2)=='"]'&&f.substring(f.length-1)=='"'){
      for(var q in m){
        if(q.substring(0,s)==c) r.push(q);
      }
    }else{
      for(var q in m){
        if(isNaN(parseInt(q))
          &&q.substring(0,s)==c) r.push(q);
      }
    }
    
    T.ontab(r,p);
  }
  function _post(f,k,o){
    f.contentWindow.postMessage({0:O[k](f,o)},"*");
  }
  function _rebuild(o){
    if(D-C.length>0){
      for(var i=C.length;i<D;i++) T.enlarge(),alert(C.length);
    Q.push("eg",function(){_rebuild(o);})
    return;
    }
    var r=C.shift(),f=C[0];
    !(r&&f)&&Q.push("eg",function(){_rebuild(o);});
    L=o[0];
    _post(f,"tab",[L[0],o[1]]);
    r.contentWindow.location.reload();
    setTimeout(function(){_renew(r)},0);
    H=1;
  }
  BlankEval.prototype={
    enlarge:function(){
      console.log("enlarge:"+C.length);
      var f=document.createElement("iframe");
      f.id=P+J++;
      N[f.id]=f;
      f.style.display="none";
      B.appendChild(f);
      _renew(f);
    }
    ,search:function(p,t){
      console.log("search:"+t);
      var b,f,w,o=_tab(p,t);
      if(o[0][0]==L[0]&&H) _match(o[0][1],M,o[1]);
      else _rebuild(o);
    }
    ,cmd:function(a){
      H=0;
      a=JSON.stringify(a);
      F.push(a);
      console.log("cmd:"+F.length);
      _post(K,"cmd",a);
      for(var i in C)
        _post(C[i],"syc",a);
    }
    ,receive:function(e){
      var o=e.data,w=e.source,f=N[o[1]];
      if(w.location!="about:blank")return;
      console.log("receive:"+o[0]);
      switch(o[0]){
        case "chk":
          if(F.length>o[2]){
            _post(f,"chk",F.slice(o[2]));
            return;
          }
          if(S!=="S"&&(new Date().getTime()-S)>100) S="S";
          C.push(f);
          Q.run("eg");
          break;
        case "tab":
          M=o[2];
          _match(L[1],M,o[3]);
          break;
        case "cmd":
          T.oncmd(o[2]);
          break;
      }
    }
  }
  I=`window.addEventListener("message",function(){
    if(event.source.location!="${location}")return;
    eval(event.data[0]);
  },false);`;
  O["cmd"]=function(f,o){
    return `
      delete event.data[0];
      try{
        event.source.postMessage
          (["cmd","${f.id}",String(eval(${o}))],"*");}
      catch(e){
        event.source.postMessage(
          ["cmd","${f.id}",String(e)
          +" ,in "+e.lineNumber+":"+e.columnNumber],"*");
    }
    `;
  };
  O["syc"]=function(f,o){
    return "delete event.data[0];try{eval("+o+");}catch(e){}";
  };
  O["tab"]=function(f,o){
    return `
      delete event.data[0];
      var O=(function(){
        try{return eval(${JSON.stringify(o[0])});}
        catch(e){}
        return;
      })(),t={},L;
      if(!(O==undefined||O==null)){
        while(O!=null){
          L=Object.getOwnPropertyNames(O);
          for(var Q in L) t[L[Q]]=null;
          for(var Q in O) t[Q]=null;
          O=Object.getPrototypeOf(O);
        }
      }
      event.source.postMessage
        (["tab","${f.id}",t,${JSON.stringify(o[1])}],"*");
    `;
  };
  O["chk"]=function(f,o){
    var s="delete event.data[0];";
    if(S!=="S") S=new Date().getTime();
    for(var i in o){
      s+=`try{eval(${o[i]});}catch(e){};`;
    }
    s+=`event.source.postMessage(["chk"
      ,"${f.id}",${o.length}],"*");`;
    if(S==="S")s="setTimeout(function(event){"+s+"},0,event);";
    return s;
  };
    //for(var i in event.data[2]){
      //  try{eval(event.data[2][i]);}catch(e){};
      //}
})();

//