//
/**
 * 
 */
var PanelManager,LayerManager,PanelConfigure,Frame,Panel;
var defaultManager;
(function(window,document,Object,Array,String,Number,undefined){
  //private members
  function inherit(p,c){
    function f(){}
    f.prototype=p.prototype;
    var n=new f();
    n.constructor=c;
    c.prototype=n;
  }
  function UD(a,b){
    b=b===undefined?null:b;
    return a===undefined?b:a;
  }
  function ST(a,b){
    b===undefined&&(b="");
    return a==null?b:String(a);
  }
  function NUM(a,b,c,d){
    b===undefined&&(b=null);
    a=Number(a);
    if(isNaN(a)) return b;
    if(c!=null&&a<c) return b;
    if(d!=null&&a>d) return b;
    return a;
  }
  function TSPC(T,a,b,c){
    a=NUM(a,null);
    a!==null&&(T._P(A)[b]=a);
  }
  //If T[c] is null, return PanelConfigure.defaultConfigure[c].
  function NUPC(T,c){
    var b=T._P(A)[c]==null?_DFPC:T;
    return b._P(A)[c];
  }
  /**
   * Convenient method to set members.
   *
   * @private
   * @param {Object} T  Refer to "this".
   * @param {Object} o  An object used to set names and properties.
   */
  function ADATT(T,o){
    var cp=Object.getPrototypeOf(T)
      ,ls=Object.getOwnPropertyNames(o),len=ls.length;
    for(var i=0,k;i<len;i++){
      k=ls[i];
      if(cp.hasOwnProperty(k)){
        T[k]=o[k];
      }
    }
  }
  /**
   * Dispatch event.
   *
   * @private
   * @param {String}           k  Type of event.
   * @param {EventTarget-like} t  A EventTarget-like object.
   * @param {Object}           o  Optional, to add attributes to event.
   * @param {Object}           d  Optional, second arguments of Event().
   *
   * @returns {boolean}  Event.defaultPrevented.
   */
  function NE(k,t,o,d){
    o=o?o:{};
    var e=new Event(k,d?d:{cancelable:true}),c={}
      ,ls=Object.getOwnPropertyNames(o),len=ls.length;
    c.frameTarget={get:function(){return t;},configurable:1};
    for(var i=0,k,v;i<len;i++){
      k=ls[i],v=o[k];
      (function(k,v){
        c[k]={get:function(){return v;},configurable:1};
      })(k,v);
    }
    Object.defineProperties(e,c);
    if(t.dispatchEvent) t.dispatchEvent(e);
    return e.defaultPrevented;
  }
  function ADE(a,b,c,d){a.addEventListener(b,c,d);}
  function RME(a,b,c,d){a.removeEventListener(b,c,d);}
  /**
   * Returns coordinates relative to the window.
   *
   * @private
   * @param {Event}       e
   * @param {HTMLElement} p
   *
   * @returns {Array}  Returns [X,Y].
   */
  function THPOS(e){
    var dx=0,dy=0;
    while(e){
      dx+=e.offsetLeft-e.scrollLeft;
      dy+=e.offsetTop-e.scrollTop;
      e=e.offsetParent;
    }
    return [dx,dy];
  }
  //Deep copy of object.
  function ODC(o){
    if(!o) return o;
    else if(CSTE(o,Object)||CSTE(o,Array)){
      var r,ns=Object.getOwnPropertyNames(o)
        ,ds=Object.getOwnPropertyDescriptors(o)
        ,c=ns.length;
      function f(){};
      f.prototype=Object.getPrototypeOf(o);
      r=new f;
      for(var i=0,n,d;i<c;i++){
        n=ns[i],d=ds[n];
        if(d.hasOwnProperty("value")) d.value=ODC(d.value);
        Object.defineProperty(r,n,d);
      }
      return r;
    }else return o;
  }
  function DFP(a,b){
    var ns=Object.getOwnPropertyNames(b),len1=ns.length,res={};
    for(var i=0,n,o,d,tmp1,tmp2;i<len1;i++){
      n=ns[i];
      o=b[n];
      d={};
      
      if(o.c==false) d.configurable=0;
      else d.configurable=1;
      d.enumerable=o.e;
      tmp=o.g;
      tmp2=o.s;
      if(tmp===undefined&&tmp2===undefined){
        d.value=o.v;
        d.writable=o.w;
      }else{
        d.get=tmp;
        d.set=tmp2;
      }
      res[n]=d;
    }
    Object.defineProperties(a,res);
  }
  //Build a object that describe a widgets(HTMLElement) in frame. 
  function FNM(f,d,b,c,t,w,s1,s2,s3,s4,st){
    return {frame:f,draggableHead:d
      ,frameBody:b,container:c,title:t,widget:w
      ,hide:s1,restore:s2,fullscreen:s3,exit:s4,titleIcon:st};
  }
  function CSTE(a,b){
    return a.constructor===b;
  }
  /**
   * Format a array ,set, map or object.
   *
   * @private
   * @param {Object} a 
   * @param {String} b  "k":[k,...], "v":[v,...], "kv":[[k,v],...] else [{k:k,v:v},...]
   *
   * @returns {Array}  If length is 0 or a is an unexpected value, null is returned.
   */
  function LIST(a,b){
    var res=[];
    if(!a||CSTE(a,String)) return null;
    if(b==="k")
      b=function(v,k){return k;};
    else if(b==="v")
      b=function(v,k){return v;};
    else if(b==="kv")
      b=function(v,k){return [k,v];};
    else b=function(v,k){return {k:k,v:v};};
    if(CSTE(a,Object)){
      var ls=Object.getOwnPropertyNames(a),len=ls.length;
      for(var i=0,k;i<len;i++){
        k=ls[i];
        res.push(b(a[k],k));
      }
    }else if(CSTE(a,Set)||CSTE(a,Map)){
      a.forEach(function(v,k){
        res.push(b(v,k));
      });
    }else if(CSTE(a,Function)) return null;
    else res=Array.from(a,b);
    if(!res.length) return null;
    return res;
  }
  /**
   * Set icons of a frame.
   *
   * @private
   * @param {T}              f  A frame.
   * @param {IconData-like}  b  
   */
  function APICO(f,d){
    var S=f._Q(A).S,f1=function(s1,s2,m){
      s1.classList.remove("fra-zs");
      var w=s2.offsetWidth,h=s2.offsetHeight;
      if(m){
        s1.width=w,s1.height=h;
        s1.getContext("2d").drawImage(m,0,0,w,h);
      }else{
        s1.classList.add("fra-zs");
        s1.width=0,s1.height=0;
      }
    },d=d?d:PanelConfigure.buttomStatusIcons();
    f1(S.h,S.h,d.hide);
    f1(S.f,S.f,d.fullscreen);
    f1(S.r,S.f,d.restore);
    f1(S.e,S.e,d.exit);
    f1(S.t,S.t,d.title);
    S.h.innerText="‒";
    S.r.innerText="❐";
    S.f.innerText="□";
    S.e.innerText="×";
  }
  function ATTP(arg,dict,P,ud){
    dict=LIST(dict);
    !ud&&(ud={});
    var len=dict.length;
    for(var i=0,e,ls,p,v,len2;i<len;i++){
      e=dict[i];
      p=e.k,ls=e.v;
      len2=ls.length;
      for(var j=0,n,v;j<len2;j++){
        n=ls[j];
        v=arg[n];
        if(v==null){
          if(P[p]==null) P[p]=ud[p];
        }else P[p]=v;
      }
    }
  }
  /** new a class*/
  function NECLS(Cls,args) {
    args= Array.from(args);
    args.unshift(Cls);
    return new (Function.prototype.bind.apply(Cls, args));
  }
  var A=Symbol("private")
    ,_F={f:null}
    ,H=document.getElementsByTagName("html")[0]
    ,E=function(a){if(a!==A)console.warn("Private members should not be accessed. The first parameter is used to determine whether access.");}
    ,_FEVT={},_DFPC
    ,_CTM
    /**
     * Resource.
     *
     * @private
     * @type {Object}
     */
    ,R=[
      E       //0
      ,_F     //1 //focusedFrame
      ,_FEVT  //2 //event functions for Frame
      ,_DFPC  //3 //defaultConfigure
      ,_CTM   //4 //panelStyles and iconData
      ,inherit//5
      ,UD     //6
      ,ST     //7
      ,NUM    //8
      ,TSPC   //9
      ,NUPC   //10
      ,ADATT  //11
      ,NE     //12
      ,ADE    //13
      ,RME    //14
      ,THPOS  //15
      ,ODC    //16
      ,DFP    //17
      ,FNM    //18
      ,CSTE   //19
      ,LIST   //20
      ,APICO  //21
      ,NECLS  //22
    ];
    
  /**
   * Stores various settings for Panel, the properties X, Y, width, height
   * , moveX and moveY can be ratios, in other words, their values are ratios
   * of the width or height of the parent node of the panel, for example, if
   * value of moveX is 0.1 and width of parent node is 1000 then the value
   * we really want to set is 1000*0.1=100.If the property is invalid or has 
   * no value set, it will return a value from defaultConfigure when the getter
   * is called.
   *
   * @constructor
   * @param {Object ,PanelConfigure or Number} x
   *          X, if it is Object, it has the same effect as setProperties ().
   *          If it is PanelConfigure, then make a copy of panelConfigure (a part is a deep copy).
   *          If it is a Number, it represents the coordinate x(equals to style.left).
   * @param {Number}      y      
   * @param {Number}      w       
   * @param {Number}      h      
   * @param {Number}      mvx    
   * @param {Number}      mvy    
   * @param {Integer}     z      
   * @param {Integer}     s      
   * @param {String}      t      
   * @param {Integer}     theme  
   * @param {IconData}    icon   
   * @param {PanelStyles} sty     
   */
  PanelConfigure=function(x,y,w,h,mvx,mvy,z,s,t){
    var T=this;
    /**
     * Private object that stores members of the instance.
     *
     * @type {Object}
     * @property {Number}      X  Attribute: X,           the coordinate X represents left.
     * @property {Number}      Y  Attribute: Y,           the coordinate Y represents top.
     * @property {Number}      W  Attribute: width. 
     * @property {Number}      H  Attribute: height. 
     * @property {Number}      B  Attribute: moveX,       every time a panel is created, is X increased by moveX.
     * @property {Number}      C  Attribute: moveY,       every time a panel is created, is Y increased by moveY.
     * @property {String}      T  Attribute: title,       title of Frame.
     * @property {Integer}     Z  Attribute: Z,           zIndex.
     * @property {Integer}     S  Attribute: step,        number difference of zIndex between panels. 
     * @property {IconData}    I  Attribute: iconData,    icon of Frame, join in theme.js.
     * @property {Integer}     M  Attribute: theme,       theme of Frame, join in theme.js.
     * @property {PanelStyles} L  Attribute: panelStyles, classes and functions for Panel, join in theme.js.
     * @property {HTMLElement} A  Attribute: alternativeFrame, join in frameEx.js.
     * @property {Object}      E  The object stores the functions added in the addEventListener(), used in event.js.
     * @property {Object}      G  Frame config, used in frameEx.js.
     */
    var P;
    
    DFP(T,{
      /** @private*/
      _P:{v:function(a){E(a);return P;}}
    });
    if(x&&CSTE(x,PanelConfigure)){
       P=ODC(x._P(A));
       this.restoreXY();
    }else if(x&&CSTE(x,Object)){
      P={};
      ADATT(T,x);
    }else{
      P={X:NUM(x),Y:NUM(y),W:NUM(w),H:NUM(h),B:NUM(mvx)
        ,C:NUM(mvy),T:ST(t),Z:NUM(z),S:NUM(s),I:null,M:null
        ,L:null,E:null,G:null};
    }
    P.x=P.X,P.y=P.Y;
  }
  DFP(PanelConfigure.prototype,{
    X:{
      g:function(){return NUPC(this,"X");},s:function(a){TSPC(this,a,"X"),TSPC(this,a,"x");}
    },Y:{
      g:function(){return NUPC(this,"Y");},s:function(a){TSPC(this,a,"Y"),TSPC(this,a,"y");}
    },Z:{
      g:function(){return NUPC(this,"Z");},s:function(a){TSPC(this,a,"Z");}
    },step:{
      g:function(){return NUPC(this,"S");},s:function(a){TSPC(this,a,"S");}
    },width:{
      g:function(){return NUPC(this,"W");},s:function(a){TSPC(this,a,"W");}
    },height:{
      g:function(){return NUPC(this,"H");},s:function(a){TSPC(this,a,"H");}
    },moveX:{
      g:function(){return NUPC(this,"B");},s:function(a){TSPC(this,a,"B");}
    },moveY:{
      g:function(){return NUPC(this,"C");},s:function(a){TSPC(this,a,"C");}
    },title:{
      g:function(){return NUPC(this,"T");},s:function(a){this._P(A).T=ST(a);}
    },restoreXY:{
      v:function(){var P=this._P(A);P.X=P.x,P.Y=P.y;}
    },moveXY:{
      v:function(){var P=this._P(A);P.X=this.X,P.Y=this.Y,P.X+=this.moveX,P.Y+=this.moveY;}
    },
    /**
     * Convert the ratio to the values we want to set and then use those values to return to a PanelConfigure.
     * @param {HTMLElement} parent The parent node.
     *
     * @returns {PanelConfigure}
     */
    getByPercent:{v:function(parent){
      var T=this,P=T._P(A),f=function(a,b){
          if(!(1<Math.abs(a)||a==0)){
            a*=b;
            if(1>=Math.abs(a)) a=1.1;
          }
          return a;
        },i=parent.offsetWidth,j=parent.offsetHeight
        ,x=f(T.X,i),y=f(T.Y,j)
        ,w=f(T.width,i),h=f(T.height,j)
        ,b=f(T.moveX,i),c=f(T.moveY,j)
        ,ox=f(P.x,i),oy=f(P.y,j)
        ,pc=new PanelConfigure(x,y,w,h,b,c,P.Z,P.S,P.T);
      pc._P(A).x=ox,pc._P(A).y=oy;
      return pc;
    }},
    /**
     * Apply configuration to a HTMLElement.
     *
     * @param {HTMLElement} elem
     */
    applyRect:{v:function(elem){
      if(!elem.parentNode||isNaN(Number(elem.parentNode.offsetTop)))
        throw new TypeError("no parentNode or offsetTop");
      var c=this.getByPercent(elem.parentNode);
      elem.style.left=c.X;
      elem.style.top=c.Y;
      elem.style.width=c.width;
      elem.style.height=c.height;
    }},applyFrame:{v:function(frame){
      frame.title=this.title;
    }},applyConfigure:{v:function(arg){
      if(arg instanceof Frame){
        if(this.applyFrame) this.applyFrame(arg);
        if(this.applyStyles) this.applyStyles(arg);
        if(this.applyIcons) this.applyIcons(arg);
      }
      if(arg instanceof Panel){
        this.applyRect(arg._P(A).F);
        if(this.applyEvents) this.applyEvents(arg);
      }
    }}
  });
  DFP(PanelConfigure,{
    /**
     * Returns an IconData-like object(see detail in theme.js).
     *
     * @param {String}  strokeStyle | color
     * @param {Integer} lineWidth
     * @param {Integer} width
     * @param {Integer} height
     * 
     * @static
     *
     * @returns {Object} IconData-like object.
     */
    buttomStatusIcons:{v:function(a,b,cw,ch){
      var o = {};
      a = {color:a, lineWidth:b, width:cw, height:ch};
      ATTP(a,{A:["strokeStyle","color"],B:["lineWidth"]
        ,W:["width"],H:["height"]},o,{W:28,H:24});
      b = o.B; cw = o.W; ch = o.H; a = o.A;
      var cs=[],f=function(){
        var c=document.createElement("canvas");
        c.width=cw,c.height=ch;
        cs.push(c);
        c=c.getContext("2d");
        c.strokeStyle=a;
        c.lineWidth=b;
        return c;
      },h=f(),r=f(),x=f(),e=f();
      e.moveTo(7,5);
      e.lineTo(21,19);
      e.moveTo(21,5);
      e.lineTo(7,19);
      e.stroke();
      x.strokeRect(7,6,15,12);
      r.strokeRect(7,8,11,11);
      r.moveTo(10,8);
      r.lineTo(10,5);
      r.lineTo(21,5);
      r.lineTo(21,16);
      r.lineTo(18,16);
      r.stroke();
      h.moveTo(6,12);
      h.lineTo(22,12);
      h.stroke();
      
      return {hide:cs[0],restore:cs[1],fullscreen:cs[2],exit:cs[3]};
    }}
  });
  
  /**
  * Default configure.
  * @static
  * @type {PanelConfigure}
  */
  _DFPC=new PanelConfigure(0.1,0.1,0.5,0.5,0.02,0.02,999,1,"");
  DFP(PanelConfigure,{defaultConfigure:{v:_DFPC}});
  R[3]=_DFPC;
  /**
   * Control the operation of the code ,provide some convenient methods
   * and store the highest-level of panelConfigure, panelManager and panel
   * level means if the window frames are manager by the same panelManager 
   * so they are in same level.
   * LayerManager is not actually necessary but helpful.
   * 
   * @constructor
   * @param {HTMLElement}    elem
   * @param {PanelConfigure} config
   */
  LayerManager=function(elem,config){
    /**
     * Private object that stores members of the instance.
     *
     * @type {Object}
     * @property {PanelConfigure} C  Attribute: panelConfigure
     * @property {PanelManager}   M  Attribute: panelManager
     */
    if (!(this instanceof LayerManager))
      return NECLS(LayerManager, arguments);
      
    var P={C:null,M:new PanelManager(elem,config)};
    P.C=P.M._P(A).C;
    DFP(this,{
      _P:{v:function(a){E(a);return P;}}
    });
  }
  DFP(LayerManager,{
    /**
     * Resource.
     *
     * @private
     * @static
     *
     * @returns {Array}
     */
    _R:{v:function(a){E(a);return R;}}
    /**
     * Rrivate Symbol. For suppress warning.
     *
     * @private
     * @static
     * @type {Symbol}
     */
    ,_private:{v:A}
    /**
     * Set properties using object(json).
     *
     * @param {Object} props
     */
    ,set:{v:ADATT}
  });
  //Check if the panel childManager is null or not.
  function _chkP(T,p){
    var m,P=T._P(A);
    if(p){
      if(p.childManager){
         m=p.childManager;
      }else{
        m=new PanelManager
          (p,new PanelConfigure(P.C));
        m._P(A).P=p;
        p._P(A).C=m;
      }
    }else m=P.M;
    return m;
  }
  DFP(LayerManager.prototype,{
    panelConfigure:{g:function(){return this._P(A).C;}}
    ,panelManager:{g:function(){return this._P(A).M;}}
    /**Panel who owns panelManager*/
    ,panel:{g:function(){return this._P(A).M.panel;}}
    /**
     * Create an instance of Frame.
     * 
     * @param {HTMLElement}  elem
     * @param {Panel}        parentPanel
     * @param {String}       title
     */
    ,addChildFrame:{v:function(elem,parentPanel,title){
      elem = elem||{};
      parentPanel=parentPanel||elem.parent||elem.parentPanel;
      return _chkP(this,parentPanel).createFrame(elem,title);
    }}
     /**
     * Create an instance of Panel.
     *
     * @param {HTMLElement}  elem
     * @param {Panel}        parentPanel
     */
     ,addChildPanel:{v:function(elem,parentPanel){
       elem = elem||{};
       parentPanel=parentPanel||elem.parent||elem.parentPanel;
      return _chkP(this,parentPanel).createPanel(elem);
    }}
  });
  /**
   * When panels are focused, panelManager will control their behavior by changing their z index.
   * After the panel is created, the panel manager assigns an ID on the panel. In addition, the 
   * panel manager will keep all IDs and the panels corresponding to these IDs, and record the order 
   * of these panels.
   *
   * @constructor
   * @param {Panel}          panel
   * @param {PanelConfigure} config
   */
  PanelManager=function(panel,config){
    var o={},P;
    if(!panel) panel = {};
    if(panel&&CSTE(panel,Object)){
      ATTP(panel,{E:["widget","elem","element"],P:["parent","parentPanel"]
        ,C:["config","panelConfigure"],M:["manager"]}
        ,o,{E:document.body,P:null,M:null,C:new PanelConfigure()});
    }else{
      o={E:UD(panel,document.body),C:UD(config,new PanelConfigure()),P:null,M:null};
    }
    config=new PanelConfigure(o.C);
    panel=o.E;
    if(!(panel instanceof Panel)) panel=new Panel(A,panel,o.P,o.M);
    panel._P(A).C=this;
    
    /**
     * Private object that stores members of the instance.
     *
     * @type {Object}
     * @property {Object}         M  The object mapped by id of panel to panel.
     * @property {Array}          O  The array sorted by zindex. It has a significant effect on changing the order of the panels.
     * @property {Integer}        I  The largest ID which has been allocated.
     * @property {PanelConfigure} C  Attribute: panelConfigure.
     * @property {Panel}          P  Attribute: panel.          The panel who own this panelManager.
     */
    P={M:{},O:[],I:-1,C:config,P:panel};
    DFP(this,{
      _P:{v:function(a){E(a);return P;}}
    });
  }
  /**
   * Called when a panel is deleted, it changes the zIndex on some panels.
   *
   * @private
   * @param {PanelManager} T  refer to "this"
   * @param {Integer}      b  The ID of the panel to be deleted.
   */
  function _delP(T,b){
    var P=T._P(A),o=P.O,m=P.M,c=P.I
      ,s=T.step,p=m[b],d=(p.Z-T.Z)/s,i,j,k=o.length-1;
    p._P(A).F.parentNode.removeChild(p._P(A).F);
    delete m[b];
    delete o[d];
    for(i=b;i<c;i++){
      m[i]=m[i+1];
      m[i]._P(A).I=i;
    }
    delete m[i];
    for(i=d,j=p.Z;i<k;i++,j+=s){
      o[i]=o[i+1];
      _sZ(o[i],j);
    }
    o.pop();
    P.I=c-1;
  }
  /**
   * Called when a panel is focused, it changes the zIndex on some panels.
   *
   * @private
   * @param {PanelManager} T  refer to "this"
   * @param {Integer}      p  The ID of the panel to be deleted.
   */
  function _fcsP(T,p){
    var P=T._P(A),o=P.O,m=P.M
      ,b=(m[p].Z-T.Z)/T.step,c=P.I
      ,d=o[b],e,i,j;
    for(i=c,j=c*T.step+T.Z;i>b;i--,j-=T.step){
      _sZ(d,j);
      e=o[i];
      o[i]=d;
      d=e;
    }
    if(d&&e) _sZ(d,j),o[i]=e;
  }
  //Final processing when creating panels, c is a panel.
  function _pmP(T,c,pc){
    if(pc.applyEvents) pc.applyEvents(c);
    var P=T._P(A),i=P.I+1;
    P.I=i;
    _sZ(c,T.Z+i*T.step);
    P.M[i]=c;
    c._P(A).I=i;
    P.O.push(c);
    if(NE("frameaftercreate",c)) return;
    c.focus();
    pc.moveXY();
    //pc.X+=pc.moveX,pc.Y+=pc.moveY;
  }
  DFP(PanelManager.prototype,{  
    Z:{g:function(){return this._P(A).C.Z;},s:function(z){setStepAndZ(this.step,z)}}
    ,step:{g:function(){return this._P(A).C.step;},s:function(s){setStepAndZ(s,this.Z)}}
    ,panel:{g:function(){return this._P(A).P;}}
    ,panelConfigure:{g:function(){return this._P(A).C;}}
    ,upperZ:{g:function(){P=this._P(A);return P.I*P.C.step+P.C.Z;}}
    ,childPanels:{g:function(){
      var r=[],o=this._P(A).O;
      for(var i in o) r.push(o[i]);
      return r;
    }},createFrame:{v:function(a,b){
      var p=this.panel,T=this,pc,c,o={};
      var frame_attr;
      if(CSTE(a,Object)){
        ATTP(a,{C:["config","panelConfigure"],E:["widget","elem","element"],T:["title"]},o
          ,{C:this.panelConfigure});
        pc=o.C;
        b=o.T;
        if(CSTE(pc,Object)) pc=new PanelConfigure(pc);
        a=o.E;
      }else{
        pc=this.panelConfigure;
      }
      if(!a || !(a instanceof HTMLElement)){
        frame_attr = a;
        a=document.createElement("div");
      }
      if(NE("framebeforecreate",this
        ,{target:a,parentPanel:p,manager:T,panelConfigure:pc,title:b})) return;
      c=new Frame(A,a,p,T,pc,b);
      _pmP(this,c,pc);
      if(frame_attr) ADATT(c, frame_attr);
      return c;
    }},createPanel:{v:function(a){
      var p=this.panel,T=this,pc,c,o={};
      if(CSTE(a,Object)){
        ATTP(a,{C:["config","panelConfigure"],E:["widget","elem","element"]},o);
        pc=o.C;
        if(!pc) pc=this.panelConfigure;
        else if(CSTE(pc,Object)) pc=new PanelConfigure(pc);
        a=o.E;
      }else{
        pc=this.panelConfigure;
      }
      !a&&(a=document.createElement("div"));
      if(NE("framebeforecreate",this
        ,{target:a,parentPanel:p,manager:T,panelConfigure:pc})) return;
      c=new Panel(A,a,p,T,pc);
      _pmP(this,c,pc);
      return c;
    }},setStepAndZ:{v:function(s,z){
      var P=this._P(A),o=P.O,c=o.length;
      for(var i=0,j=z;i<c;i++,j+=s){
        _sZ(o[i],j);
      }
      P.C.Z=z ,P.C.step=s;
    }}
  });
  Panel=function(a,elem,parent,manager,config){
    //I:magrId; F:changeableFrame V:veiw L:lastConfig
    //E:eventFuncs(與PanelConfigure一樣);
    E(a);
    var P={W:elem,P:parent,M:manager,C:null,I:-1,F:elem,V:elem,L:null,E:null};
    DFP(this,{
      _P:{v:function(a){E(a);return P;}}
    });
    if(config&&elem.parentNode){
      this.setRect(config);
      P.L={x:this.X,y:this.Y,w:this.width,h:this.height};
    }
  }
  function _sZ(T,b){
    T._P(A).F.style.zIndex=b;
  }
  function _xywh(T,t){
    var F=T._P(A).F,v=parseFloat(F.style[t]);
    if(isNaN(Number(v))){
      v=F["offset"+t[0].toUpperCase()+t.substr(1)];
      F.style[t]=v;
    }
    return v;
  }
  DFP(Panel.prototype,{
    childManager:{
      g:function(){return this._P(A).C;}
    },manager:{
      g:function(){return this._P(A).M;}
    },parentPanel:{
      g:function(){return this._P(A).P;}
    },widget:{
      g:function(){return this._P(A).W}
    },Z:{
      g:function(){return this._P(A).F.style.zIndex;}
    },X:{
      g:function(){return _xywh(this,"left");}
      ,s:function(a){if((a=NUM(a))!=null) this._P(A).F.style.left=a;}
    },Y:{
      g:function(){return _xywh(this,"top");}
      ,s:function(a){if((a=NUM(a))!=null) this._P(A).F.style.top=a;}
    },width:{
      g:function(){return _xywh(this,"width");}
      ,s:function(a){if((a=NUM(a))!=null) this._P(A).F.style.width=a;}
    },height:{
      g:function(){return _xywh(this,"height");}
      ,s:function(a){if((a=NUM(a))!=null) this._P(A).F.style.height=a;}
    },setRect:{w:1,v:function(x,y,w,h){
      var T=this,p=T.widget;
      if(x&&CSTE(x,PanelConfigure)){
        if(NE("framesetrect",this,{panelConfigure:x})) return;
        x.applyRect(p);
        return;
      }
      if(NE("framesetrect",this,{X:x,Y:y,width:w,height:h})) return;
      if(x!=null) T.X=x;
      if(y!=null) T.Y=y;
      if(w!=null) T.width=w;
      if(h!=null) T.height=h;
    }},remove:{v:function(){
      if(NE("frameremove",this)) return;
      _delP(this.manager,this._P(A).I);
    }},show:{v:function(){
      if(NE("frameshow",this)) return;
      this._P(A).F.style.display="block";
    }},hide:{v:function(){
      if(NE("framehide",this)) return;
      this._P(A).F.style.display="none";
    }},focus:{v:function(a){
      if(NE("framefocus",this)) return;
      var m=this.manager,e=this.parentPanel;
      m&&_fcsP(m,this._P(A).I);
      if(e&&e._P(A).I!=-1) e.focus(A);
      if(a==A) return;
      this.widget.classList.remove("fra-usel");
      this.widget.classList.add("fra-sel");
      H.classList.remove("fra-sel");
      H.classList.add("fra-usel");
      if(_F.f&&_F.f!==this) _F.f.blur();
      _F.f=this;
    }},blur:{v:function(){
      if(NE("frameblur",this)) return;
      this.widget.classList.remove("fra-sel");
      this.widget.classList.add("fra-usel");
    }},fullscreen:{v:function(){
      var T=this,p=T.parentPanel.widget
        ,w=p.offsetWidth,h=p.offsetHeight;
      T._P(A).L=[T.X,T.Y,T.width,T.height];
      if(NE("framefullscreen",this
        ,{width:w,height:h})) return;
      T.setRect(0,0,w,h);
    }},restore:{v:function(x,y,w,h){
      var T=this,c=this._P(A).L;
      if(x==undefined) x=c[0],y=c[1],w=c[2],h=c[3];
      if(NE("framerestore",this
        ,{X:x,Y:y,width:w,height:h})) return;
      T.setRect(x,y,w,h);
    }}
  });
  Frame=function(a,w,p,m,c,t){
    //B:bodyPanel; F:frame;D:dragWidget; G:stateFlags
    //R:resizePanel; C:container; E:eventFuncs;
    //S:frameStateButtons; M:classNameMap; 
    Panel.call(this,a,w,p,m);
    var f=function(){return document.createElement("span");}
      ,ca=function(){return document.createElement("canvas");}
      ,P={B:f(),F:f(),D:f(),T:f(),C:f(),G:null
        ,S:{h:ca(),r:ca(),f:ca(),e:ca(),t:ca()},M:null
        ,E:{}},T=this;
    T._P(A).F=P.F;
    T._P(A).V=P.C;
    DFP(T,{
      _Q:{v:function(a){E(a);return P;}}
    });
    _lyot2(T);
    _lyot(T);
    if(c.applyStyles) c.applyStyles(this);
    else _nat(T);
    APICO(T,c.iconData);
    _adevt(T);
    T.setRect(c);
    
    T._P(A).L={x:this.X,y:this.Y,w:this.width,h:this.height};
    c.applyFrame(T);
    T.setRect(null,null,null,null);
    t&&(T.title=t);
    //P.S.t.getContext("2d").fillRect(0,0,28,24);
  }
  inherit(Panel,Frame);
  function _nat(T){
    var P=T._Q(A),S=P.S;
    for(var i in S) S[i].classList.add("fra-dfts");
    S.e.classList.add("fra-dftse");
    P.F.classList.add("fra-dft");
  }
  function _lyot(T){
    var f=function(a,b){a.appendChild(b);}
      ,w=T.widget,P=T._Q(A);
    if(w.parentNode) w.parentNode.replaceChild(P.F,w);
    else f(T.parentPanel._P(A).V,P.F);
    f(P.F,P.B),f(P.B,P.D),f(P.B,P.C)
      ,f(P.D,P.S.t),f(P.D,P.T),f(P.C,w);
      f(P.D,P.S.h);f(P.D,P.S.f);f(P.D,P.S.e);
  }
  function _lyot2(T){
    var P=T._Q(A);
    P.F.classList.add("fra-fra");
    P.D.classList.add("fra-hd");
    P.D.classList.add("fra-usel");
    P.B.classList.add("fra-bd");
    P.C.classList.add("fra-cn");
    P.T.classList.add("fra-ti");
    for(var i in P.S){
      P.S[i].classList.add("fra-bn");
      P.S[i].classList.add("fra-s"+i);
    }
  }
  function _adevt(T){
    var P=T._Q(A),ev=P.E,f1=function(e){
      e.stopPropagation();
      T.focus();
    },get_hov_ver=function(xp,yp){
      var hor=null,ver=null
        ,x=P.B.offsetLeft+10,y=P.B.offsetTop+10
        ,w=P.B.offsetWidth-20,h=P.B.offsetHeight-20;
      if(xp<=x){
        hor=0;
      }else if(xp>x+w){
        hor=1;
      }
      if(yp<=y){
        ver=0;
      }else if(yp>=y+h){
        ver=1;
      }
      return {h:hor,v:ver};
    },last_pointer;
    function resize_start(ev){
      var e=ev.type=="touchstart"?ev.targetTouches[0]:ev
        ,x=T.X,y=T.Y,w=T.width,h=T.height
        ,pf=T.frame,rect=P.F.getBoundingClientRect()
        ,xp=Math.floor(e.clientX-rect.left)
        ,yp=Math.floor(e.clientY-rect.top)
        ,ver=null,hor=null, dds = document.documentElement.style
        ,cpos=THPOS(pf.parentNode),cx=cpos[0]+x
        ,cy=cpos[1]+y,mov=function(ev){
          var e=ev.type=="touchmove"?ev.targetTouches[0]:ev
            ,lp=_FEVT.l,x=lp.x,y=lp.y
            ,w=lp.w,h=lp.h,cx=lp.b,cy=lp.c
            ,xp=e.clientX,yp=e.clientY,tmp;
          tmp=xp-cx;
          
          if(hor){
            w=tmp;
          }else if(hor===0){
            x=x+tmp;
            
            w=w-tmp;
          }
          tmp=yp-cy;
          if(ver){
            h=tmp;
          }else if(ver===0){
            y=y+tmp;
            
            h=h-tmp;
          }
          //if(w<220) x=null,w=null;
          //if(h<35) y=null,h=null;
          if(!NE("frameresize",T
            ,{width:w,height:h,X:x,Y:y,event:ev})){
              
              _FEVT.i(T,x,y,w,h,1,hor,ver);
              ev.preventDefault();
          }
        },end=function(ev){
          _FEVT.e(T);
          RME(window,"mousemove",mov);
          RME(window,"touchmove",mov);
          RME(window,"mouseup",end);
          RME(window,"touchend",end);
          dds.touchAction = "";
          ev.preventDefault();
        };
      //xp-=px;
      //yp-=py;
      //
      hor=get_hov_ver(xp,yp);
      ver=hor.v;
      hor=hor.h;
      if(ver===null&&hor===null) return;
      
      _FEVT.l={x:x,y:y,w:w,h:h,b:cx,c:cy};
      _FEVT.s(T);
      ADE(window,"mousemove",mov);
      ADE(window,"touchmove",mov);
      ADE(window,"mouseup",end);
      ADE(window,"touchend",end);
      dds.touchAction = "none";
      ev.preventDefault();
    }
    ADE(P.F,"mousedown",resize_start);
    ADE(P.F,"touchstart",resize_start);
    
    function fmvd(ev){
      if(!Frame.prototype.hasOwnProperty("isFullscreen") && P.D.contains(P.S.r)) return;
      var e=ev.type=="touchstart"?ev.targetTouches[0]:ev
        ,x=T.X,y=T.Y
        ,xp=e.clientX,yp=e.clientY;
      ADE(window,"mousemove",fmvm);
      ADE(window,"mouseup",fmvu);
      ADE(window,"touchmove",fmvm);
      ADE(window,"touchend",fmvu);
      _FEVT.l={x:x-xp,y:y-yp,w:null,h:null};
      _FEVT.s(T);
      ev.preventDefault();
    }
    function fmvm(ev){
      var e=ev.type=="touchmove"?ev.targetTouches[0]:ev
        ,pf=_FEVT.g(T).f,xp=e.clientX,yp=e.clientY
        ,p=pf.parentNode//,p=T.parentPanel._P(A).V
        ,pl=_FEVT.l,nx=xp+pl.x,ny=yp+pl.y;
      
      if(!NE("framedrag",T
        ,{X:nx,Y:ny,event:ev})){
        _FEVT.i(T,nx,ny,pl.w,pl.h,1);
        ev.preventDefault();
      }
    }
    function fmvu(e){
      _FEVT.e(T);
      RME(window,"mousemove",fmvm);
      RME(window,"mouseup",fmvu);
      RME(window,"touchmove",fmvm);
      RME(window,"touchend",fmvu);
      e.preventDefault();
    }
    ADE(P.D,"mousedown",fmvd);
    ADE(P.D,"touchstart",fmvd);
    
    LIST(P.S,"v").forEach(function(s){
      ADE(s,"mousedown",function(e){
        f1(e);
      });
      ADE(s,"touchstart",function(e){
        f1(e);
      });
    });
    ADE(P.S.h,"click",function(){
      T.hide();
    });
    ADE(P.S.e,"click",function(){
      T.remove();
    });
    
    ADE(P.S.f,"click",function(){
      T.fullscreen();
    });
    ADE(P.S.r,"click",function(){
      T.restore();
    });
    ADE(P.D,"mousedown",function(e){
      f1(e);
    });
    ADE(P.D,"touchstart",function(e){
      f1(e);
    });
    ADE(P.F,"mousedown",function(e){
      f1(e);
    });
    ADE(P.F,"touchstart",function(e){
      f1(e);
    });
    
    function resize_pointer_move(e){
      var rect=P.F.getBoundingClientRect()
        ,xp=Math.floor(e.clientX-rect.left)
        ,yp=Math.floor(e.clientY-rect.top)
        ,hor=null,ver=null,n;
      
      hor=get_hov_ver(xp,yp);
      ver=hor.v;
      hor=hor.h;
      
      if(hor===null&&ver===null) n="auto";
      else if(hor===null) n="s-resize";
      else if(ver===null) n="w-resize";
      else if(hor===ver) n="nw-resize";
      else n="ne-resize";
      if(n!==last_pointer||document.body.style.cursor==="auto"){
        document.body.style.cursor=n;
        last_pointer=n;
      }
    }
    function resize_pointer_over(e){
      resize_pointer_move(e);
      ADE(P.F,"mousemove",resize_pointer_move);
    }
    function resize_pointer_out(e){
      RME(P.F,"mousemove",resize_pointer_move);
      document.body.style.cursor="auto";
    }
    ADE(P.F,"mouseover",resize_pointer_over);
    ADE(P.F,"mouseout",resize_pointer_out);
    ADE(P.B,"mouseover",function(e){
      e.stopPropagation();
    });
    ADE(P.B,"mouseout",function(e){
      e.stopPropagation();
    });
    ev.p={d:resize_start,o:resize_pointer_over,l:resize_pointer_out};
    if(_FEVT.a) _FEVT.a(T);
  }
  
  DFP(Frame.prototype,{
    title:{
      g:function(){return this._Q(A).T.title;}
      ,s:function(a){
        var t=this._Q(A).T;
        a=String(a);
        t.title=a;
        t.innerText=a.substring(0,7);
        a.length>7&&(t.innerText+="...");
      }
    },frame:{g:function(){return this._Q(A).F;}}
    ,getElements:{v:function(){
      var p=this._Q(A);
      return FNM(this.frame,p.D,p.B,p.C,p.T,this.widget
        ,p.S.h,p.S.r,p.S.f,p.S.e,p.S.t);
    }},setRect:{w:1,v:function(x,y,w,h){
      if(x&&CSTE(x,PanelConfigure)){
        x=x.getByPercent(this.parentPanel.widget);
        y=x.Y,w=x.width,h=x.height,x=x.X;
      }
      if(NE("framesetrect",this,{X:x,Y:y,width:w,height:h})) return;
      if(x==null) x=this.X;
      if(y==null) y=this.Y;
      if(w==null) w=this.width;
      if(h==null) h=this.height;
      //x<0&&(x=0),y<0&&(y=0),w<220&&(w=220),h<35&&(h=35);
      var P=this._Q(A),m=P.B.offsetLeft,n=P.B.offsetTop
        ,t=P.D.offsetHeight,a=w-(m<<1),b=h-(n<<1)
        ,eh=b-t;
      
      P.F.style.left=x;
      P.F.style.width=w;
      P.B.style.width=a;
      P.C.style.width=a;
      P.D.style.width=a;
      
      P.F.style.top=y;
      P.F.style.height=h;
      P.B.style.height=b;
      P.C.style.height=eh;
      
      if(_FEVT.t) _FEVT.t(this,w,h,a,eh);
      
    }},fullscreen:{v:function(){
      var T=this,P=T._Q(A),p=T.parentPanel.widget
        ,w=p.offsetWidth,h=p.offsetHeight,ptre=P.E.p;
      T._P(A).L={x:T.X,y:T.Y,w:T.width,h:T.height};
      if(NE("framefullscreen",this
        ,{width:w,height:h})) return;
      T.setRect(0,0,w,h);
      P.D.replaceChild(P.S.r,P.S.f);
      RME(P.F,"mouseover",ptre.o);
      RME(P.F,"mouseout",ptre.l);
      RME(P.F,"mousedown",ptre.d);
      RME(P.F,"touchstart",ptre.d);
      if(_FEVT.f) _FEVT.f(T);
      
    }},restore:{v:function(x,y,w,h){
      var T=this,P=T._Q(A),c=T._P(A).L,ptre=P.E.p;
      if(x==undefined) x=c.x,y=c.y,w=c.w,h=c.h;
      if(NE("framerestore",this
        ,{X:x,Y:y,width:w,height:h})) return;
      
      P.D.replaceChild(P.S.f,P.S.r);
      ADE(P.F,"mouseover",ptre.o);
      ADE(P.F,"mouseout",ptre.l);
      ADE(P.F,"mousedown",ptre.d);
      ADE(P.F,"touchstart",ptre.d);
      T.setRect(x,y,w,h);
      if(_FEVT.r) _FEVT.r(T);
    }}
  });

  _FEVT.s=function(T){
    T.widget.style.pointerEvents="none";
  }
  _FEVT.e=function(T){
    T.widget.style.pointerEvents="auto";
  }
  _FEVT.g=function(T){
    return {f:T.frame,x:T.X,y:T.Y,w:T.width,h:T.height};
  }
  _FEVT.i=function(T,x,y,w,h,f){
    if(x!==null&&x<0) {
      w += x;
      x=0;
    }
    if(y!==null&&y<0) {
      h += y;
      y=0;
    }
    if(w!==null&&w<220) x=null,w=null;
    if(h!==null&&h<35) y=null,h=null;
    if(f) T.setRect(x,y,w,h);
    else return {x:x,y:y,w:w,h:h};
  }
  function HED(e){
    if(!(e.target==this||e.target==document.body&&_F.f))return;
    _F.f.widget.classList.remove("fra-sel");
    _F.f.widget.classList.add("fra-usel");
    H.classList.add("fra-sel");
    H.classList.remove("fra-usel");
    _F.f=null;
  }
  ADE(window,"mousedown",HED);
  ADE(window,"touchstart",HED);
  function DOMREADY(){
    if(document.body.offsetWidth<50) document.body.style.width = window.innerWidth;
    if(document.body.offsetHeight<50) document.body.style.height = window.innerHeight;
    defaultManager = LayerManager();
  }
  if (document.readyState === "complete"||document.readyState === "interactive") {
     setTimeout(DOMREADY, 1);
  } else {
     document.addEventListener("DOMContentLoaded", DOMREADY);
  }
  
})(window,document,Object,Array,String,Number);
//