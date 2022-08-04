//

/**
 * _FEVT={
 *   l:{x,y,w,h,b:相對於screen的x,c:相對於screen的y}
 *   ,i:varSetRect
 *   ,s:start_change_by_mouse
 *   ,e:end_change_by_mouse
 *   ,g:get_frame_and_setRect
 *   ,h:{
 *     e:fake_frame_when_contentHide
 *     ,f:flag
 *   }
 *   ,a:whenAdevt
 *   ,f:whenFullscreen
 *   ,r:whenRestore
 *   ,t:on_inset_for_change_of_title
 * }
 * Frame.P.E={
 *   f:dblclick_fullscreen_or_restore
 *   ,d:mousedown_drag_resize
 *   ,r:drag_move_or_up_to_restore
 *   ,p(mousemove_for_resize_pointer(for remove)):{
 *     d:down
 *     ,o:over
 *     ,l:out
 *   }
 * }
 * Frame.P.G={
 *   f:{
 *     0:contentHide
 *     ,1:fullscreen
 *     ,2:hide
 *     ,3:left bound
 *     ,4:top bound
 *     ,5:right bound
 *     ,6:bottom bound
 *     ,7:widget resize by setRect
 *   },m:{
 *     w:max width
 *     ,h:max height
 *   },n:{
 *     w:min width
 *     ,h:min height
 *   },t(title_length):{
 *     ,p:proper_min_width
 *     ,w:width_of_per_word
 *   }
 * }
 */
