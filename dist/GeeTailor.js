!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):t.GeeTailor=i()}(this,function(){"use strict";function t(t,i){function n(t,i){Object.keys(i).forEach(function(s){if(s in t){var o=e(t[s]);"[object Object]"===o||"[object Array]"===o?(t[s]=Object.create(t[s]),n(t[s],i[s])):t[s]=i[s]}})}var s=Object.create(t);return n(s,i),s}function i(t){if("undefined"!=typeof Promise&&n(Promise))Promise.resolve().then(function(){t()}).catch(function(t){return console.error(t)});else if("undefined"==typeof MutationObserver||!n(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())setTimeout(t,0);else{var i=new MutationObserver(t),e=document.createTextNode(h+"");i.observe(e,{characterData:!0}),e.data=++h+"",h=0}}function e(t){return Object.prototype.toString.call(t)}function n(t){return/[native code]/.test(t.toString())}function s(t,i){return new Blob([t],{type:i})}function o(t){return URL.createObjectURL(t)}var h=0,a=function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")},r=function(){function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(i,e,n){return e&&t(i.prototype,e),n&&t(i,n),i}}(),c={width:200,height:200,mode:"avatar",maskType:"circle"};return function(){function e(n,s){a(this,e),this.dpr=window.devicePixelRatio||1,this.btns={},this.info={},this.svgMask=new Image,this.output=document.createElement("canvas"),this.outCtx=this.output.getContext("2d"),this.isMoving=!1,this.img=new Image,this.original={width:0,height:0},this.imgBounding={width:0,height:0,offsetX:0,offsetY:0},this._scale=0,this.el="string"==typeof n?document.querySelector(n):n,this.option=t(c,s),this.el.innerHTML='\n<div class="gt-canvas" style="display: inline-block">\n    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>\n    <div class="gt-info">\n        <span class="gt-info_size"></span>\n        <span class="gt-info_color"></span>\n    </div>\n</div>\n<div class="gt-preview">\n    <img class="gt-preview_img" style="display: none" download="gt-img">\n</div>\n<section class="gt-ctrl">\n    <button class="gt-ctrl_upload">Upload</button>\n    <button class="gt-ctrl_export">Export</button>\n\n    <input class="gt-upload" type="file" accept="image/jpg,image/png" style="display: none">\n</section>\n',i(this.init.bind(this))}return r(e,[{key:"init",value:function(){var t=this;if(this.wrapper=this.el.querySelector(".gt-canvas"),this.info.size=this.el.querySelector(".gt-info_size"),this.info.color=this.el.querySelector(".gt-info_color"),this.canvas=this.el.querySelector(".gt-img"),this.preview=this.el.querySelector(".gt-preview_img"),this.upload=this.el.querySelector(".gt-upload"),this.btns.upload=this.el.querySelector(".gt-ctrl_upload"),this.btns.export=this.el.querySelector(".gt-ctrl_export"),this.ctx=this.canvas.getContext("2d"),this.mode=this.option.mode,this.canvasInit(),this.previewInit(),"avatar"===this.mode){var i="circle"===this.option.maskType?'\n<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,100 C77.6142375,100 100,77.6142375 100,50 C100,22.3857625 77.6142375,0 50,0 C22.3857625,0 0,22.3857625 0,50 C0,77.6142375 22.3857625,100 50,100 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>\n</svg>':'\n<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M10,10 L90,10 L90,90 L10,90 L10,10 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>\n</svg>',e=s(i,"image/svg+xml");this.svgMask.onload=function(){t.ctx.drawImage(t.svgMask,0,0,t.canvas.width,t.canvas.width)},this.svgMask.src=o(e)}this.addEvents(),this.render(),console.log(this)}},{key:"canvasInit",value:function(){this.canvas.width=this.width*window.devicePixelRatio,this.canvas.height=this.height*window.devicePixelRatio;var t=this.canvas.width*(1/window.devicePixelRatio)+"px",i=this.canvas.height*(1/window.devicePixelRatio)+"px";this.canvas.style.width=this.wrapper.style.width=t,this.canvas.style.height=this.wrapper.style.height=i}},{key:"render",value:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawBg(),this.drawImg(),this.drawMask(),this.setPreview()}},{key:"drawBg",value:function(){}},{key:"drawImg",value:function(){this.ctx.drawImage(this.img,this.imgOffsetX,this.imgOffsetY,this.imgWidth,this.imgHeight)}},{key:"drawMask",value:function(){this.ctx.drawImage(this.svgMask,0,0,this.canvas.width,this.canvas.width)}},{key:"previewInit",value:function(){var t="\n            display: inline-block;\n            width: "+this.width+"px;\n            height: "+this.height+"px;\n            background: rgba(0,0,0,.8);\n            background-size: contain;\n        ";"avatar"===this.mode&&"circle"===this.option.maskType&&(t+="border-radius: 50%"),this.preview.parentElement.style.cssText=t}},{key:"setPreview",value:function(){}},{key:"addEvents",value:function(){var t=this;this.btns.upload.addEventListener("click",function(){t.upload.click()}),this.btns.export.addEventListener("click",function(){t.download()}),this.upload.addEventListener("change",function(i){var e=i.target.files[0],n=o(e);if(!/image\/(jpg|jpeg|png)/.test(e.type))return void console.error("Only support jpg and png format.");URL.revokeObjectURL(t.img.src),t.img.onload=function(){t.imgInit()},t.img.src=n});var i=void 0,e={x:0,y:0},n=!1,s=!1;document.addEventListener("wheel",function(s){if(s.target===t.canvas){n=!0,i&&clearTimeout(i),s.preventDefault();var o=s.wheelDeltaY,h=o,a=[s.offsetX,s.offsetY];e.x=a[0],e.y=a[1];var r={x:e.x*t.dpr-t.imgOffsetX,y:e.y*t.dpr-t.imgOffsetY};console.log(e,r),t.imgWidth+=h,t.imgOffsetX-=r.x/t.imgWidth*h,t.imgOffsetY-=r.y/t.imgHeight*(h/t.ratio),requestAnimationFrame(t.render.bind(t)),i=setTimeout(function(){n=!1,t.setPreview()},200)}});var h={x:0,y:0};this.imgOffsetX,this.imgOffsetY,document.addEventListener("mousedown",function(i){i.target!==t.canvas||n||(s=!0,document.body.style.cursor="move",console.log(i),h.x=i.clientX,h.y=i.clientY)}),document.addEventListener("mousemove",function(i){s&&!n&&(t.imgOffsetX+=(i.clientX-h.x)*t.dpr,t.imgOffsetY+=(i.clientY-h.y)*t.dpr,console.log(t.imgBounding.offsetX,t.imgBounding.offsetY,i.clientX,i.clientY,h.x,h.y),h.x=i.clientX,h.y=i.clientY,requestAnimationFrame(t.render.bind(t)))}),document.addEventListener("mouseup",function(i){s=!1,document.body.style.cursor="auto",t.setPreview()})}},{key:"imgInit",value:function(){var t=(this.option,this.img);this.original.width=t.naturalWidth,this.original.height=t.naturalHeight,this.ratio=t.width/t.height,t.width>t.height?this.imgHeight=this.canvas.height:this.imgWidth=this.canvas.width,this.imgOffsetX=(this.canvas.width-this.imgWidth)/2,this.imgOffsetY=(this.canvas.height-this.imgHeight)/2,this.render()}},{key:"center",value:function(t,i){return{offsetX:(this.canvas.width-t)/2,offsetY:(this.canvas.height-i)/2}}},{key:"createImg",value:function(){var t=this.canvas.width/this.dpr,i=this.canvas.height/this.dpr;this.output.width=t,this.output.height=i,this.outCtx.beginPath(),"avatar"===this.mode&&"circle"===this.option.maskType&&this.outCtx.arc(t/2,i/2,t/2,0,2*Math.PI,!0),this.outCtx.clip(),this.outCtx.drawImage(this.canvas,0,0,t,i)}},{key:"toBase64",value:function(){return this.createImg(),this.output.toDataURL()}},{key:"toBlob",value:function(){return this.createImg(),this.output.toDataURL()}},{key:"download",value:function(){this.createImg();var t=document.createElement("a");t.download="gt-img",this.output.toBlob(function(i){t.href=o(i),t.click()})}},{key:"mode",get:function(){return this._mode},set:function(t){switch(this._mode=t,t){case"avatar":var i,e;this.option.width>this.option.height?(i=[this.option.height,this.option.height],this.width=i[0],this.height=i[1]):(e=[this.option.width,this.option.width],this.width=e[0],this.height=e[1]);break;case"free":this.width=this.option.width,this.height=this.option.height}}},{key:"imgWidth",get:function(){return this.imgBounding.width},set:function(t){var i=Number(t)||this.imgBounding.width;i<100&&(i=100),this.imgBounding.width=i,this.imgBounding.height=i/this.ratio}},{key:"imgHeight",get:function(){return this.imgBounding.height},set:function(t){var i=Number(t)||this.imgBounding.height;i<100&&(i=100),this.imgBounding.height=i,this.imgBounding.width=i*this.ratio}},{key:"imgOffsetX",get:function(){return this.imgBounding.offsetX},set:function(t){var i=this.canvas.width-this.canvas.width/10,e=-this.imgWidth+this.canvas.width/10;t=t>i?i:t<-this.imgWidth?e:t,this.imgBounding.offsetX=t}},{key:"imgOffsetY",get:function(){return this.imgBounding.offsetY},set:function(t){var i=this.canvas.height-this.canvas.height/10,e=-this.imgHeight+this.canvas.height/10;t=t>this.canvas.height?i:t<-this.imgHeight?e:t,this.imgBounding.offsetY=t}},{key:"scale",get:function(){return this._scale},set:function(t){this._scale=t,this.render()}}]),e}()});
//# sourceMappingURL=GeeTailor.js.map
