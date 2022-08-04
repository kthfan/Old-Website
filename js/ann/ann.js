


/** 
 * Ann {Object}
 * Provides members and operations of artificial neural networks.
 * @property {Integer}  layer
 * @property {Matrixies}   W_cell
 * @property {Matrixies}   b_cell
 * @property {Matrix}   X
 * @property {Matrix}   Y
 * @property {Number}   alpha
 * @property {Integer}  iter
 * @property {Number}   tol
 * @property {Boolean}  checkCost
 * @property {Boolean}  record
 * @property {Function} gen_Wb
 * @property {Function} predict
 * @property {Function} cost
 * @property {Function} run
 * @property {Function} randomMatrix
 * @property {Function} cleanResult
*/
ANN = function(){/////////////////////////////////local//////////////////////////////////////

return new function(){

var i,j,k,layer;
var L,rows,len,cols,W_row_n,W_col_n ,b_row_n;
var W,W1,A,Z,b,delta,Z,delta1,Ad;
var a_1,a_L,z_L,a_ary,z_ary,Ad_ary,ary,z,tmp;
var W_cell,b_cell,z_cell,a_cell,delta_cell,Ad_cell;
var alpha,res,iter,tol,checkCost,record_list,record;
var X,Y;
var std, avg, muler, adder;

Object.defineProperties(this,{
    /**
     * Numberof layers for weight and bias matrixies.
     */
    layer:{
        get:function(){
            return L-1;
        },set:function(arg){
            arg = parseInt(arg);
            if(!isNaN(arg)) L = arg+1;
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
            return W_cell;
        },set:function(arg){
            W_cell = arg;
        }
    },
    /**Matrixies for bias. Same as W_cell. */
    b_cell:{
        get:function(){
            return b_cell;
        },set:function(arg){
            b_cell = arg;
        }
    },
    /**Step for gradient descent. */
    alpha:{
        get:function(){
            return alpha;
        },set:function(arg){
            arg = Number(arg);
            if(!isNaN(arg)) alpha = arg;
        }
    },X:{
        get:function(){
            return X;
        },set:function(arg){
            X = arg;
        }
    },Y:{
        get:function(){
            return Y;
        },set:function(arg){
            Y = arg;
        }
    },
    /** Iteration number.*/
    iter:{
        get:function(){
            return iter;
        },set:function(arg){
            arg = parseInt(arg);
            if(!isNaN(arg)) iter = arg;
        }
    },
    /**
     * Generate W_cell and b_cell.
     * @param   {Integer}   arg Number of layers.
     */
    gen_Wb:{
        value:function(arg){
            Ann.layer = arg;
            return gen_Wb();
        }
    },
    /**
     * Returns the cost. 
     * @param   {Matrix}    argx    Ann.X
     * @param   {Matrix}    argy    Ann.Y
     * 
     * @returns {Number}    The cost.
    */
    cost:{
        value:function(argx,argy){
            var _rt,_tmp=[X,Y];
            X = argx || X;
            Y = argy || Y;
            _rt = cost();
            X = _tmp[0];
            Y = _tmp[1];
            return _rt;
        }
    },
    /**
     * Returns the result of prediction.
     * @param   {Matrix}    argy    Ann.Y
     * 
     * @returns {Matrix}    The predicted Y.
    */
    predict:{
        value:function(argx){
            var _rt,_tmp=X;
            X = argx || X;
            _rt = predict();
            _rt = ununize(_rt);
            X = _tmp;
            return _rt;
        }
    },
    /**
     * Find the weight and bias to minimize Y.
     * @param   {Object}    arg             JSON format.
     * @param   {Matrix}    arg.X           Optional.
     * @param   {Matrix}    arg.Y           Optional.
     * @param   {Matrixies} arg.W_cell      Optional.
     * @param   {Matrixies} arg.b_cell      Optional.
     * @param   {Integer}   arg.layer       Optional.
     * @param   {Number}    arg.alpha       Optional.
     * @param   {Integer}   arg.iter        Optional.
     * @param   {Number}    arg.tol         Optional.
     * @param   {Boolean}   arg.checkCost   Optional.
     * @param   {Boolean}   arg.record      Optional.
     * 
     * @returns {Boolean || Array}  If Boolean, true means iteration stops before maximum iteration reached.
     */
    run:{
        value:function(arg){
            var _rt,_tmp = [alpha,iter,tol,checkCost,record];
            arg = arg || {};
            X = arg.X || X || [];
            Y = arg.Y || Y || [];
            L = arg.layer || L || 4;
            W_cell = arg.W_cell || W_cell;
            b_cell = arg.b_cell || b_cell;
            alpha = arg.alpha || alpha || 0.5;
            iter = arg.iter || iter || 100;
            tol = arg.tol || tol || 1e-5;
            checkCost = arg.checkCost?true:checkCost;
            record = arg.record?true:record;
            if(record){
                record_list = [];
            }
            if(arg.cleanResult) W_cell=null,b_cell=null;
            if(!b_cell || !W_cell)
                gen_Wb();
            Y = unize(Y);
            //_rt = run_iteration();
            _rt = run_iteration2();
            Y = ununize(Y);
            alpha = _tmp[0];
            iter = _tmp[1];
            tol = _tmp[2];
            checkCost = _tmp[3];
            record = _tmp[4];
            return _rt;
        }
    },
    /**Clear the result from Ann.run() */
    cleanResult:{
        value:function(){W_cell=null;b_cell=null;}
    },
    /**
     * Get 2D matrix with random value.
     * @param   {Integer}   arg_row Number of rows.
     * @param   {Integer}   arg_col Number of columns.
     * 
     * @returns {Matrix}
     */
    randomMatrix:{
        value:function(arg_row,arg_col){
            var _rt,_tmp = [rows,cols];
            rows = arg_row || rows;
            cols = arg_col || cols;
            _rt = gen_randmat();
            rows = _tmp[0];
            cols = _tmp[1];
            return _rt;
        }
    },
    /**Tolerance of cost. */
    tol:{
        get:function(){
            return tol;
        },set:function(arg){
            arg = Number(arg);
            if(!isNaN(arg)) tol = arg;
        }
    },
    /**If true, check the cost. */
    checkCost:{
       get:function(){
            return checkCost?true:false;
        },set:function(arg){
            if(arg) checkCost = true;
        } 
    },
    /**
     * If true, record the cost, and Ann.run() returns a Array.
     * If false, Ann.run() returns Boolean.
     */
    record:{
       get:function(){
            return record?true:false;
        },set:function(arg){
            if(arg) record = true;
        } 
    },
    /** Normalize a matrix.*/
    normalize:{
        value:function(arg){
            normalize(arg);
        }
    },
    /** Unnormalize a matrix.*/
    unnormalize:{
        value:function(arg){
            unnormalize(arg);
        }
    }
});
//X = [[1,0.2,3.1,3,2],[2,1.1,3,2,3]];
//Y = [[0.52,0.2,0.1,0.3,1],[0.2,0.2,0.1,0.5,1]];

//L = 5;
//alpha = 0.5;

function gen_Wb(){
  W_cell = new Array(L);
  b_cell = new Array(L);
  cols = X.length;
  rows = 2+Math.ceil(Math.random()*8);
  for(layer=1;layer<L-1;layer++){
    W_cell[layer] = gen_randmat();
    cols = 1;
    b_cell[layer] = gen_randmat();
    cols = rows;
    rows = 2+Math.ceil(Math.random()*8);
  }
  rows = Y.length;
  W_cell[layer] = gen_randmat();
  cols = 1;
  b_cell[layer] = gen_randmat();
}
function gen_randmat(){
  res = new Array(rows);
  for(i=0;i<rows;i++){
    ary = new Array(cols);
    res[i] = ary;
    for(j=0;j<cols;j++){
      ary[j] = Math.random();
    }
  }
  return res;
}
function cost(){
  //0.5*norm(y - a_L)
  predict();
  res = 0;
  rows = Y.length,cols = Y[0].length;
  for(j=0;j<cols;j++){
    for(i=0;i<rows;i++){
      res += (Y[i][j] - a_1[i][j])**2;
    }
  }
  return 0.5*res**0.5;
}
function predict(){
  a_1 = X;
  for(layer=1;layer<L;layer++){
    W = W_cell[layer], b = b_cell[layer];
    rows = W.length, len = a_1.length, cols = a_1[0].length;
    A = new Array(rows);
    for(i=0;i<rows;i++){
      a_ary = new Array(cols);
      A[i] = a_ary;
      for(j=0;j<cols;j++){
        tmp = 0;
        for(k=0;k<len;k++){
          tmp += W[i][k] * a_1[k][j];
        }
        tmp += b[i][0];
        a_ary[j] = 1 / (1+Math.exp(-tmp));
      }
    }
    a_1 = A;
  }
  return a_1;
}
function unize(mat){
    var rows = mat.length;
    var cols = mat[0].length;
    var max = Number.NEGATIVE_INFINITY;
    var min = Number.POSITIVE_INFINITY;
    var res = new Array(rows);
    for(var i=0;i<rows;i++){
        res[i] = new Array(cols);
        for(var j=0;j<cols;j++){
            var tmp = mat[i][j];
            max = max>tmp?max:tmp;
            min = min<tmp?min:tmp;
        }
    }
    muler = max - min;
    adder = min;
    
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            var tmp = mat[i][j];
            res[i][j] = (tmp-adder)/muler;
        }
    }
    //console.log(res);
    return res;
    
}
function ununize(mat){
    var rows = mat.length;
    var cols = mat[0].length;
    var res = new Array(rows);
    //console.log(mat);
    for(var i=0;i<rows;i++){
        res[i] = new Array(cols);
        for(var j=0;j<cols;j++){
            var tmp = mat[i][j];
            res[i][j] = tmp*muler + adder;
        }
    }
    //console.log(res);
    return res;
}
function unnormalize(mat){
    var rows = mat.length;
    var cols = mat[0].length;
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            var tmp = mat[i][j];
            mat[i][j] = (tmp - avg) / std;
            mat[i][j] = tmp*std + avg;
        }
    }
}
function normalize(mat){
    var rows = mat.length;
    var cols = mat[0].length;
    var c = 0;
    std = 0, avg = 0;
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            var tmp = mat[i][j];
            avg += tmp;
            std += tmp**2;
            c++;
        }
    }
    avg /= c;
    std /= c;
    std = (std - avg**2)**0.5;
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            var tmp = mat[i][j];
            mat[i][j] = (tmp - avg) / std;
        }
    }
}
function run_iteration2(){
    
    for(var _i=0;_i<iter;_i++){
        a_cell = new Array(L), z_cell = new Array(L), Ad_cell = new Array(L);
        a_1 = X;
        a_cell[0] = a_1;
        for(layer=1;layer<L;layer++){
            W = W_cell[layer], b = b_cell[layer];
            rows = W.length, len = a_1.length, cols = a_1[0].length;
            Z = new Array(rows), A = new Array(rows), Ad = new Array(rows);
            for(i=0;i<rows;i++){
            a_ary = new Array(cols), z_ary = new Array(cols), Ad_ary = new Array(cols);
            A[i] = a_ary, Z[i] = z_ary, Ad[i] = Ad_ary;
            for(j=0;j<cols;j++){
                // wx + b
                tmp = 0;
                for(k=0;k<len;k++){
                    tmp += W[i][k] * a_1[k][j];
                }
                tmp += b[i][0];
                //
                z_ary[j] = tmp; //z
                a_ary[j] = 1 / (1+Math.exp(-tmp)); // active(z)
                z = Math.exp(-tmp); // diff_active(z)
                z = z/(z + 1)**2;   // diff_active(z)
                Ad_ary[j] = z;
            }
        }
        a_cell[layer] = A;
        z_cell[layer] = Z;
        Ad_cell[layer] = Ad;
        a_1 = A;
        }
        // partial c / partial a[L][x][y]
        delta_cell = new Array(L);
        z_L = Ad_cell[L-1], a_L = a_cell[L-1];
        rows=z_L.length, cols=z_L[0].length, delta = new Array(rows);
        for(i=0;i<rows;i++){
            ary = new Array(cols);
            delta[i] = ary;
            for(j=0;j<cols;j++){
                z = z_L[i][j];  //Ad
                ary[j] = (a_L[i][j] - Y[i][j]);
            }
        }
        delta_cell[L-1] = delta; //i=L
        for(layer=L-2;layer>=1;layer--){
            delta = new Array(rows);
            W1 = W_cell[layer+1];
            delta1 = delta_cell[layer+1];
            Z = Ad_cell[layer+1]; 
            rows = W1[0].length, len = W1.length, cols = delta1[0].length;
            for(i=0;i<rows;i++){
                ary = new Array(cols);
                delta[i] = ary;
                for(j=0;j<cols;j++){
                    tmp = 0;
                    for(k=0;k<len;k++){
                        tmp += delta1[k][j] * W1[k][i] * Z[k][j];
                    }
                    ary[j] = tmp;
                }
            }
            delta_cell[layer] = delta;
        }
        //grad
        len = X[0].length;
        for(layer=1;layer<L;layer++){
            //gradient c / gradient W
            W_row_n = W_cell[layer].length;
            for(j=0;j<W_row_n;j++){
                W_col_n = W_cell[layer][0].length;
                for(k=0;k<W_col_n;k++){
                    tmp = 0;
                    for(i=0;i<len;i++){
                        tmp += delta_cell[layer][j][i] * Ad_cell[layer][j][i] * a_cell[layer-1][k][i];
                    }
                    W_cell[layer][j][k] -= alpha* tmp;
                }
            }
            //gradient c / gradient b
            b_row_n = b_cell[layer].length;
            for(j=0;j<b_row_n;j++){
                tmp = 0;
                for(i=0;i<len;i++){
                    tmp += delta_cell[layer][j][i] * Ad_cell[layer][j][i];
                }
                b_cell[layer][j][0] -= alpha*tmp;
            }
        }
        if(checkCost===true) {
            tmp = cost();
            if(record) record_list.push(tmp);
            if(tmp <= tol) {
                if(record) return record_list;
                return true;
            }
        }
        
    }
    if(record) return record_list;
    return false;
}
function run_iteration(){
  for(var _i=0;_i<iter;_i++){
    //get a z
    a_cell = new Array(L), z_cell = new Array(L), Ad_cell = new Array(L);
    a_1 = X;
    a_cell[0] = a_1;
    for(layer=1;layer<L;layer++){
      W = W_cell[layer], b = b_cell[layer];
      rows = W.length, len = a_1.length, cols = a_1[0].length;
      Z = new Array(rows), A = new Array(rows), Ad = new Array(rows);
      for(i=0;i<rows;i++){
        a_ary = new Array(cols), z_ary = new Array(cols), Ad_ary = new Array(cols);
        A[i] = a_ary, Z[i] = z_ary, Ad[i] = Ad_ary;
        for(j=0;j<cols;j++){
          // wx + b
          tmp = 0;
          for(k=0;k<len;k++){
            tmp += W[i][k] * a_1[k][j];
          }
          tmp += b[i][0];
          //
          z_ary[j] = tmp; //z
          a_ary[j] = 1 / (1+Math.exp(-tmp)); // active(z)
          z = Math.exp(-tmp); // diff_active(z)
          z = z/(z + 1)**2;   // diff_active(z)
          Ad_ary[j] = z;
        }
      }
      a_cell[layer] = A;
      z_cell[layer] = Z;
      Ad_cell[layer] = Ad;
      a_1 = A;
    }
    //get delta
    //init delta[L-1] Ad[L-1].*(a[L-1] - y);
    delta_cell = new Array(L);
    z_L = Ad_cell[L-1], a_L = a_cell[L-1];
    rows=z_L.length, cols=z_L[0].length, delta = new Array(rows);
    for(i=0;i<rows;i++){
      ary = new Array(cols);
      delta[i] = ary;
      for(j=0;j<cols;j++){
        z = z_L[i][j];  //Ad
        ary[j] = z * (a_L[i][j] - Y[i][j]);
      }
    }
    delta_cell[L-1] = delta; //i=L
    //init delta[0~L-2] Ad[i].*(mtimes(transpose(W1), delta1));
    for(layer=L-2;layer>=1;layer--){
      delta = new Array(rows);
      W1 = W_cell[layer+1];
      delta1 = delta_cell[layer+1];
      Z = Ad_cell[layer];
      rows = W1[0].length, len = W1.length, cols = delta1[0].length;
      for(i=0;i<rows;i++){
        ary = new Array(cols);
        delta[i] = ary;
        for(j=0;j<cols;j++){
          tmp = 0;
          for(k=0;k<len;k++){
            tmp += W1[k][i] * delta1[k][j];
          }
          z = Z[i][j];  //Ad
          tmp *= z;
          ary[j] = tmp;
        }
      }
      delta_cell[layer] = delta;
    }
    //grad
    for(layer=1;layer<L;layer++){
      //gradient c / gradient W
      W_row_n = W_cell[layer].length;
      for(j=0;j<W_row_n;j++){
        W_col_n = W_cell[layer][0].length;
        for(k=0;k<W_col_n;k++){
          W_cell[layer][j][k] -= alpha* (delta_cell[layer][j][0] * a_cell[layer-1][k][0]);
        }
      }
    
      //gradient c / gradient b
      b_row_n = b_cell[layer].length;
      for(j=0;j<b_row_n;j++){
        b_cell[layer][j][0] -= alpha*delta_cell[layer][j][0];
      }
    }
    if(checkCost===true) {
        tmp = cost();
        if(record) record_list.push(tmp);
        if(tmp <= tol) {
            if(record) return record_list;
            return true;
        }
    } 
    //send back
    //postMessage([W_cell,b_cell]);
  }
  if(record) return record_list;
  return false;
}

}
}/////////////////////////////////local//////////////////////////////////////

onmessage = function(e) {
  var cmd = e.data[0];
  if(cmd === 1){
    X = e.data[1];
    Y = e.data[2];
  }else if(cmd === 2){
    L = e.data[1];
  }else if(cmd === 3){
    W_cell = e.data[1];
    b_cell = e.data[2];
  }else if(cmd === 4){
    alpha = e.data[1];
  }else if(cmd === 5){
    gen_Wb();
  }else if(cmd === 6){
    run_iteration();
  }
}





