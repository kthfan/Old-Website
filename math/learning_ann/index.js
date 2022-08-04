





let topBarElem = document.getElementById("top-bar");
let mainCanvasElem = document.getElementById("main-canvas");
let nextBnElem = document.getElementById("next-bn");
let ageElem = document.getElementById("age");
let bmiElem = document.getElementById("bmi");
let smokeYesElem = document.getElementById("smoke-yes");
let smokeNoElem = document.getElementById("smoke-no");
let mainCtx = mainCanvasElem.getContext('2d');



let canvasManager = new CanvasManager(mainCanvasElem);
let funcQueue = [];
let inputVector = [30.0,20.0,0.00];

// let dense1 = new Dense([[1,2], [3,4]], [5,6])
// canvasManager.addNode(dense1, {x:590, y:590});
let model = new Sequential([
    new Input([3]),
    new Dense([[ 0.54448235,  0.73711884,  0.03369188],
        [ 0.07692566, -0.45660436, -0.61830187],
        [ 0.18446828,  0.6444863 ,  0.33772564],
        [ 0.76869965,  0.32807454,  0.99639845]],
        [ 0.09075098, -0.5693767 , -0.4173927 ,  0.10936146]),
    new Dense([[ 0.09075098, -0.5693767 , -0.4173927 ,  0.10936146]],
            [ -1.4769733]),
    new Activation('sigmoid')
        
]);
canvasManager.addNode(model, {x:50, y:50});
// funcQueue = [...funcQueue, ...model.forward([30.0,20.0,0.00])];


function startForward(){
    let age = Number.parseFloat(ageElem.value); 
    let bmi = Number.parseFloat(bmiElem.value); 
    let smoke = smokeYesElem.checked ? 1 : 0;
    if(Number.isNaN(age) || Number.isNaN(bmi)) return;
    funcQueue = model.forward([age, bmi, smoke]);
}

// ageElem.addEventListener("change", ()=>{
//     let val = Number.parseFloat(ageElem.value); 
//     if(Number.isNaN(val)) return;
//     inputVector[0] = val;
//     canvasManager.update();
// });
// bmiElem.addEventListener("change", ()=>{
//     let val = Number.parseFloat(bmiElem.value); 
//     if(Number.isNaN(val)) return;
//     inputVector[1] = val;
//     canvasManager.update();
// });
// smokeYesElem.addEventListener("click", ()=>{
//     if(smokeYesElem.checked) inputVector.vector[2] = 1;
//     else inputVector[2] = 0;
//     canvasManager.update();
// });
// smokeNoElem.addEventListener("click", ()=>{
//     if(smokeYesElem.checked) inputVector[2] = 1;
//     else inputVector[2] = 0;
//     canvasManager.update();
// });

// canvasManager.addNode(new VerticalNode([5, 6]), {x:590, y:590});
nextBnElem.addEventListener('click', ()=>{
    if(funcQueue.length === 0){
        startForward();
    }
    func = funcQueue.shift();
    mainCtx.clearRect(0, 0, mainCanvasElem.width, mainCanvasElem.height);
    func();
    canvasManager.update();
});

window.onresize = ()=> {
    mainCanvasElem.width = window.innerWidth*1.2;
    mainCanvasElem.height = window.innerHeight;
    canvasManager.update();
}
window.onresize();












