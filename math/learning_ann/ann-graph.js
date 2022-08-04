

let GlobalVar = {};
GlobalVar.fontSize = 20;
GlobalVar.padding = 0.15;
GlobalVar.ROUND = 3;

let round = (d, r=GlobalVar.ROUND) => Math.round(d*10**r) / 10**r;
function roundVector(v, r=GlobalVar.ROUND){
    return v.map(e=>round(e, r));
}
function roundMatrix(m, r=GlobalVar.ROUND){
    return m.map(v=>roundVector(v, r));
}

async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
function roundRect(ctx, x, y, width, height, radius, borderColor='#000000', fillColor='#00ff00') {
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.strokeStyle = borderColor;
    ctx.fillStyle = fillColor;
    
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();

    
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = undefined;
    ctx.fillStyle = undefined;
}


class CanvasManager{
    constructor(canvas=undefined){
        if(canvas === undefined) canvas = mainCanvasElem;
        this.canvas = canvas;
        this.nodeList = [];
        this.nodePosList = [];
    }
    update(){
        for(let i=0; i<this.nodeList.length; i++){
            this.nodeList[i].render( this.nodePosList[i]);
        }
    }
    addNode(node, pos){
        if (! (node instanceof Array)) {
            node = [node];
            pos = [pos];
        }
        for(let i=0; i<node.length; i++){
            node[i].render(pos[i]);
            node[i].isManaged = true;
            this.nodeList.push(node[i]);
            this.nodePosList.push(pos[i]);
        }
    }
    removeNode(node){
        if (! (node instanceof Array)) {
            node = [node];
        }
        for(let i=0; i<node.length; i++){
            let index = this.nodeList.indexOf(node[i]);
            if (index === -1)  continue;
            node[i].isManaged = false;
            this.nodeList.splice(index, 1);
            this.nodePosList.splice(index, 1);
        }
    }
}

class VerticalNode{
    constructor(vector, canvas=undefined){
        if(canvas === undefined) canvas = mainCanvasElem;
        this.vector = roundVector(vector);
        this.canvas = canvas;
        this.maxEntryWidth = this.vector.map(e=>String(e).length).reduce((a, b)=> a>b?a:b);
        this.maxEntryWidth = (this.maxEntryWidth-1)*GlobalVar.fontSize*0.5 + GlobalVar.fontSize;
        this.width = this.maxEntryWidth;
        this.height = this.vector.length*GlobalVar.fontSize;
    }
    render(pos){
        let ctx = this.canvas.getContext('2d');
        let {x, y} = pos;
        let fontSize = GlobalVar.fontSize;
        let padding = GlobalVar.padding;
        if(Number.isNaN(x)) throw '';
        
        roundRect(ctx, x, y, this.width, this.height, undefined, undefined, "#ffff00");

        ctx.fillStyle = 'black';
        ctx.font = `${fontSize}px Arial`;
        let cumsum = - padding*fontSize + fontSize;
        for(let i=0; i<this.vector.length; i++){
            ctx.fillText(String(this.vector[i]), x + padding*fontSize, y + cumsum);
            cumsum += fontSize;
        }
        ctx.fillStyle = undefined;
    }
}
class HorizontalNode{
    constructor(vector, canvas=undefined){
        if(canvas === undefined) canvas = mainCanvasElem;
        this.vector = roundVector(vector);
        this.canvas = canvas;
        this.maxEntryWidth = this.vector.map(e=>String(e).length).reduce((a, b)=> a>b?a:b);
        this.maxEntryWidth = (this.maxEntryWidth-1)*GlobalVar.fontSize*0.5 + GlobalVar.fontSize;
        this.width = this.vector.length*this.maxEntryWidth;
        this.height = GlobalVar.fontSize;
    }

