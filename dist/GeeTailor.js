!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.GeeTailor=e()}(this,function(){"use strict";function t(t,e){function i(t,e){Object.keys(e).forEach(function(o){if(o in t){var r=n(t[o]);"[object Object]"===r||"[object Array]"===r?(t[o]=Object.create(t[o]),i(t[o],e[o])):t[o]=e[o]}})}var o=Object.create(t);return i(o,e),o}function e(t){if("undefined"!=typeof Promise&&i(Promise))Promise.resolve().then(function(){t()}).catch(function(t){return console.error(t)});else if("undefined"==typeof MutationObserver||!i(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())setTimeout(t,0);else{var e=new MutationObserver(t),n=document.createTextNode(o+"");e.observe(n,{characterData:!0}),n.data=++o+"",o=0}}function n(t){return Object.prototype.toString.call(t)}function i(t){return/[native code]/.test(t.toString())}var o=0,r=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),s={width:800,height:500};return function(){function n(i,o){r(this,n),this.btns={},this.img={width:0,height:0},this.el="string"==typeof i?document.querySelector(i):i,this.option=t(s,o),this.el.innerHTML='\n    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>\n    <input class="gt-upload" type="file" accept="image/jpg,image/png" style="display: none">\n    <section class="gt-ctrl">\n        <button class="gt-ctrl_upload">Upload</button>\n        <button class="gt-ctrl_export">Export</button>\n    </section>\n',e(this.init.bind(this))}return a(n,[{key:"init",value:function(){this.canvas=this.el.querySelector(".gt-img"),this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.option.width,this.canvas.height=this.option.height,this.upload=this.el.querySelector(".gt-upload"),this.btns.upload=this.el.querySelector(".gt-ctrl_upload"),this.addEvents(),console.log(this)}},{key:"drawBg",value:function(){}},{key:"drawCircleMask",value:function(){var t=this,e=new Image,n=new Blob(['\n<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,99 C77.0619527,99 99,77.0619527 99,50 C99,22.9380473 77.0619527,1 50,1 C22.9380473,1 1,22.9380473 1,50 C1,77.0619527 22.9380473,99 50,99 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>\n</svg>'],{type:"image/svg+xml"});e.onload=function(){var n=t.option.width>t.option.height?t.option.height:t.option.width,i=(t.option.width-n)/2,o=(t.option.height-n)/2;console.log(t.option.width,t.option.height,i,o,n),t.ctx.drawImage(e,i,o,n,n)},e.src=URL.createObjectURL(n)}},{key:"addEvents",value:function(){var t=this;this.btns.upload.addEventListener("click",function(){t.upload.click()}),this.upload.addEventListener("change",function(e){var n=e.target.files[0];if(!/image\/(jpg|jpeg|png)/.test(n.type))return void console.error("Only support jpg and png format.");var i=new Image;i.onload=function(){t.setImg(i)},i.src=URL.createObjectURL(n)})}},{key:"setImg",value:function(t){var e=this.option;URL.revokeObjectURL(t.src),this.img.width=t.width,this.img.height=t.height,t.width,t.height,t.width>this.option.width||t.height,e.height,this.ctx.clearRect(0,0,e.width,e.height),this.ctx.drawImage(t,0,0),this.drawCircleMask()}}]),n}()});
//# sourceMappingURL=GeeTailor.js.map
