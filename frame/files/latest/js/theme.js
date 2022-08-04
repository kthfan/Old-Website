//
;(function(window,document,LayerManager,PanelConfigure,Frame,Object,String,Array,Set,Map,undefined){
  if(!window.LayerManager){
    throw new Error("must include main.js first.");
  }
  var A=LayerManager._private,R=LayerManager._R(A)
    ,_DFPC=R[3],_CTM
    ,E=R[0],UD=R[6],ST=R[7],NUPC=R[10],ADATT=R[11],NE=R[12]
    ,ADE=R[13],RME=R[14],ODC=R[16],DFP=R[17]
    ,FNM=R[18],CSTE=R[19],LIST=R[20],APICO=R[21]
    ,event_js=Panel.prototype.addEventListener?1:0;
  /*
   * 
   * 
   */
  if(!event_js) console.warn('"event.js" is not included. Features that depend on "event.js" will not be available.');
  function E2(a){
    console.warn(`The item "${a}" that are not callable and whose constructor is not String are added to PanelStyleSet.`);
  }
  function PanelStyleSet(n,a){
    var P={N:ST(n),S:new Set(LIST(a,"v"))};
    DFP(this,{
      _P:{v:function(a){E(a);return P;}}
    });
  }
  DFP(PanelStyleSet.prototype,{
    add:{v:function(a){
      var s=this._P(A).S;
      s.add(a);
      if(!a.call&&!CSTE(a,String)) E2(a);
    }},addAll:{v:function(a){
      a=LIST(a,"v");
      if(!a) return false;
      var s=this._P(A).S,len=a.length;
      for(var i=0,b;i<len;i++){
        b=a[i];
        s.add(b);
        if(!b.call&&!CSTE(b,String)) E2(b);
      }
      return true;
    }},remove:{v:function(a){
      var s=this._P(A).S;
      s.delete(a);
    }},clear:{v:function(){
      this._P(A).S=new Set();
    }},contains:{v:function(a){
      return this._P(A).S.has(a);
    }},replace:{v:function(a,b){
      var s=this._P(A).S;
      if(!s.has(a)) return false;
      s.delete(a);
      s.add(b);
      if(!b.call&&!CSTE(b,String)) E2(b);
      return true;
    }},toggle:{v:function(a,b){
      if(b==true){this.add(a);return true;}
      if(b==false){this.remove(a);return false;}
      var s=this._P(A).S;
      if(s.has(a)){
        s.delete(a);
        return false;
      }
      s.add(a);
      if(!a.call&&!CSTE(a,String)) E2(a);
      return true;
    }},name:{g:function(){return this._P(A).N;}}
    ,getSet:{v:function(){return this._P(A).S;}}
  });
  function PanelStyles(a){
    var P={};
    DFP(this,{
      _P:{v:function(a){E(a);return P;}}
    });
    this.addAll(a);
  };
  (function(){
    var wns=Object.getOwnPropertyNames(FNM()),le1=wns.length
      ,tps=["Hover","Active","Fullscreen"],le2=tps.length
      ,f1=function(wt,ky){
        return {
          g:function(){
            return UD(this._P(A)[ky]);
          },s:function(a){
            if(!a) return;
            if(CSTE(a,PanelStyleSet)){
              this._P(A)[ky]=a;
              a._P(A).N=wt;
            }else this._P(A)[ky]=new PanelStyleSet(wt,a);
          }
        };
      },dfp={},fras=["fra-dft","fra-oce","fra-drk"]
      ,bsi=PanelConfigure.buttomStatusIcons,bsi2
      ,e3=function(T,a,k){
        if(!a) a=null; 
        else if(CSTE(a,String)){
          var img=document.createElement("img"),e=0;
          img.onerror=function(){e=1;throw new URIError("Invalid URI.");}
          img.src=a;
          a=img;
          if(e) return;
        }else if(!(a instanceof Image||CSTE(a,HTMLCanvasElement)))
          throw new TypeError("Should be image or canvas.");
        T._P(A)[k]=a;
      },bns=["restore","fullscreen","hide","exit"]
      ,wfr=new Set(["framerestorehover","framefullscreenhover","framehidehover","frameexithover"])
      ,fcrt=function(){return document.createElement("div");};
    function IconData(h,r,f,e,t){
      var P={H:null,R:null,F:null,E:null,T:null};
      DFP(this,{
        _P:{v:function(a){E(a);return P;}}
      });
      if(!h||!CSTE(h,Object)) h={hide:h,restore:r,fullscreen:f,exit:e,title:t};
      ADATT(this,h);
    }
    DFP(IconData.prototype,{
      hide:{
        g:function(){return this._P(A).H;}
        ,s:function(a){e3(this,a,"H");}
      },restore:{
        g:function(){return this._P(A).R;}
        ,s:function(a){e3(this,a,"R");}
      },fullscreen:{
        g:function(){return this._P(A).F;}
        ,s:function(a){e3(this,a,"F");}
      },exit:{
        g:function(){return this._P(A).E;}
        ,s:function(a){e3(this,a,"E");}
      },title:{
        g:function(){return this._P(A).T;}
        ,s:function(a){e3(this,a,"T");}
      },applyIcons:{v:function(f){
        APICO(f,this);
      }}
    });
    for(var i=0,wn;i<le1;i++){
      wn=wns[i];
      dfp[wn]=f1(wn,String.fromCharCode(i*(le2+1)));
      for(var j=0,wt;j<le2;j++){
        wt=wn+tps[j];
        dfp[wt]=f1(wt,String.fromCharCode(i*(le2+1)+1+j));
      }
    }
    dfp.addAll={v:function(a){
      var ls,c;
      a=LIST(a);
      if(!a) return false;
      c=a.length;
      for(var i=0,e,k,v,tm;i<c;i++){
        e=a[i],k=e.k,v=e.v;
        if(PanelStyles.prototype.hasOwnProperty(k)){
          tm=this[k];
          if(!tm) tm=new PanelStyleSet(),this[k]=tm;
          if(!tm.addAll(v)) tm.add(v);
        }
      }
      return true;
    }};
    DFP(PanelStyles.prototype,dfp);
    
    DFP(PanelConfigure,{
      buttomStatusIcons:{v:function(a,b){
        return new IconData(bsi(a,b));
      }},PanelStyles:{v:PanelStyles}
      ,PanelStyleSet:{v:PanelStyleSet}
      ,IconData:{v:IconData}
      ,EMPTY_THEME:{v:0}
      ,DEFAULT_THEME:{v:1}
      ,OCEAN_THEME:{v:2}
      ,DARK_THEME:{v:3}
    });
    bsi2=PanelConfigure.buttomStatusIcons;
    _CTM=[{m:new PanelStyles(),i:bsi2(),a:fcrt()}
        ,{m:null,i:bsi2("#000",0.8),a:fcrt()}
        ,{m:null,i:bsi2("#aaa",1.5),a:fcrt()}
        ,{m:null,i:bsi2("#ddd",0.8),a:fcrt()}];
    R[4]=_CTM;
    for(var i=0,i1=1,fra,ae;i1<_CTM.length;i++,i1++){
      fra=fras[i];
      ae=FNM(fra,fra+"d"
        ,fra+"b",fra+"c",fra+"t",fra+"w"
        ,fra+"s",fra+"s",fra+"s",[fra+"s",fra+"se"],fra+"st");
      ae.frameFullscreen=["fra-dsha","fra-ful"];
      for(var j=0;j<3;j++){
        ae[bns[j]+"Hover"]=fra+"sh";
        ae[bns[j]+"Active"]=fra+"sa";
      }
      ae[bns[3]+"Hover"]=fra+"seh";
      ae[bns[3]+"Active"]=fra+"sea";
      _CTM[i1].m=new PanelStyles(ae);
      _CTM[i1].a.classList.add(fra+"alt");
      _CTM[i1].a.classList.add("fra-alt");
    }
    _CTM[2].m.frame.add("fra-sha");
    DFP(PanelStyles.prototype,{applyStyles:{v:function(f,b){
      var P=this._P(A)
        ,fws=f.getElements()
        ,fpm=f._Q(A).M
        ,lsf=Object.getOwnPropertyNames(fws),len1=lsf.length
        ,funcs=[function(ad,re,f,fw,b){
          b=b?RME:ADE;
          b(fw,"mouseenter",ad);
          b(fw,"mouseleave",re);
        },function(ad,re,f,fw,b,fv){
          var ad2=function(e){
            ad(e);
            ADE(window,"mouseup",re2);
            ADE(window,"touchend",re2);
          },re2=function(e){
            re(e);
            RME(window,"mouseup",re2);
            RME(window,"touchend",re2);
          };
          if(b){
            RME(fw,"mousedown",ad2);
            RME(fw,"touchstart",ad2);
            RME(window,"mouseup",re2);
            RME(window,"touchend",re2);
          }else{
            ADE(fw,"mousedown",ad2);
            ADE(fw,"touchstart",ad2);
            fv.a=ad2,fv.r=re2;
          }
        },function(ad,re,f,fw,b){
          b=b?RME:ADE;
          b(f,"framefullscreen",ad);
          b(f,"framerestore",re);
        }];
      if(!fpm) fpm=new Map(),f._Q(A).M=fpm;
      for(var i=0,wn,fw,fms,ls2;i<len1;i++){
        ls2=[];
        wn=lsf[i];
        fw=fws[wn];
        fms=P[String.fromCharCode(i*(le2+1))];
        if(fms) fms=fms._P(A).S;
        else fms=[];
        
        fms.forEach(function(sty){
          if(sty.call&event_js){
            ls2.push(sty),ADE(f,wn,sty);
          }else if(CSTE(fw,Array)){
            fw.forEach(function(w){
              if(b) w.classList.remove(sty);
              else w.classList.add(sty);
            });
          }else{
            if(b) fw.classList.remove(sty);
            else fw.classList.add(sty);
          }
        });
        if(event_js){
          NE(wn,f,{element:fw,undo:b},{cancelable:0});
          ls2.forEach(function(fun){
            RME(f,wn,fun);
          });
          for(var j=0,wt,ky,fv,fvc,fvf;j<le2;j++){
            wt=("frame"+wn+tps[j]).toLowerCase();
            ky=String.fromCharCode(i*(le2+1)+1+j);
            
            fms=P[ky];
            if(fms) fms=fms.getSet();
            else continue;
            if(!fms.size) continue;
            fv=fpm.get(ky);
            if(fv){
              if(fv.n) RME(f,wt,fv.n),fv.n=null; //重設add class的function
              if(fv.r) {
                if(wfr.has(wt)) ADE(fw,"click",fv.r);//當fullscreen or restore
                funcs[j](fv.a,fv.r,f,fw,1),fv.r=null,fv.a=null;//重設ad, re
              }
            }
            if(b){
              if(!fv) continue;
              fvc=fv.c,fvf=fv.f;
              fms.forEach(function(sty){
                if(sty.call) RME(f,wt,sty),fvf.delete(sty);
                else fvc.delete(sty);
              });
            }else{
              if(!fv) fv={c:new Set(),f:new Set(),n:null,a:null,r:null},fpm.set(ky,fv);
              fvc=fv.c,fvf=fv.f;
              fms.forEach(function(sty){
                if(sty.call) ADE(f,wt,sty),fvf.add(sty);
                else fvc.add(sty);
              });
              (function(fvc,f,wt,fw,nfun){
                if(CSTE(fw,Array)){
                  nfun=function(e){
                    fvc.forEach(function(cls){
                      fw.forEach(function(w){
                        if(e.undo) w.classList.remove(cls);
                        else w.classList.add(cls);
                      });
                    });
                  }
                }else{
                  nfun=function(e){
                    fvc.forEach(function(cls){
                      if(e.undo) fw.classList.remove(cls);
                      else fw.classList.add(cls);
                    });
                  }
                }
                if(fvc.size) ADE(f,wt,nfun),fv.n=nfun;
                function ad(){
                  NE(wt,f,{element:fw,undo:false},{cancelable:0});
                }
                function re(){
                  NE(wt,f,{element:fw,undo:true},{cancelable:0});
                }
                fv.a=ad,fv.r=re,funcs[j](ad,re,f,fw,0,fv);
                if(wfr.has(wt)) ADE(fw,"click",re);//當fullscreen or restore
              })(fvc,f,wt,fw);
            }
          }
        }
      }
    }}});
  })();
  
  DFP(PanelConfigure.prototype,{
    applyStyles:{v:function(frame,remove){
      this.panelStyles.applyStyles(frame,remove);
    }},applyIcons:{v:function(frame){
      this.iconData.applyIcons(frame);
    }},setIconData:{v:function(h,r,f,e){
      var ico=PanelConfigure.IconData;
      if(!CSTE(h,ico)) h=new ico(h,r,f,e);
      else this._P(A).I=h;
    }},iconData:{
      g:function(){return NUPC(this,"I");}
      ,s:function(a){
        if(!a) {
          this._P(A).I=null;
          return;
        }else this.setIconData(a);
      }
    },theme:{
      g:function(){return NUPC(this,"M");}
      ,s:function(a){
        var P=this._P(A),c;
        a=parseInt(a);
        if(isNaN(a)||a>=_CTM.length||a<0){
          //console.warn("Theme is a Integer, a suitable theme can be found in PanelConfigure.");
          return;
        }
        c=_CTM[a];
        P.M=a;
        P.L=c.m;
        this.iconData=c.i;
        if("alternativeFrame" in PanelConfigure.prototype)
          P.A=c.a;
      }
    },panelStyles:{
      g:function(){return NUPC(this,"L");}
      ,s:function(a){
        if(!a) this._P(A).L=null;
        else if(CSTE(a,PanelStyles)) this._P(A).L=a;
        else a=new PanelStyles(a),this._P(A).L=a;
      }
    }
  });
  
  DFP(Frame.prototype,{
    iconData:{
      g:function(){
        var S=this._Q(A).S;
        return new IconData(S.h,S.r,S.f,S.e,S.t);
      },s:function(a){
        new PanelConfigure.IconData(a).applyIcons(this);
      }
    },theme:{
      g:function(){
        console.error("This is set-only property.");
      },s:function(a){
        var pc=new PanelConfigure();
        pc.theme=a;
        pc.applyStyles(this);
      }
    },panelStyles:{
      g:function(){
        console.error("This is set-only property.");
      },s:function(a){
        if(!a) return;
        else if(!CSTE(a,PanelStyles)) a=new PanelStyles(a);
        a.applyStyles(this);
      }
    }
  });
  _DFPC.theme=1;
})(window,document,LayerManager,PanelConfigure,Frame,Object,String,Array,Set,Map);



//