    render(pos){
        let ctx = this.canvas.getContext('2d');
        let {x, y} = pos;
        let fontSize = GlobalVar.fontSize;
        let padding = GlobalVar.padding;
        roundRect(ctx, x, y, this.width, this.height);

        ctx.fillStyle = 'black';
        ctx.font = `${fontSize}px Arial`;
        let cumsum = padding*fontSize;
        for(let i=0; i<this.vector.length; i++){
            ctx.fillText(String(this.vector[i]), x + cumsum, y + fontSize - padding*fontSize);
            cumsum += this.maxEntryWidth;
        }
        ctx.fillStyle = undefined;
    }
}

class Dense{
    constructor(weight, bias){
        this.weight = roundMatrix(weight);
        this.bias = roundVector(bias);

        this.weightNodeList = []
        this.biasNode = new VerticalNode(bias);
        for(let i=0; i<weight.length; i++){
            this.weightNodeList.push(new HorizontalNode(weight[i]));
        }
        this.maxEntryWidth = this.weightNodeList.map(e=>e.maxEntryWidth).reduce((a, b)=> a>b?a:b);
        this.width = this.weightNodeList.map(e=>e.width).reduce((a, b)=> a>b?a:b) + this.maxEntryWidth*5;
        this.height = 2.5*this.weightNodeList.length*GlobalVar.fontSize;
    }
    forward(inputNode, manager){
        if(manager === undefined) manager = canvasManager;
        if (this.lastPos === undefined) throw 'lastPos is undefined';
        let fontSize = GlobalVar.fontSize;
        let {x, y} = this.lastPos;
        let input = inputNode.vector;
        let weightedVector = [];
        let forwardFuncList = [];
        let tmpSumNodeList = [];
        let cumsum = 0;
        for(let i=0; i<this.weightNodeList.length; i++){
            let output = [];
            for(let j=0; j<input.length; j++){
                output.push(input[j] * this.weight[i][j]);
            }
            output = roundVector(output);
            weightedVector.push(round(output.reduce((a,b)=>a+b)));

            let tmpInputNode = new HorizontalNode(input);
            let tmpOutputNode = new HorizontalNode(output);
            let tmpSumNode = new HorizontalNode([weightedVector[i]]);
            tmpSumNodeList.push(tmpSumNode);
            forwardFuncList.push(() => {
                manager.addNode(tmpInputNode, {x, y:y+cumsum-fontSize});
            });
            forwardFuncList.push(() => {
                manager.addNode(tmpOutputNode, {x, y:y+cumsum+fontSize});
            });
            forwardFuncList.push(() => {
                manager.addNode(tmpSumNode, {x: x+this.width - 4.5*this.maxEntryWidth, y:y+cumsum+fontSize});
                cumsum += fontSize*2.5;
            });
            forwardFuncList.push(() => {
                manager.removeNode(tmpInputNode);
                manager.removeNode(tmpOutputNode);
            });
        }

        let tmpWeightedNode = new VerticalNode(weightedVector);
        let output = [];
        for(let i=0; i<weightedVector.length; i++) output.push(weightedVector[i] + this.bias[i]);
        let outputNode = new VerticalNode(output);
        forwardFuncList.push(() => {
            for(let tmpSumNode of tmpSumNodeList) manager.removeNode(tmpSumNode);
            manager.addNode(tmpWeightedNode, {
                x: x+this.width - 4.5*this.maxEntryWidth, 
                y: y + (this.height - fontSize*this.bias.length - fontSize) / 2
            });
        });
        forwardFuncList.push(() => {
            manager.addNode(outputNode, {
                x: x+this.width - 1.5*this.maxEntryWidth, 
                y: y + (this.height - fontSize*this.bias.length - fontSize) / 2
            });
        });
        forwardFuncList.push(() => {
            manager.removeNode(tmpWeightedNode);
        });
        return {funcList: forwardFuncList, outputNode};
    }
    render(pos){
        this.lastPos = pos;
        let {x, y} = pos;
        let fontSize = GlobalVar.fontSize;
        
        for(let i=0; i<this.weightNodeList.length; i++){
            this.weightNodeList[i].render({x:x, y:y+(fontSize*2.5)*i});
        }
        
        this.biasNode.render({
            x: x + this.width - this.maxEntryWidth*3, 
            y: y + (this.height - fontSize*this.bias.length - fontSize) / 2
        });
    }
}
class Input{
    constructor(inputShape){
        this.inputShape = inputShape;
        this.isFeeded = false;
        this.vector = Array.from(Array(this.inputShape[0])).map(()=>" ");
        this.inputNode = new VerticalNode(this.vector);
        this.width = this.inputNode.width;
        this.height = this.inputNode.height;
    }
    forward(vector, manager){
        if(manager === undefined) manager = canvasManager;
        if (this.lastPos === undefined) throw 'lastPos is undefined';
        this.vector = vector;
        this.isFeeded = true;
        this.inputNode.vector = this.vector;
        
        let forwardFuncList = [];
        forwardFuncList.push(()=>{
            this.render(this.lastPos);
        });
        return {funcList:forwardFuncList, outputNode:this.inputNode};
    }
    render(pos){
        this.lastPos = pos;
        if(!this.isFeeded) {
            this.inputNode.vector = Array.from(Array(this.inputShape[0])).map(()=>" ");
        }
        this.inputNode.render(pos);
    }
}
class Activation{
    constructor(funcName='sigmoid'){
        this.isFeeded = false;
        
        this.width = GlobalVar.ROUND*GlobalVar.fontSize;
        this.height = GlobalVar.fontSize;

        switch(funcName){
            case 'sigmoid':
                this.activation = v => Math.exp(v) / (1 + Math.exp(v));
                break;
            case 'tanh':
                this.activation = v => Math.tanh(v);
                break;
            case 'relu':
                this.activation = v => v > 0 ? v : 0;
                break;
            default:
                throw funcName;
                break;
        }
    }
    forward(inputNode, manager){
        if(manager === undefined) manager = canvasManager;
        if (this.lastPos === undefined) throw 'lastPos is undefined';
        this.isFeeded = true;
        let input = inputNode.vector;
        let output = [];
        for(let i=0; i<input.length; i++) output.push(this.activation(input[i]));
        let outputNode = new VerticalNode(output);

        let forwardFuncList = [];
        forwardFuncList.push(()=>{
            outputNode.render(this.lastPos);
        });

        return {funcList:forwardFuncList, outputNode:this.inputNode};
    }
    render(pos){
        this.lastPos = pos;
    }
}

