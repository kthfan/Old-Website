
var Menu, OrderedMenu, GrowingMenu, RollingMenu, ItemWrapMenu, ScrollbarMenu;

;(function(window,document,undefined){
  var parseFloat =  window.parseFloat || Number.parseFloat || parseFloat;
  var parseInt =  window.parseInt || Number.parseInt || parseInt;
  var DEFAULT_CLK_SIZE = 20, EXCEED_FLAG_CHANGED = 1
    , EXCEED_FLAG_EXCEED = 2, FORMAL_SIZE = 100
    , DEFAULT_ROLL_STEP = 25, ROLL_FRONT = "front"
    , ROLL_BACK = "back";
  var STYLE_MAP = {"default":"rgb(100,100,100)","dark":"rgb(50,50,50)"};
  var tmp_prototype;
  function inherit(p,c){
    function f(){}
    f.prototype=p.prototype;
    var n=new f();
    n.constructor=p;
    c.prototype=n;
  }
  function getNumByStyle(elem, prop){
    var _map = {"x":"left", "y":"top", "w":"width", "h":"height"};
    return elem.style[_map[prop]];
  }
  function setNumByStyle(elem, prop, value){
    var _map = {"x":"left", "y":"top", "w":"width", "h":"height"};
    return elem.style[_map[prop]] = value;
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
  function definePrototype(proto,tmp){
    var attr_list = Object.getOwnPropertyNames(tmp);
    for(var i=0;i<attr_list.length;i++){
      var name = attr_list[i];
      proto[name] = tmp[name];
    }
  }
  function unimplement(arg1){
    throw TypeError("'"+arg1+"' called on an object that does not implement interface Menu.");
  }
  /**
   * @param {Object} arg {
   *       vertical       {boolean}
   *       horizontal     {boolean}
   *       parent         {HTMLElement}
   *       x              {Number}
   *       y              {Number}
   *       width          {Number}
   *       height         {Number}
   *       itemSize       {Number}
   *       style          {String}
   *       popup          {Boolean}  For popup menu.
   *       popupPosition  {String}   "left", "right", "bottom", "top"
   *       content        {HTMLElement | String}  Content in parent menu. 
   *}
   *        
  */
  Menu = function(arg){
    this.constructor = Menu;
    this.parent = arg.parent;
    this.menuElem = document.createElement("div");
    this.formalSize = arg.itemSize?arg.itemSize:FORMAL_SIZE;
    this.style = arg.style?arg.style:Menu.STYLE_DEFAULT;
    if(arg.vertical) {
      this.direction = "vertical";
    }
    if(arg.horizontal) {
      this.direction = "horizontal";
    }
    this._init_rect(arg);
    if(arg.popup) this._solve_popup_info(arg);
    
    this.menuElem.classList.add("menu");
    this.addStyle(this.style);
    if(arg.parent) this.render(arg);
  }
  Menu.prototype = {
    render:function(arg){
      var p = arg.parent || this.parent;
      this._init_rect(arg);
      p.appendChild(this.menuElem);
    }
    ,clear:function(){
      var elemList = Array.from(this.menuElem.childNodes);
      for(var i=0;i<elemList.length;i++){
        this.menuElem.removeChild(elemList[i]);
      }
    },buildByList:function(list){
      for(var i=0;i<list.length;i++) this.append(list[i]);
    }
    ,insert:function(arg, index){
      var arg = this._solveAppendArg(arg);
      if(arg.p!=null) this._addPopupEvent(arg.e, arg.p);
      this.menuElem.insertBefore(arg.e, this.menuElem.childNodes[index]);
      arg.e.classList.add("menu-elem-"+this.style);
    }
    ,append:function(arg){this.insert(arg, -1);}
    ,remove:function(index){this.menuElem.removeChild(this.menuElem.childNodes[index]);}
    ,changeStyle:function(arg){this.removeStyle(this.style);this.addStyle(arg);}
    ,addStyle:function(arg){
      this.style = arg;
      this.menuElem.classList.add("menu-"+arg);
      this.forEach(function(elem){elem.classList.add("menu-elem-"+arg)});
    }
    ,removeStyle:function(arg){
      this.menuElem.classList.remove("menu-"+arg);
      this.forEach(function(elem){elem.classList.remove("menu-elem-"+arg)});
    }
    ,addEvent:function(func, index){this.menuElem.childNodes[index].addEventListener("click", func);}
    ,removeEvent:function(func, index){this.menuElem.childNodes[index].removeEventListener("click", func);}
    /** break when returns false*/
    ,forEach:function(func){
      var elemList = Array.from(this.menuElem.childNodes);
      for(var i=0;i<elemList.length;i++){
        if(func(elemList[i], i, elemList)===false) break;
      }
    }
    ,getInnerLength:function(){
        var cumSize = 0;
        var T = this;
        this.forEach(function(elem){
          if(T.direction[0] === "h"){
            cumSize += parseFloat(elem.style.width);
          }else{
            cumSize += parseFloat(elem.style.height);
          }
        });
        return cumSize;
      }
    ,_solveAppendArg:function(arg){
      var isPopup = false;
      var popup; 
      var text;
      if(arg instanceof Menu){
        isPopup = true;
        popup = arg;
        arg = popup.content;
      }
      if(arg.constructor === String){
        text = arg;
        arg = document.createElement("span");
        arg.innerText = text;
      }
      if(arg instanceof HTMLElement){
        text = arg.innerText;
      }
      return {p:popup,e:arg,t:text};
    }
    ,_addPopupEvent:function(elem, popup){
      var T = this;
      var menuElem = T.menuElem;
      var posit = popup.popupPosition;
      var left,top,width,height;
      var pLeft = parseFloat(this.menuElem.style.left);
      var pTop = parseFloat(this.menuElem.style.top);
      var pWidth = parseFloat(this.menuElem.style.width);
      var pHeight = parseFloat(this.menuElem.style.height);
      var eLeft = parseFloat(elem.style.left);
      var eTop = parseFloat(elem.style.top);
      var eWidth = parseFloat(elem.style.width);
      var eHeight = parseFloat(elem.style.height);
      if(posit[0] === "l"){
        left = eLeft + eWidth + pLeft;
        top =  eTop + pTop;
      }else if(posit[0] === "r"){
        left = eLeft + pLeft;
        top =  eTop + pTop - eWidth;
      }else if(posit[0] === "b"){
        left = eLeft + pLeft;
        top =  eTop + eHeight + pTop;
      }else if(posit[0] === "t"){
        left = eLeft + pLeft;
        top =  eTop + pTop - eHeight;
      }
      popup.X = left;
      popup.Y = top;
      popup._onpopup = function(){
        T._showPopup(elem, popup);
      }
      elem.addEventListener("click", popup._onpopup);
    }
    ,_appendByCum:function(arg){
      var T = this;
      var isPopup;
      var popup;
      var _s = this._solveAppendArg(arg._val);
      arg.elem = _s.e;
      popup = _s.p;
      isPopup = popup!=null;
      if(arg.elem instanceof HTMLElement){
        arg.elem.style.left = arg.elem.offsetLeft;
        arg.elem.style.top = arg.elem.offsetTop;
        arg.elem.style.width = arg.elem.offsetWidth;
        arg.elem.style.height = arg.elem.offsetHeight;
        if(this.direction[0] === "h" ){
          if(!arg.elem.offsetWidth) arg.elem.style.width = this.formalSize;
          arg.elem.style.height = this.menuElem.style.height;
          arg.elem.style.left = arg._cum;
        }else{
          if(!arg.elem.offsetHeight) arg.elem.style.height = this.formalSize;
          arg.elem.style.width = this.menuElem.style.width;
          arg.elem.style.top = arg._cum;
        }
        arg.elem.classList.add("menu-elem"); 
        arg.elem.classList.add("menu-elem-"+this.style);
        this.menuElem.appendChild(arg.elem);
       }
       if(isPopup){
         this._addPopupEvent(arg.elem, popup);
       }
       
       if(this.direction[0] === "h") return parseFloat(arg.elem.style.width);
       else   return parseFloat(arg.elem.style.height);
      }
    ,_allElemFront:function(){
        var res = Number.POSITIVE_INFINITY;
        var T = this;
        this.forEach(function(elem){
          if(T.direction[0] === "h") {
            var tmp = parseFloat(elem.style.left);
            res = tmp<res ? tmp : res;
          }else{
            var tmp = parseFloat(elem.style.top);
            res = tmp<res ? tmp : res;
          }
        });
        return res;
      },_allElemBack:function(){
        var res = Number.NEGATIVE_INFINITY;
        var T = this;
        this.forEach(function(elem){
          if(T.direction[0] === "h") {
            var tmp = parseFloat(elem.style.left) + parseFloat(elem.style.width);
            res = tmp>res ? tmp : res;
          }else{
            var tmp = parseFloat(elem.style.top) + parseFloat(elem.style.height);
            res = tmp>res ? tmp : res;
          }
        });
        return res;
      }
    ,_showPopup:function(elem, popup){
      if(popup.isPopup) return;
      popup.isPopup = true;
      var menuElem = this.menuElem;
      
      var htmlElem = document.getElementsByTagName("html")[0];
      var _cancel_popup_show_func = function(){
        elem.removeEventListener("click", _button_cancel_popup_show );
        htmlElem.removeEventListener("click", _html_cancel_popup_show);
        menuElem.parentNode.removeChild(popup.menuElem);
        popup.isPopup = false;
      }
      var _button_cancel_popup_show = function(e){
        _cancel_popup_show_func();
      }
      var _html_cancel_popup_show = function (e){
        e = window.event || e;
        var tmpElem = e.target;
        while(tmpElem){
          if(tmpElem===elem || tmpElem===popup.menuElem){
            return;
          }
          tmpElem = tmpElem.parentNode;
        }
        _cancel_popup_show_func();
      };
      
      popup.render({parent:menuElem.parentNode});
      htmlElem.addEventListener("click", _html_cancel_popup_show);
      elem.addEventListener("click", _button_cancel_popup_show );
    }
    ,_solve_popup_info:function(arg){
      arg.parent = null;
      if(arg.popupPosition != null)
        this.popupPosition = arg.popupPosition;
      else  this.popupPosition = arg.vertical ? "bottom" : "left";
      //this.parentMenu = arg.parentMenu;
      this.content = arg.content==null ? "" : arg.content;
    },_init_rect:function(arg){
      var x = arg.x, y = arg.y, w = arg.width, h = arg.height;
      if(x!=null) this.menuElem.style.left = x;
      if(y!=null) this.menuElem.style.top = y;
      
      if(w==null){
        w = this.menuElem.style.width ? parseFloat(this.menuElem.style.width) : 100;
      }
      if(h==null){
        h = this.menuElem.style.height ? parseFloat(this.menuElem.style.height) : 100;
      }
      this.menuElem.style.width = w;
      this.menuElem.style.height = h;
    }
  }
  DFP(Menu.prototype,{
    width:{
      g:function(){
        return getNumByStyle(this.menuElem, "w");
      },s:function(a){
        setNumByStyle(this.menuElem, "w", a);
      }
    },height:{
      g:function(){
        return getNumByStyle(this.menuElem, "h");
      },s:function(a){
        setNumByStyle(this.menuElem, "h", a);
      }
    },X:{
      g:function(){
        return getNumByStyle(this.menuElem, "x");
      },s:function(a){
        setNumByStyle(this.menuElem, "x", a);
      }
    },Y:{
      g:function(){
        return getNumByStyle(this.menuElem, "y");
      },s:function(a){
        setNumByStyle(this.menuElem, "y", a);
      }
    },itemSize:{
      g:function(){
        return this.formalSize;
      },s:function(a){
        this.formalSize = a;
        this.buildByList(this.orderedList);
      }
    }
  });
  Menu.STYLE_EMPTY = "empty";
  Menu.STYLE_DEFAULT = "default";
  Menu.STYLE_OCEAN = "ocean";
  Menu.STYLE_DARK = "dark";
  Menu.createMenu = function(arg){
    var typeMap = {"growing":GrowingMenu, "rolling":RollingMenu,
        "itemwrap":ItemWrapMenu, "scrollbar":ScrollbarMenu};
    return new typeMap[arg.type](arg);
  }
  OrderedMenu = function(arg){
    this.orderedList = [];
    Menu.call(this,arg);
    this.constructor = OrderedMenu;
  }
  inherit(Menu, OrderedMenu);
  tmp_prototype={
    clear:function(){
      Menu.prototype.clear.call(this);
      this.orderedList = [];
    },
    buildByList:function(list){
      this.clear();
      var cumSize = 0;
      for(var i=0;i<list.length;i++){
        cumSize += this._appendByCum({_val:list[i],_cum:cumSize });
      }
      this.orderedList = Array.from(list);
      this.convertOrderedList();
    }
    /** Will convert string to HTMLElement*/
    ,convertOrderedList:function(){
      var elemList = Array.from(this.menuElem.childNodes);
      var alterList = Array.from(this.menuElem.childNodes);
      var orderList = [];
      for(var i=0;i<elemList.length;i++){
        var tempElem;
        var minNum = Number.POSITIVE_INFINITY;
        var j_iter = elemList.length-i;
        var tmpIdx = -1;
        for(var j=0;j<j_iter;j++){
          if(this._moreclk_f == elemList[i] || this._moreclk_b == elemList[i])
            continue;
          var tempFront;
          if(this.direction[0] === "h") tempFront = parseFloat(alterList[j].style.left);
          else  tempFront = parseFloat(alterList[j].style.top);
          if(minNum>tempFront) {
            minNum = tempFront;
            tempElem = elemList[i];
            tmpIdx = j;
          }
        }
        if(tmpIdx !== -1){
          alterList.splice(j,1);
          orderList.push(tempElem);
        }
      }
      this.orderedList = Array.from(orderList);
      return orderList;
    },insert:function(arg, index){
      var orderList = this.orderedList;
      orderList.splice(index,0, arg);
      this.buildByList(orderList);
    }
    ,append:function(arg){
      var inl = this.getInnerLength();
      var item = arg;
      this._appendByCum({_val:item,_cum:inl});
      this.orderedList.push(item);
    }
    ,remove:function(index){
      var orderList = this.orderedList;
      var res = orderList.splice(index,1)[0];
      this.buildByList(orderList);
      return res;
    },addEvent:function(func, index){
       var orderedList = convertOrderedList();
       orderedList[index].addEventListener("click", func);
     },removeEvent:function(func, index){
       var orderedList = convertOrderedList();
       orderedList[index].removeEventListener("click", func);
     }
  }
  definePrototype(OrderedMenu.prototype, tmp_prototype);
  DFP(OrderedMenu.prototype,{
    width:{
      g:function(){
        return getNumByStyle(this.menuElem, "w");
      },s:function(a){
        setNumByStyle(this.menuElem, "w", a);
        this.buildByList(this.orderedList);
      }
    },height:{
      g:function(){
        return getNumByStyle(this.menuElem, "h");
      },s:function(a){
        setNumByStyle(this.menuElem, "h", a);
        this.buildByList(this.orderedList);
      }
    }
  });
  /**
   * @param {Object} arg {
   *       minLength  {Number}  -1 means infinity
   *       maxLength  {Number}  
   *}
   *        
  */
  GrowingMenu = function(arg){
    this._minLen = arg.minLength==null?-1:arg.minLength;
    this._maxLen = arg.maxLength==null?-1:arg.maxLength;
    OrderedMenu.call(this,arg);
    this.menuElem.classList.add("growingmenu");
    this.constructor = GrowingMenu;
  }
  inherit(OrderedMenu, GrowingMenu);
  tmp_prototype={
    buildByList:function(list){
      OrderedMenu.prototype.buildByList.call(this, list);
      this._updateLen();
    },append:function(arg){
      OrderedMenu.prototype.append.call(this, arg);
      this._updateLen();
    },_updateLen:function(){
      var inerlen = this.getInnerLength();
      if(inerlen>this._maxLen && this._maxLen !==-1) inerlen = this._maxLen;
      if(inerlen<this._minLen && this._minLen!==-1) inerlen = this._minLen;
      if(this.direction[0] === "h") this.menuElem.style.width = inerlen;
      else this.menuElem.style.height = inerlen;
    },_init_rect:function(arg){
      OrderedMenu.prototype._init_rect.call(this,arg);
      if(this.direction[0] === "h") this.menuElem.style.width = null;
      else this.menuElem.style.height = null;
    }
  }
  definePrototype(GrowingMenu.prototype, tmp_prototype);
  DFP(GrowingMenu.prototype,{
    minLength:{
      g:function(){
        return this._minLen;
      },s:function(a){
        this._minLen = a;
        this._updateLen();
      }
    },maxLength:{
      g:function(){
        return this._maxLen;
      },s:function(a){
        this._maxLen = a;
        this._updateLen();
      }
    }
  });
  /**
   * @param {Object} arg {
   *       rollSpeed      {Number}
   *}       
  */
  RollingMenu = function(arg){
    this._create_moreclk(arg);
    this.rollSpeed = arg.rollSpeed!=null?arg.rollSpeed:6;
    OrderedMenu.call(this,arg);
    this.menuElem.classList.add("rollingmenu");
    //can't in Menu
    this.constructor = RollingMenu;
  }
  inherit(OrderedMenu, RollingMenu);
  
  RollingMenu.ROLL_FRONT = "front";
  RollingMenu.ROLL_BACK = "back";
  tmp_prototype={
    /**
    * @param {Object} arg {
    *        parent
    *        x
    *        y
    *        width
    *        height
    *}
    *        
    */
    render:function(arg){
      Menu.prototype.render.call(this, arg);
      var w = this.width, h = this.height;
      if(this.direction[0] === "h"){
        this._moreclk_f.style.width = DEFAULT_CLK_SIZE;
        this._moreclk_f.style.height = h;
        this._moreclk_b.style.width = DEFAULT_CLK_SIZE;
        this._moreclk_b.style.height = h;
      }else{
        this._moreclk_f.style.width = w;
        this._moreclk_f.style.height = DEFAULT_CLK_SIZE;
        this._moreclk_b.style.width = w;
        this._moreclk_b.style.height = DEFAULT_CLK_SIZE;
      }
      this._render_moreclk();
      this.buildByList(this.orderedList);
    }
    ,forEach:function(func){
      var elemList = Array.from(this.menuElem.childNodes);
      for(var i=0;i<elemList.length;i++){
        if(this._moreclk_f == elemList[i] || this._moreclk_b == elemList[i])
          continue;
        if(func(elemList[i], i, elemList)===false) break;
      }
    }
    ,buildByList:function(list){
      OrderedMenu.prototype.buildByList.call(this, list);
      this.updateExceed();
    }
    ,append:function(arg){
      OrderedMenu.prototype.append.call(this, arg);
      this.updateExceed();
    }
      ,isRolling:function(){
        return Array.from(this.menuElem.childNodes).indexOf(this._moreclk_f) !== -1;
      }
      ,isExceed:function(){
        var cumSize = this.getInnerLength();
        var totalLen = this.direction[0] === "h" 
             ? this.menuElem.style.width : this.menuElem.style.height;
        var moreclkLen = this.direction[0] === "h" 
             ? this._moreclk_f.style.width : this._moreclk_f.style.height;
        totalLen = parseFloat(totalLen);
        moreclkLen = parseFloat(moreclkLen);
        return totalLen-2*moreclkLen<cumSize;
      }
      ,addStyle:function(arg){
        Menu.prototype.addStyle.call(this, arg);
        this._moreclk_f.classList.add("_menu-moreclk-"+arg);
        this._moreclk_b.classList.add("_menu-moreclk-"+arg);
        
      },removeStyle:function(arg){
        Menu.prototype.removeStyle.call(this, arg);
        this._moreclk_f.classList.remove("_menu-moreclk-"+arg);
        this._moreclk_b.classList.remove("_menu-moreclk-"+arg);
        
     },
     updateExceed:function(){
      var cumSize = this.getInnerLength();
      var flagRes;  
      var isRol = this.isRolling();
      if(this.isExceed()){
        if(!isRol){
          this._installWhenExceed();
          flagRes |= EXCEED_FLAG_CHANGED;
        }
        flagRes |= EXCEED_FLAG_EXCEED;
      }else{
        if(isRol){
          this._uninstallWhenExceed();
          flagRes |= EXCEED_FLAG_CHANGED;
        }
      }
      return cumSize;
    },
     /**
      * @param {Object} arg {
      *      direction {String}
      *      step      {Integer} 
      *}
      */
      scrollMenu:function(arg){
        var T = this;
        var step = arg.step?arg.step:DEFAULT_ROLL_STEP;
        var d = arg.direction;
        step = Math.abs(step);
        if(d[0] === "b") step = -step;
        this.forEach(function(elem){
          if(T.direction[0] === "h") 
              elem.style.left = parseFloat(elem.style.left)+step;
          else 
              elem.style.top = parseFloat(elem.style.top)+step;
        });
      }
     ,_installWhenExceed:function(){
       this._installMoreClk();
       this._installWheelEvent();
     }
     ,_uninstallWhenExceed:function(){
       this._uninstallMoreClk();
       this._uninstallWheelEvent();
     }
     ,_scrollMenu:function(arg){
       var mel;
       var T = arg.T;
       var moreclkLen = this.direction[0] === "h" 
         ? this._moreclk_f.style.width : this._moreclk_f.style.height;
       moreclkLen = parseFloat(moreclkLen);
       if(T.direction[0] === "h") mel = parseFloat(T.menuElem.style.width);
       else mel = parseFloat(T.menuElem.style.height);
       var count = 0;
       var ani_timeout;
       var f_ani_func = function(){
         if(count++>arg.c || T._allElemFront()>=moreclkLen){
           clearInterval(ani_timeout);
           count = 0;
         }else T.scrollMenu({direction:"front", step:T.rollSpeed*arg.s});
       }
       var b_ani_func = function(){
         if(count++>arg.c || T._allElemBack()<=mel-moreclkLen){
           clearInterval(ani_timeout);
           count = 0;
         }else T.scrollMenu({direction:"back", step:T.rollSpeed*arg.s});
       }
       if(arg.d[0]==="f"){
         if(T._allElemFront()<moreclkLen)
           ani_timeout = setInterval(f_ani_func, arg.t);
       }else{
         if(T._allElemBack()>mel-moreclkLen)
           ani_timeout = setInterval(b_ani_func, arg.t);
       }
     }
     ,_installWheelEvent:function(){
       var toinst = this._onMenuWheel==null;
       var T = this;
       this._onMenuWheel = function(e){
         e = e || window.event || event;
         var cof = e.deltaX + e.deltaY;
         if(cof<0) T._scrollMenu({T:T, d:"f", c:12, t:30, s:-cof});
         else T._scrollMenu({T:T, d:"b", c:12, t:30, s:cof});
       }
       if(toinst) this.menuElem.addEventListener("wheel",this._onMenuWheel);
     }
     ,_uninstallWheelEvent:function(){
       this.menuElem.removeEventListener("wheel",this._onMenuWheel);
       this._onMenuWheel = null;
     }
     ,_installMoreClk:function(){
        var totalLen = this.direction[0] === "h" 
             ? this.menuElem.style.width : this.menuElem.style.height;
        var moreclkLen = this.direction[0] === "h" 
             ? this._moreclk_f.style.width : this._moreclk_f.style.height;
        totalLen = parseFloat(totalLen);
        moreclkLen = parseFloat(moreclkLen);
        if(this.direction[0] === "h") {
           this._moreclk_f.style.left = 0;
          this._moreclk_b.style.left = totalLen-moreclkLen;
        }else {
          this._moreclk_f.style.top = 0;
          this._moreclk_b.style.top = totalLen-moreclkLen;
        }
        var T = this;
        var f_toinst = this._moreClkOnClick_f==null;
        var b_toinst = this._moreClkOnClick_b==null;
        this._moreClkOnClick_f = function(e){
          T._scrollMenu({T:T, d:"f", c:15, t:30, s:1});
        };
        this._moreClkOnClick_b = function(e){
          T._scrollMenu({T:T, d:"b", c:15, t:30, s:1});
        };
        if(f_toinst) this._moreclk_f.addEventListener("click",this._moreClkOnClick_f);
        if(b_toinst) this._moreclk_b.addEventListener("click",this._moreClkOnClick_b);
        this.menuElem.appendChild(this._moreclk_f);
        this.menuElem.appendChild(this._moreclk_b);
      },_uninstallMoreClk:function(){
        this.menuElem.removeChild(this._moreclk_f);
        this.menuElem.removeChild(this._moreclk_b);
        this._moreclk_f.removeEventListener("click",this._moreClkOnClick_f);
        this._moreclk_b.removeEventListener("click",this._moreClkOnClick_b);
      }
    ,_create_moreclk:function(arg){
      this._moreclk_f = document.createElement("canvas");
      this._moreclk_b = document.createElement("canvas");
      this._moreclk_f.classList.add("_menu-moreclk");
      this._moreclk_f.style.width = DEFAULT_CLK_SIZE;
      this._moreclk_f.style.height = DEFAULT_CLK_SIZE;
      this._moreclk_b.classList.add("_menu-moreclk");
      this._moreclk_b.style.width = DEFAULT_CLK_SIZE;
      this._moreclk_b.style.height = DEFAULT_CLK_SIZE;
      if(arg.vertical) {
        this._moreclk_f.innerText = "︿";
        this._moreclk_b.innerText = "﹀";
      }else{
        this._moreclk_f.innerText = "〈";
        this._moreclk_b.innerText = "〉";
      }
    }
    ,_render_moreclk:function(){
      var fp1,fp2,fp3;
      var bp1,bp2,bp3;
      var tw = this._moreclk_f.width;
      var th = this._moreclk_f.height;
      var cf;
      var f_ctx = this._moreclk_f.getContext("2d");
      var b_ctx = this._moreclk_b.getContext("2d");
      var tmp1,tmp2;
      var stk_sty = STYLE_MAP[this.style];
      tmp2 = parseFloat(this._moreclk_f.style.width);
      tmp1 = parseFloat(this._moreclk_f.style.height);
      cf = tmp2 > tmp1 ? tmp1 : tmp2;
      
      if(this.direction[0] === "v"){
        fp1 = [tw/5, 4*th/5];
        fp2 = [tw/2, th/5];
        fp3 = [4*tw/5, 4*th/5];
        bp1 = [tw/5, th/5];
        bp2 = [tw/2, 4*th/5];
        bp3 = [4*tw/5, th/5];
      }else{
        fp1 = [4*tw/5, th/5];
        fp2 = [tw/5, th/2];
        fp3 = [4*tw/5, 4*th/5];
        bp1 = [tw/5, th/5];
        bp2 = [4*tw/5, th/2];
        bp3 = [tw/5, 4*th/5];
      }
      f_ctx.beginPath(); 
      f_ctx.lineWidth = cf*0.5; 
      f_ctx.moveTo(fp1[0], fp1[1]); 
      f_ctx.lineTo(fp2[0], fp2[1]); 
      f_ctx.lineTo(fp3[0], fp3[1]); 
      f_ctx.strokeStyle = stk_sty; 
      f_ctx.stroke(); 
      b_ctx.beginPath(); 
      b_ctx.lineWidth = cf*0.5; 
      b_ctx.moveTo(bp1[0], bp1[1]); 
      b_ctx.lineTo(bp2[0], bp2[1]); 
      b_ctx.lineTo(bp3[0], bp3[1]); 
      b_ctx.strokeStyle = stk_sty; 
      b_ctx.stroke(); 
    },
    _init_rect:function(arg){
      Menu.prototype._init_rect.call(this, arg);
    }
  };
  definePrototype(RollingMenu.prototype, tmp_prototype);
  DFP(RollingMenu.prototype,{
    width:{
      g:function(){
        return getNumByStyle(this.menuElem, "w");
      },s:function(a){
        setNumByStyle(this.menuElem, "w", a);
        this.buildByList(this.orderedList);
        if(this.direction[0] !== "h"){
          this._moreclk_f.style.width = a;
          this._moreclk_b.style.width = a;
        }
      }
    },height:{
      g:function(){
        return getNumByStyle(this.menuElem, "h");
      },s:function(a){  
        setNumByStyle(this.menuElem, "h", a);
        this.buildByList(this.orderedList);
        if(this.direction[0] === "h"){
          this._moreclk_f.style.height = a;
          this._moreclk_b.style.height = a;
        }
      }
    }
  });
  /**
  * @param {Object} arg {
  *   lineWidth        {Number}
  *   lineItemNumber  {Integer}
  *}
  */
  ItemWrapMenu = function(arg){
    this._lineWidth = arg.lineWidth==null?100:arg.lineWidth;
    this._lineItemNumber = arg.lineItemNumber==null?5:arg.lineItemNumber;
    OrderedMenu.call(this,arg);
    this.constructor = ItemWrapMenu;
  }
  inherit(OrderedMenu, ItemWrapMenu);
  tmp_prototype={
    getLineCount:function(){
      var inl = this.getInnerLength();
      var lineLen = this.formalSize*this._lineItemNumber;
      return Math.ceil(inl/lineLen);
    },
    _appendByCum:function(arg){
      var lineLen = this.formalSize*this._lineItemNumber;
      var lc = Math.floor(arg._cum/lineLen);
      arg._cum -= lc*lineLen;
      if(arg._cum+this.formalSize>lineLen) {
        arg._cum = 0;
      }
      
      var res = OrderedMenu.prototype._appendByCum.call(this, arg);
      var ln = this.getLineCount()-1;
      if(ln<=0) ln = 0;
      if(this.direction[0] === "h" ){ 
        arg.elem.style.top = this._lineWidth*ln;
        arg.elem.style.height = this.formalSize;
      }else{
        arg.elem.style.left = this._lineWidth*ln;
        arg.elem.style.width = this.formalSize;
      }
      this.lineWidth = this._lineWidth;
      return res;
   },_init_rect:function(arg){
     this.lineWidth = this._lineWidth;
     this.lineItemNumber = this._lineItemNumber;
     OrderedMenu.prototype._init_rect.call(this, arg);
   }
  };
  definePrototype(ItemWrapMenu.prototype, tmp_prototype);
  DFP(ItemWrapMenu.prototype,{
    lineWidth:{
      g:function(){
        return this._lineWidth;
      },s:function(a){
        this._lineWidth = a;
        var ln = this.getLineCount();
        if(ln<=0) ln = 1;
        if(this.direction[0] === "h" ){
          this.menuElem.style.height = this._lineWidth*ln;
        }else{
          this.menuElem.style.width = this._lineWidth*ln;
        }
      }
    },lineItemNumber:{
      g:function(){
        return this._lineItemNumber;
      },s:function(a){
        this._lineItemNumber = a;
        if(this.direction[0] === "h" ){
          this.menuElem.style.width = this._lineItemNumber*this.formalSize;
        }else{
          this.menuElem.style.height = this._lineItemNumber*this.formalSize;
        }
      }
    }
  });
  /**
   * @param {Object} arg {
   *      barPosition {String}  left, top, bottom, right
   *}
   */
  ScrollbarMenu = function(arg){
    OrderedMenu.call(this, arg);
    if(arg.vertical){
      this.menuElem.style.overflowX = "hidden";
      this.menuElem.style.overflowY = "scroll";
    }
    if(arg.horizontal){
      this.menuElem.style.overflowX = "scroll";
      this.menuElem.style.overflowY = "hidden";
    }
    if(arg.barPosition==null) arg.barPosition = "left";
    this.barPosition = arg.barPosition;
    switch(arg.barPosition[0]){
      case "l":
        this.menuElem.style.transform = "rotateY(180deg)";
        break;
      case "t":
        this.menuElem.style.transform = "rotateX(180deg)";
        break;
    }
    this.menuElem.classList.add("scrollbarmenu");
    this.constructor = ScrollbarMenu;
  }
  inherit(OrderedMenu, ScrollbarMenu);
  tmp_prototype={
    
    _appendByCum:function(arg){
      var res = OrderedMenu.prototype._appendByCum.call(this, arg);
      var elem = this.menuElem;
      var ost;
      if(this.direction[0] === "h"){
        ost = elem.offsetHeight - elem.clientHeight;
        arg.elem.style.height = parseFloat(elem.style.height) - ost;
      }else{
        ost = elem.offsetWidth - elem.clientWidth;
        arg.elem.style.width = parseFloat(elem.style.width) - ost;
        
      }
      //arg.elem.classList.add("scrollmenu-elem");
      switch(this.barPosition[0]){
      case "l":
        arg.elem.style.transform = "rotateY(180deg)";
        break;
      case "t":
        arg.elem.style.transform = "rotateX(180deg)";
        break;
      }   
      return res;
    }
  };
  definePrototype(ScrollbarMenu.prototype, tmp_prototype);
})(window,document);