//dblclick fullscreen and restore
//drag move when fullscreen
//over bound
//strict bound
//hide context when drag and resize
//min width and height
//max width and height
(function(window,document,LayerManager,PanelManager,PanelConfigure,Frame,undefined){
  //frame state:[,content hide,fullscreen drag,hide,fullscreen]
  var headDragStart,headDragging,headDragEnd;
  var A=LayerManager._private,R=LayerManager._R(A)
    ,_FEVT=R[2],_DFPC=R[3],NUM=R[8],NUPC=R[10],NE=R[12]
    ,ADE=R[13],RME=R[14],THPOS=R[15],ODC=R[16],DFP=R[17]
    ,_hf={e:document.createElement("div"),f:0}
    ,_cancel_pevt=true,_canceled=0;
  _FEVT.h=_hf;
  _hf.e.classList.add("fra-alt");
  _hf.e.style.border="solid";
  _hf.e.style.borderWidth=5;
  _FEVT.g=function(T){
    var x,y,w,h,pf,sty;
    if(_hf.f){
      pf=T.alternativeFrame,!pf&&(pf=_hf.e)
        sty=pf.style,x=parseFloat(sty.left)
        ,y=parseFloat(sty.top),w=parseFloat(sty.width)
        ,h=parseFloat(sty.height);
    }else{
      pf=T.frame,x=T.X,y=T.Y,w=T.width,h=T.height;
    }
    return {f:pf,x:x,y:y,w:w,h:h};
  }
  _FEVT.s=function(T,hor,ver){
    if(_cancel_pevt) cancel_all_pointerEvent(1),_canceled=1;
    
    if(hor!=null&&ver!=null){
      var n;
      if(hor===null) n="s-resize";
      else if(ver===null) n="w-resize";
      else if(hor===ver) n="nw-resize";
      else n="ne-resize";
      document.body.style.cursor=n;
    }
  }
  _FEVT.e=function(T){
    if(_hf.f){
      contentHideEnd(T);
    }
    if(_canceled) cancel_all_pointerEvent();
    
    document.body.style.cursor="auto";
  }
  _FEVT.i=function(T,x,y,w,h,f,hor,ver){
    var Q=T._Q(A),G=_notG(Q),flags=G.f,p,nw,nh
      ,pfrt=_FEVT.g(T)
      ,rx=pfrt.x,ry=pfrt.y,rw=pfrt.w,rh=pfrt.h
      ,lx=x===null?rx:x,ly=y===null?ry:y
      ,lw=w===null?rw:w,lh=h===null?rh:h;
    //left bound
    if((flags&0b1000)&&x!==null&&x<0){
      if(w!==null) w=rx+rw, lw = w;
      x=0;
    }
    
    //top bound
    if((flags&0b10000)&&y!==null&&y<0){
      if(h!==null) h=ry+rh, lh = h;
      y=0;
    }
    
    p=Q.F.parentNode;
    nw=p.offsetWidth;
    nh=p.offsetHeight;
    //right bound
    if((flags&0b100000)&&x!==null&&x+lw>nw){
      
      if(hor) w=nw-x,x=null;
      else x=nw-lw,w=null;
    }
    //bottom bound
    if((flags&0b1000000)&&y!==null&&y+lh>nh){
      if(ver) h=nh-y,y=null;
      else y=nh-lh,h=null;
    }
    
    //max size
    p=G.m;
    if(p){
      nw=p.w,nh=p.h;
      if(nw!=null&&w>nw){
        if(hor===0) x=rx+rw-nw;
        w=nw;
      }
      if(nh!=null&&h>nh){
        if(ver===0) y=ry+rh-nh;
        h=nh;
      }
    }
    //min size
    p=G.n;
    if(!p) p={};
    nw=p.w,nh=p.h;
    if(nw==null) nw=get_proper_min_width(T);
    if(nh==null) nh=get_proper_min_height(T);
    if(w!==null&&w<nw){
      if(hor===0) x=rx+rw-nw;
      w=nw;
    }
    if(h!==null&&h<nh){
      if(ver===0) y=ry+rh-nh;
      h=nh;
    }
    
    if(f){
      if(_hf.f||(_notG(T._Q(A)).f&0b1)){
        contentHideSetRect(T,x,y,w,h);
      }else{
        T.setRect(x,y,w,h);
      }
    }else return {x:x,y:y,w:w,h:h};
  }
  _FEVT.t=function(T,w,h,ew,eh){
    var Q=T._Q(A),text=Q.T.title,t=_notG(Q).t
      ,pw,ww,len=text.length;
    !t&&(check_title_length(T,text),t=_notG(Q).t);
    pw=t.p,ww=t.w;
    if(pw>w&&text!==""){
      pw=parseInt((pw-w)/ww);
      if(len-pw<3) text="";
      else text=text.substr(0,len-pw-3)+"...";
    }
    Q.T.innerText=text;
    
    //順便幫設定widgetResize
    if(T.widgetResize){
      ww=T.widget.style,pw=T.widget.parentNode;
      ww.width=ew;
      ww.height=eh;
    }
    
  }
  function get_proper_min_width(T){
    var Q=T._Q(A),i=Q.S.t,h=Q.S.h
      ,r=T.isFullscreen?Q.S.r:Q.S.e,e=Q.S.e
      ,gw=function(e){return e.offsetWidth;};
    return T.width-Q.D.offsetWidth+gw(i)+gw(h)+gw(r)+gw(e);
  }
  function get_proper_min_height(T){
    var Q=T._Q(A);
    return T.height-Q.B.offsetHeight+Q.D.offsetHeight;
  }
  function check_title_length(T,text){
    var Q=T._Q(A),testele=document.createElement("span")
      ,sty=testele.style,resw,pw,ww
      ,gw=function(e){return e.offsetWidth;};
    testele.innerText=text;
    testele.className=Q.T.className;
    testele.classList.add("fra-tstt");
    sty.left=Q.T.style.left;
    sty.top=Q.T.style.top;
    Q.D.appendChild(testele);
    resw=testele.offsetWidth;
    Q.D.removeChild(testele);
    testele.className="";
    testele.innerText="";
    pw=get_proper_min_width(T)+resw;
    ww=resw/text.length;
    _notG(Q).t={w:ww,p:pw};
  }
  function cancel_all_pointerEvent(a){
    var n=a?"none":"auto",f1=function(tag){
      var ls=Array.from(document.getElementsByTagName(tag))
        ,len=ls.length;
      for(var j=0;j<len;j++) ls[j].style.pointerEvents=n;
    }
    f1("iframe"),f1("object"),f1("embed");
  }
  
  //dblclick fullscreen and restore
  function dbl2full(T){
    T.fullscreen();
  }
  function dbl2re(T){
    T.restore();
  }
  //drag move when fullscreen
  function md4dgfull(T){
    var Q=T._Q(A),pos=THPOS(T.frame.parentNode),pl=T._P(A).L
      ,w=pl.w,h=pl.h,x=-w/2-pos[0],y=-Q.D.offsetHeight/2-pos[1]
      ,pe=Q.E,dm=function(e){
        mm4dgfull(T,e);
      };
    _FEVT.l={x:x,y:y,w:w,h:h};
    if(!pe.r){
      ADE(window,"mousemove",dm);
      ADE(window,"touchmove",dm);
      pe.r=dm;
    }
  }
  function mm4dgfull(T,e){
    e=e.type=="touchmove"?e.targetTouches[0]:e;
    var Q=T._Q(A),flags=_notG(Q).f
      ,ins=_FEVT.l,pe=T._Q(A).E,du=function(){
        mu4dgfull(T);
      },pf=_FEVT.g(T).f,af,x,y,w=ins.w,h=ins.h;
    pf.style.width=w,pf.style.height=h;
    af=_FEVT.i(T,ins.x+e.clientX,ins.y+e.clientY,w,h)
      ,x=af.x,y=af.y,w=af.w,h=af.h;
    RME(window,"touchmove",pe.r);
    RME(window,"mousemove",pe.r);
    
    if(flags&0b1){
      ADE(window,"touchend",du);
      ADE(window,"mouseup",du);
      pe.r=du;
      contentHideSetRect(T,x,y,w,h);
    }else{
      T.restore(x,y,w,h);
      delete pe.r;
    }
  }
  function mu4dgfull(T){
    var ins=_FEVT.g(T),pe=T._Q(A).E;
    RME(window,"touchend",pe.r);
    RME(window,"mouseup",pe.r);
    delete pe.r;
    T.restore(ins.x,ins.y,ins.w,ins.h);
  }
  //over bound
  function bound(x,y){
    return {x:x,y:y};
  }
  //strict bound
  function strictBound(x,y,w,h){
    var pos=bound(x,y),x=pos.x,y=pos.y;
    return {x:x,y:y,w:w,h:h};
  }
  //hide context when drag and resize
  function contentHideSetRect(T,x,y,w,h){
    var pf=T.alternativeFrame;
    !pf&&(pf=_hf.e);
    if(!_hf.f){
      contentHideStart(T);
    }
    if(x!==null) pf.style.left=x;
    if(y!==null) pf.style.top=y;
    if(w!==null) pf.style.width=w;
    if(h!==null) pf.style.height=h;
  }
  function contentHideStart(T){
    var f=T.frame,pf=T.alternativeFrame;
    !pf&&(pf=_hf.e);
    _hf.f=1;
    contentHideSetRect(T,T.X,T.Y,T.width,T.height);
    pf.style.zIndex=T.manager.upperZ+1;
    if(f.parentNode) f.parentNode.appendChild(pf);
  }
  function contentHideEnd(T){
    var f=T.frame
      ,pf=T.alternativeFrame,mvfs;
    !pf&&(pf=_hf.e);
    mvfs=pf.style;
    T.setRect(parseFloat(mvfs.left),parseFloat(mvfs.top)
      ,parseFloat(mvfs.width),parseFloat(mvfs.height));
    _hf.f=0;
    if(f.parentNode) f.parentNode.removeChild(pf);
    mvfs.width=0;
    mvfs.height=0;
  }
  //min width and height
  //max width and height
  _FEVT.a=function(T){
    _FEVT.r(T);
  }
  _FEVT.f=function(T){
    //dblclick
    var P=T._Q(A),pe=P.E,dbl=function(){
      dbl2re(T);
    },drgdn=function(){
      md4dgfull(T);
    };
    RME(P.D,"dblclick",pe.f);
    ADE(P.D,"dblclick",dbl);
    RMDBT(P.D,pe.f);
    ADDBT(P.D,dbl);
    
    pe.f=dbl;
    //drag move
    ADE(P.D,"mousedown",drgdn);
    ADE(P.D,"touchstart",drgdn);
    pe.d=drgdn;
    _notG(P).f|=0b10;
  }
  _FEVT.r=function(T){
    var P=T._Q(A),pe=P.E,dbl=function(){
      dbl2full(T);
    };
    //dblclick
    RME(P.D,"dblclick",pe.f);
    ADE(P.D,"dblclick",dbl);
    RMDBT(P.D,pe.f);
    ADDBT(P.D,dbl);
    
    pe.f=dbl;
    
    //drag move
    RME(window,"touchmove",pe.r);
    RME(window,"mousemove",pe.r);
    RME(P.D,"mousedown",pe.d);
    RME(P.D,"touchstart",pe.d);
    delete pe.r;
    delete pe.d;
    _notG(P).f&=~0b10;
  }
  function _notG(P){
    if(!P.G) P.G={f:0b1111000};
    return P.G;
  }
  function _notGC(T){
    var P=T._P(A);
    if(!P.G) P.G=ODC(NUPC(T,"G"));
    return P.G;
  }
  function _gG(G,m,w){
    var m=G[m];
    if(m==null||m[w]==null) return null;
    else return m[w];
  }
  function _sG(G,m,w,val,T){
    if(!G[m]) G[m]={};
    if(!val&&val!==0){
      delete G[m][w];
    }else{
      if(T){
        var min=w==="w"?get_proper_min_width(T):get_proper_min_height(T);
        if(val<min) console.warn("Setting a value that is too small may cause unexpected results. The proper minimum value is "+min);
      }
      G[m][w]=NUM(val);
    }
  }
  
  function _mdgGfg(P,adr,gfunc){
    if(gfunc) gfunc=function(T){return NUPC(T,P);};
    else gfunc=function(T){return _notG(T[P](A));};
    return function(){
      if((gfunc(this).f&adr)===adr) return true;
      else return false;
    }
  }
  function _mdsGfg(P,adr,gfunc){
    if(gfunc) gfunc=function(T){return _notGC(T);};
    else gfunc=function(T){return _notG(T[P](A));};
    return function(a){
      var G=gfunc(this);
      if(a==true) G.f|=adr;
      if(a==false) G.f&=~adr;
    }
  }
  ;(function(){
    var pronames=["hideContent","isFullscreen","isHide"
        ,"leftBound","topBound","rightBound","bottomBound","widgetResize"]
      ,len=pronames.length,fras={},pcs={},noget={1:0,2:0};
    for(var i=0,adr,pn;i<len;i++){
      adr=1<<i,pn=pronames[i];
      fras[pn]={g:_mdgGfg("_Q",adr)};
      if(!noget.hasOwnProperty(i)){
        fras[pn].s=_mdsGfg("_Q",adr);
      };
      pcs[pn]={
        g:_mdgGfg("G",adr,1)
        ,s:_mdsGfg(null,adr,1)
      };
    }
    fras["bound"]={
      g:_mdgGfg("_Q",0b1111000)
      ,s:_mdsGfg("_Q",0b1111000)
    };
    pcs["bound"]={
      g:_mdgGfg("G",0b1111000,1)
      ,s:_mdsGfg(null,0b1111000,1)
    };
    DFP(Frame.prototype,fras);
    DFP(PanelConfigure.prototype,pcs);
  })();
  DFP(Frame.prototype,{
    maxWidth:{
      g:function(){
        return _gG(_notG(this._Q(A)),"m","w");
      },s:function(a){
        _sG(_notG(this._Q(A)),"m","w",a,this);
      }
    },maxHeight:{
      g:function(){
        return _gG(_notG(this._Q(A)),"m","h");
      },s:function(a){
        _sG(_notG(this._Q(A)),"m","h",a,this);
      }
    },minWidth:{
      g:function(){
        return _gG(_notG(this._Q(A)),"n","w");
      },s:function(a){
        _sG(_notG(this._Q(A)),"n","w",a,this);
      }
    },minHeight:{
      g:function(){
        return _gG(_notG(this._Q(A)),"n","h");
      },s:function(a){
        _sG(_notG(this._Q(A)),"n","h",a,this);
      }
    },properMinWidth:{
      g:function(){return get_proper_min_width(this);}
    },properMinHeight:{
      g:function(){return get_proper_min_height(this);}
    },alternativeFrame:{
      g:function(){
        return this._Q(A).A;
      },s:function(a){
        if(!a) a=null;
        else if(!(a instanceof HTMLElement)) return;
        this._Q(A).A=a;
      }
    },title:{
      g:function(){return this._Q(A).T.title;}
      ,s:function(a){
        var t=this._Q(A).T;
        a=String(a);
        t.title=a;
        check_title_length(this,a);
        _FEVT.t(this,this.width,this.height);
      }
    },show:{v:function(){
      if(NE("frameshow",this)) return;
      this._P(A).F.style.display="block";
      _notG(this._Q(A)).f&=~0b100;
    }},hide:{v:function(){
      if(NE("framehide",this)) return;
      this._P(A).F.style.display="none";
      _notG(this._Q(A)).f|=0b100;
    }}
  });
  DFP(PanelConfigure.prototype,{
    maxWidth:{
      g:function(){
        return _gG(NUPC(this,"G"),"m","w");
      },s:function(a){
        _sG(_notGC(this),"m","w",a);
      }
    },maxHeight:{
      g:function(){
        return _gG(NUPC(this,"G"),"m","h");
      },s:function(a){
        _sG(_notGC(this),"m","h",a);
      }
    },minWidth:{
      g:function(){
        return _gG(NUPC(this,"G"),"n","w");
      },s:function(a){
        _sG(_notGC(this),"n","w",a);
      }
    },minHeight:{
      g:function(){
        return _gG(NUPC(this,"G"),"n","h");
      },s:function(a){
        _sG(_notGC(this),"n","h",a);
      }
    },alternativeFrame:{
      g:function(){
        return NUPC(this,"A");
      },s:function(a){
        if(!a) a=null;
        else if(!(a instanceof HTMLElement)) return;
        this._P(A).A=a;
      }
    },applyFrame:{v:function(frame){
      frame.title=this.title;
      frame._Q(A).G=ODC(NUPC(this,"G"));
      if(this.isFullscreen) frame.fullscreen();
      if(this.isHide) frame.hide();
      frame.alternativeFrame=this.alternativeFrame;
    }}
  });
  DFP(PanelManager.prototype,{
    focus:{v:function(idx){
      var ord=this._P(A).O,len=ord.length
        ,idx=idx%len,p=ord[idx];
      if(NE("framefocus",this,{index:idx,total:len,panel:p})) return;
      p.focus();
    }}
  });
  _notG(_DFPC._P(A));
  DFP(LayerManager,{
    cancelPointerEvents:{
      g:function(){return _cancel_pevt;}
      ,s:function(a){_cancel_pevt=a==true;}
    }
  });
  _DFPC.alternativeFrame=document.createElement("div");
  
  function ADDBT(elem, fn, opt){
    if(ADDBT.map.has(fn)) return;
    function dbtfn(){
      if(dbtfn.t === null){
        dbtfn.t = (new Date()).getTime();
        return;
      }else if(((new Date()).getTime() - dbtfn.t) < 800){
        fn();
        dbtfn.t = null;
      }else
        dbtfn.t = (new Date()).getTime();
      
    }
    dbtfn.t = null;
    ADDBT.map.set(fn, dbtfn);
    ADE(elem, "touchstart", dbtfn, opt);
  }
  ADDBT.map = new Map();
  function RMDBT(elem, fn, opt){
    if(!ADDBT.map.has(fn)) return;
    RME(elem, "touchstart", ADDBT.map.get(fn), opt);
  }
})(window,document,LayerManager,PanelManager,PanelConfigure,Frame);



//