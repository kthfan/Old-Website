
  
var Matrix, mtimes, rows, zeros, size;

;(function(window,undefined){
  var parseFloat = window.parseFloat || Number.parseFloat || parseFloat;
  var parseInt = window.parseInt || Number.parseInt || parseInt;
  var isNaN = window.isNaN || Number.isNaN || isNaN;
  function _checkOwnLengthA(mat){
    var _rows = mat.length;
    if(_rows == null) return 0;
    var _cols = mat[0];
    if(_cols == null) return 0;
    _cols = mat[0].length;
    if(_rows == null) return {c:_rows,t:1};
    return {r:_rows,c:_cols,t:2};
  }
  function _1Dto2DMatrix(mat,_cols){
    return [mat];
  }
  function _checkIsMatrix(mat,_rows,_cols){
    if(_rows == null) return false;
    for(var i=1;i<_rows;i++){
      if(mat[i].length !== _cols) return false;
    }
    return true;
  }
  
  function _string2Matrix(str){
    var _len = str.length-1;
    var ary = [];
    var res = [];
    var _num_start = -1;
    var _blank_start = -1;
    var _ln_start = -1;
    var _dot_cum = 0;
    if(str[0] !== '[' || str[_len] !== ']' ) throw TypeError("invalid expression.");
    for(var i=1;i<_len;i++){
      var ch = str[i];
      if(ch === '\n' || ch === ';'){
        //ln
        _ln_start = 1;
        //end num
        if(_num_start!==-1){
          if(_dot_cum === 0) ary.push(parseInt(str.substring(_num_start, i)));
          else ary.push(parseFloat(str.substring(_num_start, i)));
          _num_start = -1;
          _dot_cum = 0;
        }
      }else if(ch === ' ' || ch === '\r' || ch === '\t'){
        //blank
        
        //end ln
        if(_ln_start !== -1){
          res.push(ary);
          ary = [];
          _ln_start = -1;
        }
        //end num
        if(_num_start!==-1){
          if(_dot_cum === 0) ary.push(parseInt(str.substring(_num_start, i)));
          else ary.push(parseFloat(str.substring(_num_start, i)));
          _num_start = -1;
          _dot_cum = 0;
        }
      }else{
        //num
        var _ch_code = ch.charCodeAt(0);
        if(48<=_ch_code && _ch_code<=57){
          if(_num_start === -1) _num_start = i;
        }else if(ch === '.' && _dot_cum === 0){
          _dot_cum = 1;
          if(_num_start === -1) _num_start = i;
        }else throw TypeError("invalid expression.");
        //end ln
        if(_ln_start !== -1){
          res.push(ary);
          ary = [];
          _ln_start = -1;
        }
      }
    }
    if(_num_start!==-1){
      if(_dot_cum === 0) ary.push(parseInt(str.substring(_num_start, _len)));
      else ary.push(parseFloat(str.substring(_num_start, _len)));
    }
    if(res[res.length-1] !== ary) res.push(ary);
    return res;
  }
  function _subIndex(mat, _start, _end){
    var res;
  }
  function _parseIndex(index){
    if(index == null) return {t:0};
    else if(index.constructor === String){
      var _len = index.length;
      var _sp_len = 0;
      var _sp_index = -1;
      for(var i=0;i<_len;i++){
        var ch = index[i];
        if(ch === ':'){
          if(_sp_len===0)_sp_len++, _sp_index = i;
          else throw TypeError("invalid expression.");
        }
      }
      var index_s,index_e;
      index_s = parseInt(index.substring(0, _sp_index));
      index_e = parseInt(index.substring(_sp_index+1, _len-1));
      if(isNaN(index_s) || isNaN(index_s)) throw TypeError("invalid expression.");
      return {s:index_s, e:index_e, t:1};
    }else if(index.constructor === Number) return {i:index, t:2};
  }
  function _getIndex(i,j){
    i = _parseIndex(i);
    j = _parseIndex(j);
    if(i.t===1){
      var _start = i.s, _end = i.e;
      
    }
  }
  function _matrixForEach(mat, func, dim, orgmat){
    // func(item, dim, mat);
    if(mat.constructor !== Array) return func(mat, dim, orgmat);
    var _len = mat.length;
    for(var i=0;i<_len;i++){
      var cdim = Array.from(dim);
      cdim.push(i+1);
      _matrixForEach(mat[i], func, cdim, orgmat);
    }
  }
  function _emptyMatrix(_dims){
    var _len = _dims.length;
    if(_len === 1) return new Array(_dims[0]);
    else if(_len === 0) return undefined;
    var _cdims = Array.from(_dims);
    var _this_dim = _cdims.shift();
    var res = new Array(_this_dim);
    
    for(var i=0;i<_this_dim;i++){
      res[i] = _emptyMatrix(_cdims);
    }
    return res;
  }
  function _toJavascriptArray(mat){
    if(mat.constructor === Function) return mat.mat;
    return mat;
  }
  Matrix = function(arg){
    var mat = _getMatrix(arg);
    var res = function (i,j){
      return mat[i-1][j-1];
    }
    res.mat = mat;
    return res;
  }
  
  function _getMatrix(arg){
    if(arg.constructor === String){
      arg = _string2Matrix(arg);
    }
    if(arg instanceof Array){
      var _rows, _cols;
      var tmp = _checkOwnLengthA(arg);
      if(tmp === 0) throw TypeError("invalid param.");
      else if(tmp.t === 1) {
        _rows = 1;
        _cols = tmp.c;
        arg = _1Dto2DMatrix(arg, _cols);
      }else{
        _rows = tmp.r;
        _cols = tmp.c;
      }
      if(!_checkIsMatrix(arg, _rows, _cols)) throw TypeError("dimensions mismatch.");
    }
    return arg;
  }
  mtimes = function (A,B){
    A = _toJavascriptArray(A);
    B = _toJavascriptArray(B);
    var rows = A.length;
    var cols = B[0].length;
    var len = B.length;
    if(len !== A[0].length) return "error.";
    var res = new Array(rows);
    for(var i=0;i<rows;i++){
      var ary = new Array(cols);
      res[i] = ary;
      var Ai = A[i];
      for(var j=0;j<cols;j++){
        var tmp = 0;
        for(var k=0;k<len;k++) tmp += Ai[k]*B[k][j];
        ary[j] = tmp;
      }
    }
    return res;
  }
  size = function(mat, n){
    mat = _toJavascriptArray(mat);
    var tmp = mat;
    var dim = [];
    while(tmp && tmp.hasOwnProperty("length")){
      dim.push(tmp.length);
      tmp = tmp[0];
    }
    if(n != null) return dim[n];
    return dim;
  }

})(window);