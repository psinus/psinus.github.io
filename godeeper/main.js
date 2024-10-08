


let divLog = document.getElementById('log');
let dpi_x = document.getElementById('dpi').offsetWidth;
let dpi_a = window.devicePixelRatio;
let dpi = dpi_x * dpi_a;
// console.log("DPI: ", dpi);
document.body.style.backgroundColor = '#ffffff';
const _scale1 = 96;
const scale = dpi / _scale1;
// divLog.innerHTML = "dpi: " + dpi.toString() + ", scale: " + scale.toString();
let font1 = new FontFace("font1", "url(asset/font2.ttf)");
document.fonts.add(font1);
let images = new Map();
let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = '#ff0000';
let ctx = canvas.getContext('2d');



let notScaledCanvas = document.createElement('canvas');
let notScaledCtx = notScaledCanvas.getContext('2d');

let box = document.getElementById('box');
box.style.width = window.innerWidth;
box.style.height = window.innerHeight;

let ratioCanvasUnscaledX = scale;
let ratioCanvasUnscaledY = scale;

var center = function () {
    // screen.orientation.lock('landscape');
    let ratioX = box.offsetWidth / canvas.offsetWidth;
    let ratioY = box.offsetHeight / canvas.offsetHeight;

    if(ratioX < ratioY){
            canvas.width = canvas.offsetWidth * ratioX;
            canvas.height = canvas.offsetHeight * ratioX;
    
    }else{
            canvas.width = canvas.offsetWidth * ratioY;
            canvas.height = canvas.offsetHeight * ratioY;
    
    }
    canvas.style.marginTop = (window.innerHeight - canvas.offsetHeight) / 2 + 'px';
    canvas.style.marginLeft = (window.innerWidth - canvas.offsetWidth) / 2 + 'px';

    ratioCanvasUnscaledX = canvas.offsetWidth / notScaledCanvas.width;
    ratioCanvasUnscaledY = canvas.offsetHeight / notScaledCanvas.height;
    
};
window.addEventListener('resize', center);


