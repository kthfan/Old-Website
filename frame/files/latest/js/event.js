//
;(function(window,LayerManager,PanelConfigure,PanelManager,Panel,Object,Map,undefined){
  if(!LayerManager){
    throw new Error("must include main.js first.");
  }
  var A=LayerManager._private,R=LayerManager._R(A)
    ,E=R[0],UD=R[6],ADE=R[13],RME=R[14]
    ,ODC=R[16],DFP=R[17],LIST=R[20];
  /*
  *  PanelManager的EventFunctions儲存在PanelConfigure
  *  ，Panel則是本身的成員，代號是E，格式：
  *    {
  *      o(on):{(key):func,...}
  *      ,a(add):{(key):[{f:func,o:options},...]...}
  *    }
  *  
  */
  /*   E ver 2
  *    {
  *      o(on):{Map(key,func)}
  *      ,a(add):{Map(key,{Map(func,option)})}
  *    }
  *  
  */
  function _fHad(map,lis,opt){
    var d1,d2;
    if(map.has(lis)){
      d1=map.get(lis);
      if(d1 instanceof Object) d1=d1.capture;
      d2=opt;
      if(d2 instanceof Object) d2=d2.capture;
      if((d1==true&&d2==true)||(d1!=true&&d2!=true)) return 1;
    }
    return 0;
  }
  DFP(PanelConfigure.prototype,{
    dispatchEvent:{v:function(e){
      var fs=this._P(A).E,pd=false,del=[];
      if(!fs) return;
      fs=fs.a;
      if(!fs) return;
      fs=fs.get(e.type);
      if(!fs) return;
      fs.forEach(function(func,opt){
        func(e);
        if(opt instanceof Object){
          if(opt.passive==true){
            if(e.defaultPrevented) console.warn(`Ignore the 「preventDefault()」 call from the listener registered as 「passive」 to the 「${e.type}」 type event.`);
            return;
          }else if(opt.once==true){
            del.push(func);
          }
        }
        if(e.defaultPrevented&&!pd) pd=true;
      });
      del.forEach(function(func){
        fs.delete(func);
      });
      return !pd;
    }},addEventListener:{v:function(type,listener,options){
      if(!listener.call) return;
      var P=this._P(A),fs=P.E,f,d1,d2;
      if(!fs) fs={},P.E=fs;
      if(!fs.a) fs.a=new Map();
      fs=fs.a;
      f=fs.get(type);
      if(!f) f=new Map(),fs.set(type,f);
      if(_fHad(f,listener,options)) return;
      f.set(listener,options);
    }},removeEventListener:{v:function(type,listener,options){
      var P=this._P(A),fs=P.E,f;
      if(!fs) return;
      fs=fs.a;
      if(!fs) return;
      f=fs.get(type);
      if(!f) return;
      if(_fHad(f,listener,options)) f.delete(listener);
    }},applyEvents:{v:function(f,r){
      var P=this._P(A),fs=P.E;
      if(!fs) return;
      fs=fs.a;
      if(!fs) return;
      fs.forEach(function(mp,ty){
        mp.forEach(function(opt,func){
          if(r) f.removeEventListener(ty,func,opt);
          else f.addEventListener(ty,func,opt);
        });
      });
      f._P(A).E={o:new Map(LIST(P.E.o,"kv"))};
    }}
  });
  DFP(PanelManager.prototype,{
    dispatchEvent:{v:function(e){
      this._P(A).C.dispatchEvent(e);
    }},addEventListener:{v:function(a,b,c){
      this._P(A).C.addEventListener(a,b,c);
    }},removeEventListener:{v:function(a,b,c){
      this._P(A).C.removeEventListener(a,b,c);
    }}
  });
  DFP(Panel.prototype,{
    dispatchEvent:{v:function(e){
      this._P(A).F.dispatchEvent(e);
    }},addEventListener:{v:function(a,b,c){
      this._P(A).F.addEventListener(a,b,c);
    }},removeEventListener:{v:function(a,b,c){
      this._P(A).F.removeEventListener(a,b,c);
    }}
  });
  
  (function(){
    var ls=["beforecreate","aftercreate","remove","show","hide"
      ,"focus","blur","drag","resize","fullscreen","restore","setrect"]
      ,o1={},o2={},c=ls.length;
    for(var i=0,k,v1,v2,t1,t2,s;i<c;i++){
      k=ls[i],v1="on"+k,v2="onframe"+k;
      s="frame"+k;
      (function(i,s,v1){
        t1={g:function(){
          var P=this._P(A),fs=P.E;
          if(!fs) return null;
          fs=fs.o;
          if(!fs) return null;
          return fs[i];
        },s:function(a){
          var P=this._P(A),fs=P.E,f;
          if(!fs) fs={},P.E=fs;
          if(!fs.o) fs.o={};
          fs=fs.o;
          f=fs[i];
          if(f&&f.call){
            RME(this,s,f);
          }
          if(a&&a.call){
            f=function(e){a(e)};
            fs[i]=f;
            ADE(this,s,f);
          }else fs[i]=a;
        }};
        t2={g:function(){
          return this._P(A).C[v1];
        },s:function(a){
          this._P(A).C[v1]=a;
        }};
      })(i,s,v1);
      o1[v1]=t1;
      o1[v2]=t1;
      o2[v1]=t2;
      o2[v2]=t2;
    }
    DFP(PanelConfigure.prototype,o1);
    DFP(Panel.prototype,o1);
    DFP(PanelManager.prototype,o2);
    
  })();
  
})(window,LayerManager,PanelConfigure,PanelManager,Panel,Object,Map);
//