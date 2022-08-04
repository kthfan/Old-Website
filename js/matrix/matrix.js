

var Matrix;
;(function(window,undefined){
    Matrix = function(list){
        this.shape = Matrix.shape(list);
        this.matrix = list;
    }
    Object.defineProperties(Matrix.prototype, {
        transpose:{
            value:function(){
                var list = this.matrix;
                return new Matrix();
            }
        }
    });
    Matrix.shape = function(mat){
        var tmp = mat;
        var dim = [];
        while(tmp && tmp.hasOwnProperty("length")){
            dim.push(tmp.length);
            tmp = tmp[0];
        }
        return dim;
    }
})(window);