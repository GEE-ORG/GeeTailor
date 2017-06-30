!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):t.GeeTailor=i()}(this,function(){"use strict";function t(t,i){function s(t,i){Object.keys(i).forEach(function(n){if(n in t){var o=e(t[n]);"[object Object]"===o||"[object Array]"===o?(t[n]=Object.create(t[n]),s(t[n],i[n])):t[n]=i[n]}})}var n=Object.create(t);return s(n,i),n}function i(t){if("undefined"!=typeof Promise&&s(Promise))Promise.resolve().then(function(){t()}).catch(function(t){return console.error(t)});else if("undefined"==typeof MutationObserver||!s(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())setTimeout(t,0);else{var i=new MutationObserver(t),e=document.createTextNode(h+"");i.observe(e,{characterData:!0}),e.data=++h+"",h=0}}function e(t){return Object.prototype.toString.call(t)}function s(t){return/[native code]/.test(t.toString())}function n(t,i){return new Blob([t],{type:i})}function o(t){return URL.createObjectURL(t)}var h=0,r={width:200,height:200,mode:"free",maskType:"circle"};return function(){function e(e,s){this.dpr=window.devicePixelRatio||1,this.btns={},this.info={},this.svgMask=new Image,this.output=document.createElement("canvas"),this.outCtx=this.output.getContext("2d"),this.rectMaskWidth=0,this.isMoving=!1,this.isCropping=!1,this.hasChanged=!0,this.isScaling=!1,this.canvasNotBlank=!1,this.cropStartPoint={x:0,y:0},this.cropEndPoint={x:0,y:0},this.img=new Image,this.original={width:0,height:0},this.imgBounding={width:0,height:0,offsetX:0,offsetY:0},this.cropArea={x:0,y:0,width:0,height:0},this.el="string"==typeof e?document.querySelector(e):e,this.option=t(r,s),this.el.innerHTML='\n<div class="gt-canvas" style="display: inline-block">\n    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>\n    <input class="gt-upload" type="file" accept="image/jpg,image/png" style="display: none">\n    <button class="gt-ctrl_upload">Upload</button>\n    <div class="gt-info">\n        <span class="gt-info_size"></span>\n        <span class="gt-info_color"></span>\n    </div>\n</div>\n',i(this.init.bind(this))}return e.prototype.init=function(){var t=this;if(this.wrapper=this.el.querySelector(".gt-canvas"),this.info.size=this.el.querySelector(".gt-info_size"),this.info.color=this.el.querySelector(".gt-info_color"),this.canvas=this.el.querySelector(".gt-img"),this.upload=this.el.querySelector(".gt-upload"),this.btns.upload=this.el.querySelector(".gt-ctrl_upload"),this.ctx=this.canvas.getContext("2d"),this.mode=this.option.mode,this.canvasInit(),"avatar"===this.mode)if("circle"===this.option.maskType){var i=n('\n<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,100 C77.6142375,100 100,77.6142375 100,50 C100,22.3857625 77.6142375,0 50,0 C22.3857625,0 0,22.3857625 0,50 C0,77.6142375 22.3857625,100 50,100 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>\n</svg>',"image/svg+xml");this.svgMask.onload=function(){t.ctx.drawImage(t.svgMask,0,0,t.canvas.width,t.canvas.width)},this.svgMask.src=o(i)}else"rect"===this.option.maskType&&(this.rectMaskWidth=this.canvas.width/10,this.canvas.width+=2*this.rectMaskWidth,this.canvas.height+=2*this.rectMaskWidth);else"free"===this.mode&&(this.cropArea={x:0,y:0,width:this.canvas.width,height:this.canvas.height});this.addEvents(),this.render(),console.log(this)},e.prototype.canvasInit=function(){this.canvas.width=this.width*window.devicePixelRatio,this.canvas.height=this.height*window.devicePixelRatio;var t=this.canvas.width*(1/window.devicePixelRatio)+"px",i=this.canvas.height*(1/window.devicePixelRatio)+"px";this.canvas.style.width=this.wrapper.style.width=t,this.canvas.style.height=this.wrapper.style.height=i},e.prototype.render=function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawBg(),this.drawImg(),this.drawMask()},e.prototype.drawBg=function(){},e.prototype.drawImg=function(){this.ctx.drawImage(this.img,this.imgOffsetX,this.imgOffsetY,this.imgWidth,this.imgHeight)},e.prototype.drawMask=function(){if("avatar"===this.mode){var t=this.option.maskType;if("circle"===t)this.ctx.drawImage(this.svgMask,0,0,this.canvas.width,this.canvas.width);else if("rect"===t){var i=this.canvas.width;this.drawRectMask(this.rectMaskWidth,this.rectMaskWidth,i-2*this.rectMaskWidth,i-2*this.rectMaskWidth)}}else if("free"===this.mode){var e=JSON.parse(JSON.stringify(this.cropStartPoint)),s=JSON.parse(JSON.stringify(this.cropEndPoint));e.x>s.x&&(n=[s.x,e.x],e.x=n[0],s.x=n[1]),e.y>s.y&&(o=[s.y,e.y],e.y=o[0],s.y=o[1]),this.drawRectMask(e.x,e.y,s.x-e.x,s.y-e.y)}var n,o},e.prototype.drawRectMask=function(t,i,e,s){var n=this.canvas.width,o=this.canvas.height;this.ctx.fillStyle="rgba(0,0,0,.5)",this.ctx.fillRect(0,0,n,i),this.ctx.fillRect(0,i+s,n,o-(i+s)),this.ctx.fillRect(0,i,t,s),this.ctx.fillRect(t+e,i,n-(t+e),s)},e.prototype.uploadEvents=function(){var t=this;this.btns.upload.addEventListener("click",function(){t.upload.click()}),this.upload.addEventListener("change",function(i){var e=i.target.files[0],s=o(e);if(!/image\/(jpg|jpeg|png)/.test(e.type))return void console.error("Only support jpg and png format.");URL.revokeObjectURL(t.img.src),t.img.onload=function(){t.imgInit()},t.img.src=s})},e.prototype.scrollEvent=function(){var t,i=this,e={x:0,y:0};document.addEventListener("wheel",function(s){if(s.target===i.canvas){i.isScaling=!0,t&&clearTimeout(t),s.preventDefault();var n=s.wheelDeltaY,o=n;r=[s.offsetX,s.offsetY],e.x=r[0],e.y=r[1];var h={x:e.x*i.dpr-i.imgOffsetX,y:e.y*i.dpr-i.imgOffsetY};i.imgWidth+=o,i.imgOffsetX-=h.x/i.imgWidth*o,i.imgOffsetY-=h.y/i.imgHeight*(o/i.ratio),requestAnimationFrame(i.render.bind(i)),t=setTimeout(function(){i.isScaling=!1},200);var r}})},e.prototype.addEvents=function(){function t(t){if(t.target===this.canvas&&!this.isScaling&&this.canvasNotBlank){console.log("document mousedown"),n.x=t.offsetX,n.y=t.offsetY;var i={x:n.x*this.dpr,y:n.y*this.dpr},e={start:this.cropStartPoint,end:this.cropEndPoint};o=this.pointInArea(i,e),!0===t.metaKey||!0===t.ctrlKey||"avatar"===this.mode||o?(this.isMoving=!0,n.x=t.clientX,n.y=t.clientY,document.body.style.cursor="move"):(this.isCropping=!0,this.cropStartX=t.offsetX*this.dpr,this.cropStartY=t.offsetY*this.dpr)}}function i(t){if(t.target===this.canvas&&this.canvasNotBlank){var i={x:t.offsetX*this.dpr,y:t.offsetY*this.dpr},e={start:this.cropStartPoint,end:this.cropEndPoint},h=s(t);if(o=this.pointInArea(i,e),this.isCropping?document.body.style.cursor="crosshair":document.body.style.cursor=h||o?"move":"auto",(this.isMoving||this.isCropping)&&!this.isScaling){if(this.isMoving){var r=(t.clientX-n.x)*this.dpr,a=(t.clientY-n.y)*this.dpr;o&&!h?(this.cropStartX+=r,this.cropStartY+=a,this.cropEndX+=r,this.cropEndY+=a):(this.imgOffsetX+=r,this.imgOffsetY+=a),n.x=t.clientX,n.y=t.clientY}else this.isCropping&&(this.cropEndPoint.x=t.offsetX*this.dpr,this.cropEndPoint.y=t.offsetY*this.dpr);requestAnimationFrame(this.render.bind(this))}}}function e(t){t.target===this.canvas&&this.canvasNotBlank&&(this.isCropping&&(this.cropEndX=t.offsetX*this.dpr,this.cropEndY=t.offsetY*this.dpr),console.log("isCropping",this.isCropping,this.cropStartPoint,this.cropEndPoint),this.isMoving=!1,this.isCropping=!1,console.log("document mouseup"),document.body.style.cursor="auto",this.render())}function s(t){return!0===t.metaKey||!0===t.ctrlKey||"avatar"===c.mode}this.uploadEvents(),this.scrollEvent();var n={x:0,y:0},o=(this.imgOffsetX,this.imgOffsetY,!1),h=t.bind(this),r=i.bind(this),a=e.bind(this),c=this;document.addEventListener("mousedown",h),document.addEventListener("mousemove",r),document.addEventListener("mouseup",a)},e.prototype.imgInit=function(){var t=(this.option,this.img);this.original.width=t.naturalWidth,this.original.height=t.naturalHeight,this.ratio=t.width/t.height,t.width>t.height?this.imgHeight=this.canvas.height:this.imgWidth=this.canvas.width,this.imgOffsetX=(this.canvas.width-this.imgWidth)/2,this.imgOffsetY=(this.canvas.height-this.imgHeight)/2,this.canvasNotBlank=!0,this.render()},e.prototype.center=function(t,i){return{offsetX:(this.canvas.width-t)/2,offsetY:(this.canvas.height-i)/2}},e.prototype.pointInArea=function(t,i){var e=JSON.parse(JSON.stringify(i.start)),s=JSON.parse(JSON.stringify(i.end));return e.x>s.x&&(n=[s.x,e.x],e.x=n[0],s.x=n[1]),e.y>s.y&&(o=[s.y,e.y],e.y=o[0],s.y=o[1]),t.x>=e.x&&t.x<=s.x&&t.y>=e.y&&t.y<=s.y;var n,o},Object.defineProperty(e.prototype,"mode",{get:function(){return this._mode},set:function(t){switch(this._mode=t,t){case"avatar":this.option.width>this.option.height?this.width=this.height=this.option.height:this.width=this.height=this.option.width;break;case"free":this.width=this.option.width,this.height=this.option.height}},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"imgWidth",{get:function(){return this.imgBounding.width},set:function(t){var i=Number(t)||this.imgBounding.width;i<100&&(i=100),this.imgBounding.width=i,this.imgBounding.height=i/this.ratio,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"imgHeight",{get:function(){return this.imgBounding.height},set:function(t){var i=Number(t)||this.imgBounding.height;i<100&&(i=100),this.imgBounding.height=i,this.imgBounding.width=i*this.ratio,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"imgOffsetX",{get:function(){return this.imgBounding.offsetX},set:function(t){var i=this.canvas.width-this.canvas.width/10,e=-this.imgWidth+this.canvas.width/10;t=t>i?i:t<-this.imgWidth?e:t,this.imgBounding.offsetX=t,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"imgOffsetY",{get:function(){return this.imgBounding.offsetY},set:function(t){var i=this.canvas.height-this.canvas.height/10,e=-this.imgHeight+this.canvas.height/10;t=t>this.canvas.height?i:t<-this.imgHeight?e:t,this.imgBounding.offsetY=t,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"cropStartX",{get:function(){return this.cropStartPoint.x},set:function(t){this.cropStartPoint.x=Number(t)||0,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"cropStartY",{get:function(){return this.cropStartPoint.y},set:function(t){this.cropStartPoint.y=Number(t)||0,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"cropEndX",{get:function(){return this.cropEndPoint.x},set:function(t){this.cropEndPoint.x=Number(t)||0,this.hasChanged=!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"cropEndY",{get:function(){return this.cropEndPoint.y},set:function(t){this.cropEndPoint.y=Number(t)||0,this.hasChanged=!0},enumerable:!0,configurable:!0}),e.prototype.createImg=function(){if(this.hasChanged){var t=0,i=0,e=JSON.parse(JSON.stringify(this.cropStartPoint)),s=JSON.parse(JSON.stringify(this.cropEndPoint));"avatar"===this.mode?(t=this.width,i=this.width):"free"===this.mode&&(console.log(e,s),e.x>s.x&&(o=[s.x,e.x],e.x=o[0],s.x=o[1]),e.y>s.y&&(h=[s.y,e.y],e.y=h[0],s.y=h[1]),t=s.x-e.x,i=s.y-e.y),this.output.width=t,this.output.height=i,this.outCtx.beginPath();var n;"avatar"===this.mode?"circle"===this.option.maskType?(this.outCtx.arc(t/2,i/2,t/2,0,2*Math.PI,!0),this.outCtx.clip(),n=[0,0,t,i]):"rect"===this.option.maskType&&(n=[this.rectMaskWidth,this.rectMaskWidth,this.canvas.width-2*this.rectMaskWidth,this.canvas.width-2*this.rectMaskWidth,0,0,t,i]):"free"===this.mode&&(n=[e.x,e.y,s.x-e.x,s.y-e.y,0,0,t,i]),(r=this.outCtx).drawImage.apply(r,[this.canvas].concat(n)),this.hasChanged=!1;var o,h,r}},e.prototype.toBase64=function(){return this.createImg(),this.output.toDataURL()},e.prototype.toBlob=function(t){var i=this;return this.createImg(),new Promise(function(t,e){i.output.toBlob(function(i){return t(i)})})},e.prototype.download=function(){this.createImg();var t=document.createElement("a");t.download="gt-img",this.output.toBlob(function(i){t.href=o(i),t.click()})},e}()});
//# sourceMappingURL=GeeTailor.js.map