function fullScreen() {
    if (box.requestFullscreen) {
        box.requestFullscreen();
    }else if(box.webkitRequestFullscreen){
         box.webkitRequestFullscreen();    
    }else if(box.mozRequestFullscreen){
         box.mozRequestFullscreen();
    }
}
let data = new Uint8Array(1);
function renderPresent() {
    if (ctx != null) {
        ctx.drawImage(notScaledCanvas, 0, 0, notScaledCanvas.width, notScaledCanvas.height, 0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
    }
}

class WsEvent {
    constructor() {
        this.kind = 0;
        this.crdx = 0;
        this.crdy = 0;
        this.btnN = 0;
        this.key = "";
        this.keyMode = { shift: 0, ctrl: 0 };
    }
    clear() {
        this.kind = 0;
        this.crdx = 0;
        this.crdy = 0;
        this.btnN = 0;
        this.key = "";
        this.keyMode.shift = 0;
        this.keyMode.ctrl = 0;
    }
    send(exp) {
        
        this.crdx = this.crdx / ratioCanvasUnscaledX;
        this.crdy = this.crdy / ratioCanvasUnscaledY;
         if (this.kind == 1 || this.kind == 2) {
            exp.WsSetDataEvent(0, this.kind);
            exp.WsSetDataEvent(1, this.crdx);
            exp.WsSetDataEvent(2, this.crdy);
            exp.WsSetDataEvent(3, this.btnN);
        }
        else if (this.kind == 3) {
            exp.WsSetDataEvent(0, this.kind);
            exp.WsSetDataEvent(1, this.crdx);
            exp.WsSetDataEvent(2, this.crdy);
        }
        else if (this.kind == 6 || this.kind == 7) {
            exp.WsSetDataEvent(0, this.kind);
            let key = 0;
            if (this.key == 'ArrowLeft') {
                key = 80;
            }
            else if (this.key == 'ArrowRight') {
                key = 79;
            }
            else if (this.key == 'ArrowUp') {
                key = 82;
            }
            else if (this.key == 'ArrowDown') {
                key = 81;
            }
            else if (this.key == 'Backspace') {
                key = 42;
            }
            else if (this.key == 'Enter') {
                key = 40;
            }
            else if (this.key == 'Shift') {
                if (this.kind == 6) {
                    this.keyMode.shift = 1;
                }
                else {
                    this.keyMode.shift = 0;
                }
            }
            else if (this.key == 'Control') {
                if (this.kind == 6) {
                    this.keyMode.ctrl = 1;
                }
                else {
                    this.keyMode.ctrl = 0;
                }
            }
            else if (this.key.length == 1) {
                let k = this.key.charCodeAt(0);
                if (k >= 65 && k <= 90) {
                    key = k + 32;
                }
                else if (k >= 97 && k <= 122) {
                    key = k;
                }
                else if (k >= 48 && k <= 57) {
                    key = k;
                }
            }
            exp.WsSetDataEvent(1, key);
            exp.WsSetDataEvent(2, this.keyMode.shift);
            exp.WsSetDataEvent(3, this.keyMode.ctrl);
        }
        else {
            exp.WsSetDataEvent(0, 0);
        }
        this.clear();
    }
}

let isMobile = false;

function startMobile(){

    startGame();
    // canvas.removeEventListener('touchstart');
    
    canvas.addEventListener('touchstart', (event)=>{
        wsEvent.kind = 1;
        wsEvent.crdx = event.changedTouches[0].screenX - canvas.offsetLeft;
        wsEvent.crdy = event.changedTouches[0].clientY - canvas.offsetTop;
        wsEvent.btnN = event.button;
    
    });
    canvas.addEventListener('touchend', (event)=>{
        wsEvent.kind = 2;
        wsEvent.crdx = event.changedTouches[0].screenX - canvas.offsetLeft;
        wsEvent.crdy = event.changedTouches[0].clientY - canvas.offsetTop;
        wsEvent.btnN = event.button;
    
    });
    canvas.addEventListener('touchmove', (event)=>{
        wsEvent.kind = 3;
        wsEvent.crdx = event.changedTouches[0].screenX - canvas.offsetLeft;
        wsEvent.crdy = event.changedTouches[0].clientY - canvas.offsetTop;
    
    });
}


let wsEvent = new WsEvent();
{
    if('ontouchstart' in document.documentElement){
        canvas.addEventListener('touchstart', (event)=>{
            if(!isMobile){
                startMobile();
                isMobile = true;
            }            
        });
        // ctx.font = '48px Arial';
        // ctx.fillText("Touch to Start");
    }else{
        canvas.addEventListener('mousedown', (event) => {
            wsEvent.kind = 1;
            wsEvent.crdx = event.offsetX;
            wsEvent.crdy = event.offsetY;
            wsEvent.btnN = event.button;
        
        });
        canvas.addEventListener('mouseup', (event) => {
            wsEvent.kind = 2;
            wsEvent.crdx = event.offsetX;
            wsEvent.crdy = event.offsetY;
            wsEvent.btnN = event.button;
        });
        canvas.addEventListener('mousemove', (event) => {
            wsEvent.kind = 3;
            wsEvent.crdx = event.offsetX;
            wsEvent.crdy = event.offsetY;
        });
        startGame();
    }
    document.addEventListener('keydown', (event) => {
        wsEvent.kind = 6;
        wsEvent.key = event.key;
        // console.log(event.code);
    });
}

let client = null;


function startGame(){
    let request = new XMLHttpRequest();
    request.open("GET", "game.wasm");
    request.responseType = 'arraybuffer';
    request.send();
    let countAwait = 0;

    request.onload = function () {
        let bytes = request.response;
        WebAssembly.instantiate(bytes, { env: {
                JsDraw: function (idImage, sx, sy, sw, sh, dx, dy, dw, dh) {
                    if (notScaledCtx != null) {
                        notScaledCtx.drawImage(images[idImage], sx, sy, sw, sh, dx, dy, dw, dh);
                    }
                },
                JsPrint: function (s) {
                    let text = new TextDecoder().decode(data);
                    divLog.innerHTML = text;
                    console.log(text);
                },
                JsAlloc: function (size) {
                    data = new Uint8Array(size);
                },
                JsSetData: function (idx, val) {
                    data[idx] = val;
                },
                JsSetDrawColor: function (r, g, b, a) {
                    if (ctx != null) {
                        ctx.fillStyle = "#000000";
                    }
                },
                JsClearCanvas: function () {
                    if (ctx != null) {
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                },
                JsImageFromFile: function (idImage) {
                    let path = new TextDecoder().decode(data);
                    let image = new Image();
                    image.src = path;
                    images[idImage] = image;
                    countAwait += 1;
                    image.onload = function () {
                        countAwait -= 1;
                        
                    };
                },
                JsSetImageAlpha: function (idImage, alpha) {
                    let image = images[idImage].getContext('2d');
                    image.globalAlpha = alpha;
                },
                JsDestroyImage: function (idImage) {
                    images.delete(idImage);
                },
                JsQueryImage: function (idImage, query) {
                    let image = images[idImage];
                    let result = 0;
                    if (query == 0) {
                        result = image.width;
                    }
                    else if (query == 1) {
                        result = image.height;
                    }
                    return result;
                },
                JsImageEmpty: function (idImage, w, h) {
                    let image = document.createElement('canvas');
                    image.width = w;
                    image.height = h;
                    images[idImage] = image;
                },
                JsFillRect: function (idImage, dx, dy, dw, dh, r, g, b, a) {
                    let image = images[idImage].getContext('2d');
                    image.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    image.globalAlpha = a;
                    image.fillRect(dx, dy, dw, dh);
                },
                JsImageDraw: function (idSrcImage, idDstImage, sx, sy, sw, sh, dx, dy, dw, dh) {
                    let srcImage = images[idSrcImage];
                    let dstImage = images[idDstImage].getContext('2d');
                    dstImage.drawImage(srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
                },
                JsFontFromFile: function (idFont, size) { },
                JsMeasureText: function (idFont, query) {
                    let result = 0;
                    if (notScaledCtx != null) {
                        let text = new TextDecoder().decode(data);
                        let n = notScaledCtx.measureText(text);
                        if (query == 0) {
                            result = n.width;
                        }
                        else if (query == 1) {
                            result = 12;
                        }
                    }
                    return result;
                },
                JsDrawText: function (idFont, idImage, r, g, b, a) {
                    let text = new TextDecoder().decode(data);
                    let image = images[idImage].getContext('2d');
                    image.font = "16px sans-serif";
                    image.textAlign = "left";
                    image.textBaseline = "top";
                    image.globalAlpha = a;
                    image.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    image.fillText(text, 0, 0);
                },
                JsGetTimestamp: function () {
                    let n = Date.now() / 1000;
                    return n;
                },
                JsClientSend(){
                    client.send(data.buffer);
                }
                
             } }).then(result => {
            let exp = result.instance.exports;
            const encoder = new TextEncoder();
            const str = encoder.encode("Hello");
            // exp.WsAlloc(3);
            // exp.WsSetData(0, 10);
            // exp.WsSetData(1, 100);
            // exp.WsSetData(2, 999);
            function Main() {
                document.oncontextmenu = () => {
                    return false;
                };
                if(isMobile){
                    fullScreen();
                   
                }
                ctx.imageSmoothingEnabled = false;
                notScaledCtx.imageSmoothingEnabled = false;   
                 const maxDimX = 23;
                const maxDimY = 17;
                let sqr = 32 * scale;
                let dimX = Math.floor(window.innerWidth / sqr);
                if (dimX > maxDimX) {
                    dimX = maxDimX;
                }else if(dimX < 13){dimX = 13;}
            
                let dimY = Math.floor(window.innerHeight / sqr);
                if (dimY > maxDimY) {
                    dimY = maxDimY;
                }else if(dimY < 7){dimY = 7;}
                // divLog.innerHTML += dimX.toString() + ", " + dimY.toString();
                let borderW = 3 * scale;
                const FRAME_RATE = 50;
                let width = (dimX * sqr + (2 * borderW));
                let height = (dimY * sqr + (2 * borderW));
                canvas.width = width;
                canvas.height = height;
                notScaledCanvas.width = dimX * 32 + (2 * 3);
                notScaledCanvas.height = dimY * 32 + (2 * 3);

            
                let requestAnimFrame = (function () {
                    return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.onRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function (callback, element) {
                            window.setTimeout(callback, 1000 / FRAME_RATE);
                        };
                })();

                let dataClientRecv = new Array(0);
                
                client = new WebSocket('http://127.0.0.1:9000');
                // client.send(data.buffer);
                
                client.addEventListener
                client.onopen = function(){
                    // client.send('Hello');
                }
                client.onmessage = function(ev){
                    dataClientRecv.push(new Uint8Array(ev.data));
                }

                
                exp.WsInitStage1(notScaledCanvas.width, notScaledCanvas.height);
                let lastTime = 0;
                notScaledCtx.font = "16px sans-serif";
                notScaledCtx.textAlign = "left";
                notScaledCtx.textBaseline = "top";
                center();
                let GameCycle = () => {
                    if (countAwait == 0) {
                        exp.WsInitStage2();

                        ctx.fillStyle = "#000000";
                        ctx.fillRect(0, 0, width, height);
                        wsEvent.send(exp);
                        exp.WsUpdate();

                        let clientRecv = dataClientRecv.splice(0, dataClientRecv.length);
                        for(let i = 0; i < clientRecv.length; i++){
                        
                            const recv = clientRecv[i];
                            exp.WsAllocDataClient(recv.length);
                            for(let i = 0; i < recv.length; i++){
                                exp.WsSetDataClient(i, recv[i]);
                            }    
                            exp.WsClientRecv();
                        }
                        renderPresent();
                        
                    }
                    requestAnimFrame(GameCycle);
                };
                GameCycle();
            }
            Main();
        });
    };
}
