

function mtimes(A,B){
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
;(function(window,undefined){
  
  ANN = function(arg){
    var res = new _ANN(arg);
    return res;
  }
  function _ANN(arg){
    arg = arg || {};
    this._P = {};
    this.layer = arg.layer || 4;
    this.alpha = arg.alpha || 0.5;
    this.tol = arg.tol || 1e-5;
    this.iter = arg.iter || 100;
    this.batch_size = arg.batch_size || -1;
    this.X = arg.X;
    this.Y = arg.Y;
  }
  Object.defineProperties(_ANN.prototype,{
    /**
     * Numberof layers for weight and bias matrixies.
     */
    layer:{
      get:function(){
        return this._P.L - 1;
      },set:function(arg){
        arg = parseInt(arg);
        if(!isNaN(arg)) this._P.L = arg+1;
      }
    },
    /**
     * Matrixies for weight.
     * e.g.
     * [
     *  null,           //Not used
     * 
     *  [[1, 2],        //layer 1
     *   [3, 4]],
     * 
     *  [[89, 90],      //layer 2
     *   [91, 92]]
     * ]
     */
    W_cell:{
      get:function(){
        return this._P.W_cell;
      },set:function(arg){
        this._P.W_cell = arg;
      }
    },
    /**Matrixies for bias. Same as W_cell. */
    b_cell:{
      get:function(){
        return this._P.b_cell;
      },set:function(arg){
        this._P.b_cell = arg;
      }
    },
    /**Step for gradient descent. */
    alpha:{
      get:function(){
        return this._P.alpha;
      },set:function(arg){
        arg = Number(arg);
        if(!isNaN(arg)) this._P.alpha = arg;
      }
    },X:{
      get:function(){
        return this._P.X;
      },set:function(arg){
        this._P.X = arg;
      }
    },Y:{
      get:function(){
        return this._P.Y;
      },set:function(arg){
        this._P.Y = arg;
      }
    },
    /** Iteration number.*/
    iter:{
      get:function(){
        return this._P.iter;
      },set:function(arg){
        arg = parseInt(arg);
        if(!isNaN(arg)) this._P.iter = arg;
      }
    },
    /** Iteration number.*/
    batch_size:{
      get:function(){
        return this._P.batch_size;
      },set:function(arg){
        arg = parseInt(arg);
        if(!isNaN(arg)) this._P.batch_size = arg;
      }
    },
    /**Tolerance of cost. */
    tol:{
      get:function(){
        return this._P.tol;
      },set:function(arg){
        arg = Number(arg);
        if(!isNaN(arg)) this._P.tol = arg;
      }
    },
    /**
     * Generate W_cell and b_cell.
     * @param   {Integer}   L     Number of layers.
     * @param   {Number}   matadd Minimum size of matrix.
     * @param   {Number}   matmul Random range of size of matrix.
     * @param   {Number}   add    Minimum value of matrix value.
     * @param   {Number}   mul    Random range of matrix value.
     */
    gen_Wb:{
      value:function(L, matadd, matmul, add, mul ){
        this.layer = L;
        var x_rows = this._P.X.length;
        var y_rows = this._P.Y.length;
        var x_cols = this._P.X[0].length;
        var y_cols = this._P.Y[0].length;
        var n = x_rows + y_rows + x_cols + y_cols;
        var xl,yl;
        n /= 8;
        if(x_cols == y_cols) xl = x_rows, yl = y_rows;
        else if(x_rows == y_rows) xl = x_cols, yl = y_cols;
        else return "dim not match.";
        if(matadd==null) matadd = n;
        if(matmul==null) matmul = n;
        var res = _gen_Wb(this.layer, xl, yl, matadd, matmul, add, mul);
        this.W_cell = res.W;
        this.b_cell = res.b;
        return res;
      }
    },
    /**
     * Returns the cost. 
     * 
     * @returns {Number}    The cost.
    */
    cost:{
      value:function(){
        var _rt;
        var tmp;
        var predict_Y;
        tmp = _2XYmat(this.X, this.Y);
        if(tmp.t === -1) return null;
        predict_Y = this.predict(tmp.X);
        _rt = _cost(tmp.Y, predict_Y, tmp.Y.length, tmp.Y[0].length);
        return _rt;
      }
    },
    /**
     * Returns the result of prediction.
     * @param   {Matrix}    argx    Ann.X
     * 
     * @returns {Matrix}    The predicted Y.
    */
    predict:{
      value:function(argx){
        var X = this.X;
        var _rt;
        X = argx || X;
        if(this._P.t == 1) X = transposeMatrix(X);
        X = _munize(X, this._P.addx, this._P.mulx);
        _rt = _predict(X, this.W_cell, this.b_cell, this._P.L, X[0].length);
        _rt = _ununize(_rt, this._P.addy, this._P.muly);
        return _rt;
      }
    },
    run:{
      value:function(renew, iter, batch_size){
        var res, tmp;
        if(renew==null) renew = true;
        if(this.X==null||this.Y==null) return "X or Y undefined.";
        if(this.layer==null) return "layer undefined.";
        if(renew || this.W_cell == null || this.b_cell == null){
          this.gen_Wb(this._P.L);
        }
        iter = iter || this.iter;
        batch_size = batch_size || this.batch_size;
        tmp = _2XYmat(this.X, this.Y);
        this._P.t = tmp.t;
        if(tmp.t === -1) return "dim not matched.";
        tmp.X = _unize(tmp.X);
        this._P.addx = tmp.X.add;
        this._P.mulx = tmp.X.mul;
        tmp.X = tmp.X.mat;
        tmp.Y = _unize(tmp.Y);
        this._P.addy = tmp.Y.add;
        this._P.muly = tmp.Y.mul;
        tmp.Y = tmp.Y.mat;
        if(batch_size===-1) batch_size = tmp.Y[0].length;
        res = _run(tmp.X,tmp.Y,this.W_cell,this.b_cell,this.alpha,this.tol,iter,batch_size);
        return res;
      }
    },
    /**Clear the result from Ann.run() */
    cleanResult:{
      value:function(){W_cell=null;b_cell=null;}
    }
  });
  
  function randint(a,b){
    return Math.round(Math.random()*(b-a)+a);
  }
  function copyMatrix(mat){
    var rows = mat.length,
        cols = mat[0].length;
    var res = initMatrix(rows,cols);
    for(var i=0;i<rows;i++){
      for(var j=0;j<cols;j++) res[i][j] = mat[i][j];
    }
    return res;
  }
  function transposeMatrix(mat){
    var rows = mat.length,
        cols = mat[0].length;
    var res = initMatrix(cols ,rows );
    for(var i=0;i<rows;i++){
      for(var j=0;j<cols;j++) res[j][i] = mat[i][j];
    }
    return res;
  }
  function initMatrix(rows,cols){
    var res = new Array(rows);
    for(var i=0;i<rows;i++){
      res[i] = new Array(cols);
    }
    return res;
  }
  function _gen_randmat(rows, cols, add, mul){
    var res = new Array(rows);
    if(add == null) add = 0;
    if(mul == null) mul = 1;
    for(i=0;i<rows;i++){
      var ary = new Array(cols);
      res[i] = ary;
      for(j=0;j<cols;j++){
        ary[j] = Math.random()*mul + add;
      }
    }
    return res;
  }
  function _gen_Wb(L, x_rows, y_rows, matadd, matmul , add, mul){
    if(matadd == null) matadd = 2;
    if(matmul == null) matmul = 8;
    L++;
    var W_cell = new Array(L);
    var b_cell = new Array(L);
    var cols = x_rows;
    var rows = Math.ceil(matadd+Math.random()*matmul );
    var cols;
    for(layer=1;layer<L-1;layer++){
      W_cell[layer] = _gen_randmat(rows, cols, add, mul);
      cols = 1;
      b_cell[layer] = _gen_randmat(rows, cols, add, mul);
      cols = rows;
      rows = Math.ceil(matadd+Math.random()*matmul );
    }
    rows = y_rows;
    W_cell[layer] = _gen_randmat(rows, cols, add, mul);
    cols = 1;
    b_cell[layer] = _gen_randmat(rows, cols, add, mul);
    return {W:W_cell, b:b_cell};
  }
  function get_z_a_aa(W_cell, b_cell, X_c, L, batch_size){
    /*
     * a[l].row = W[l].row = b[l].row  =  W[l+1].col
     * W[l].col = a[l-1].row = W[l-1].row
     * a[l].col = a[l-1].col
     */
    var z_cell = new Array(L),
        a_cell = new Array(L),
        ad_cell = new Array(L);
    var a_last = X_c;
    a_cell[0] = a_last;
    for(var layer=1;layer<L;layer++){
      var W_layer = W_cell[layer];
      var b_layer = b_cell[layer];
      var rows = W_layer.length;
      var z_layer = new Array(rows);
      var a_layer = new Array(rows);
      var ad_layer = new Array(rows);
      var len = a_last.length;
      z_cell[layer] = z_layer;
      a_cell[layer] = a_layer;
      ad_cell[layer] = ad_layer;
      for(var i=0;i<rows;i++){
        var z_layer_i = new Array(batch_size);
        var a_layer_i = new Array(batch_size);
        var ad_layer_i = new Array(batch_size);
        var W_layer_i = W_layer[i];
        var b_layer_i = b_layer[i];
        z_layer[i] = z_layer_i;
        a_layer[i] = a_layer_i;
        ad_layer[i] = ad_layer_i;
        for(var j=0;j<batch_size;j++){
          var tmp = 0;
          
          for(var k=0;k<len;k++)
            tmp += W_layer_i[k]*a_last[k][j];
          tmp += b_layer_i[0];
          z_layer_i[j] = tmp;
          a_layer_i[j] = 1 / (1+Math.exp(-tmp));
          z = Math.exp(-tmp);
          ad_layer_i[j] = z/(z + 1)**2;
        }
      }
      a_last = a_layer;
    }
    
    return {z:z_cell, a:a_cell, ad:ad_cell};
  }
  function get_delta(W_cell, b_cell, Y_c, z_cell, a_cell, ad_cell, L, batch_size, alpha){
    /*
     * cd[l].row = a[l].row
     * cd[l].col = a[l].col
     * 
     */
    var cd_cell = new Array(L);
    var a_L = a_cell[L-1];
    var a_L_rows = a_L.length;
    var cd_L = new Array(a_L_rows);
    cd_cell[L-1] = cd_L;
    for(var i=0;i<a_L_rows;i++){
      var cd_L_i = new Array(batch_size);
      var a_L_i = a_L[i];
      var Y_c_i = Y_c[i];
      cd_L[i] = cd_L_i;
      for(var j=0;j<batch_size;j++){
        cd_L_i[j] = a_L_i[j] - Y_c_i[j];
      }
    }
    var cd_next = cd_L;
    for(var layer=L-2;layer>=1;layer--){
      var cd_next_row = cd_next.length;
      var b_layer = b_cell[layer];
      var W_layer = W_cell[layer];
      var W_next = W_cell[layer+1];
      var W_layer_rows = W_layer.length;
      var W_layer_cols = W_layer[0].length;
      var a_last = a_cell[layer-1];
      var ad_next = ad_cell[layer+1];
      var ad_layer = ad_cell[layer];
      var cd_layer = new Array(W_layer_rows);
      cd_cell[layer] = cd_layer;
      for(var i=0;i<W_layer_rows ;i++){
        var W_layer_i = W_layer[i];
        var ad_layer_i = ad_layer[i];
        var cd_layer_i = new Array(batch_size);
        cd_layer[i] = cd_layer_i;
        var cw_layer_i = new Array(W_layer_cols);
        for(var k=0;k<W_layer_cols;k++) cw_layer_i[k] = 0;
        var cb_tmp = 0;
        for(var j=0;j<batch_size;j++){
          var tmp = 0;
          for(var g=0;g<cd_next_row;g++)
            tmp += cd_next[g][j] * ad_next[g][j] * W_next[g][i];
          cd_layer_i[j] = tmp;
          
          //grad
          tmp = tmp * ad_layer_i[j];
          cb_tmp += tmp;
          for(var k=0;k<W_layer_cols;k++){
            cw_layer_i[k] += tmp * a_last[k][j];
          }
        }
        //grad
        b_layer[i][0] -= alpha * cb_tmp;
        for(var k=0;k<W_layer_cols;k++){
          W_layer_i[k] -= alpha * cw_layer_i[k];
        }
      }
      cd_next = cd_layer;
    }
  }
  function _sample_matrix(mat, mat_c){
    var T = transposeMatrix(mat);
    var rows = mat.length,
        dec = mat[0].length- 1;
    var cols_c = mat_c[0].length;
    for(var i=0;i<cols_c;i++){
      var c = randint(0,dec);
      var ary = T.splice(c,1)[0];
      dec--;
      for(var j=0;j<rows;j++){
        mat_c[j][i] = ary[j];
      }
    }
  }
  function _run(X,Y,W_cell,b_cell,alpha,tol,iter,batch_size){
    var record_list = [];
    var L = W_cell.length;
    var X_row = X.length , Y_row = Y.length;
    var X_c = initMatrix(X_row, batch_size),
        Y_c = initMatrix(Y_row, batch_size);
    for(var _iter=0;_iter<iter;_iter++){
      _sample_matrix(X, X_c);
      _sample_matrix(Y, Y_c);
      var z_cell, a_cell, ad_cell;
      var res;
      res = get_z_a_aa(W_cell, b_cell, X_c, L, batch_size);
      z_cell = res.z;
      a_cell = res.a;
      ad_cell = res.ad;
      get_delta(W_cell, b_cell, Y_c, z_cell, a_cell, ad_cell, L, batch_size, alpha);
      var predict_Y = _predict(X, W_cell, b_cell, L, batch_size);
      var tmp = _cost(Y, predict_Y, Y_row, batch_size);
      record_list.push(tmp);
      if(tmp <= tol) return record_list; 
    }
    return record_list;
  }
  function _predict(X, W_cell, b_cell, L, batch_size){
    var a_last = X;
    for(var layer=1;layer<L;layer++){
      var W_layer = W_cell[layer];
      var b_layer = b_cell[layer];
      var rows = W_layer.length;
      var len = a_last.length;
      var a_layer = new Array(rows);
      for(var i=0;i<rows;i++){
        var a_layer_i = new Array(batch_size);
        var W_layer_i = W_layer[i];
        a_layer[i] = a_layer_i;
        for(var j=0;j<batch_size;j++){
          var tmp = 0;
          for(var k=0;k<len;k++){
            tmp += W_layer_i[k] * a_last[k][j];
          }
          tmp += b_layer[i][0];
          a_layer_i[j] = 1 / (1+Math.exp(-tmp));
        }
      }
      a_last = a_layer;
    }
    return a_last;
  }
  function _cost(Y, predict_Y, Y_row, batch_size){
    var res = 0;
    for(var i=0;i<Y_row;i++){
      var p_Y_i = predict_Y[i];
      var Y_i = Y[i];
      for(var j=0;j<batch_size;j++){
        res += (p_Y_i[j] - Y_i[j])**2;
      }
    }
    return 0.5*res;
  }
  function _munize(mat, adder, muler){
    var rows = mat.length;
    var cols = mat[0].length;
    var res = new Array(rows)
    for(var i=0;i<rows;i++){
      res[i] = new Array(cols);
      for(var j=0;j<cols;j++){
        var tmp = mat[i][j];
        res[i][j] = (tmp-adder)/muler;
      }
    }
    return res;
  }
  function _unize(mat){
    var rows = mat.length;
    var cols = mat[0].length;
    var max = Number.NEGATIVE_INFINITY;
    var min = Number.POSITIVE_INFINITY;
    var adder, muler;
    for(var i=0;i<rows;i++){
      for(var j=0;j<cols;j++){
        var tmp = mat[i][j];
        max = max>tmp?max:tmp;
        min = min<tmp?min:tmp;
      }
    }
    muler = max - min;
    adder = min;
    
    return {mat:_munize(mat, adder, muler), add:adder, mul:muler};  
  }
  function _ununize(mat, adder, muler){
    var rows = mat.length;
    var cols = mat[0].length;
    var res = new Array(rows);
    for(var i=0;i<rows;i++){
      res[i] = new Array(cols);
      for(var j=0;j<cols;j++){
          var tmp = mat[i][j];
          res[i][j] = tmp*muler + adder;
      }
    }
    return res;
  }
  function _2XYmat(X, Y){
    var X_rows = X.length, Y_rows = Y.length;
    var X_cols = X[0].length, Y_cols = Y[0].length;
    if(X_cols == Y_cols) {
      return {X:X, Y:Y, t:0};
    }else if(X_rows == Y_rows){
      return {X:transposeMatrix(X), Y:transposeMatrix(Y), t:1};
    }else{
      return {t:-1};
    }
  }
  function _back2XYmat(X, Y, t){
    if(t) return {X:transposeMatrix(X), Y:transposeMatrix(Y)};
    return {X:X , Y:Y};
  }
})(window);