class Sequential{
    constructor(layerList){
        this.layerList = layerList;
    }
    forward(vector, manager){
        if(manager === undefined) manager = canvasManager;
        let forwardFuncList = [];
        let outputNodeList = [];
        let input = vector;
        for(let i=0; i<this.layerList.length; i++){
            let {funcList, outputNode} = this.layerList[i].forward(input, manager);
            outputNodeList.push(outputNode);
            input = outputNode;
            forwardFuncList = [...forwardFuncList, ...funcList];
        }

        // let v = input.vector[0];
        // v = Math.exp(v) / (1 + Math.exp(v));
        // let actNode = new VerticalNode([v]);
        // forwardFuncList.push(()=>{
        //     actNode.render({x:1200, y:50});
        // });

        forwardFuncList.push(()=>{
            for(let outputNode of outputNodeList){
                manager.removeNode(outputNode);
            }
            // manager.removeNode(actNode);
        });

        return forwardFuncList;
    }
    render(pos){
        let {x, y} = pos;
        let cumsum = 0;
        let inputLayer = this.layerList[0];
        inputLayer.render({
            x:x + cumsum - 2*GlobalVar.fontSize,
            y: y + GlobalVar.fontSize
        });
        cumsum += inputLayer.width;
        for(let i=1; i<this.layerList.length; i++){
            this.layerList[i].render({
                x:x +cumsum,
                y
            });
            cumsum += this.layerList[i].width*0.9 + GlobalVar.fontSize*GlobalVar.ROUND;
        }
    }
}






