import { assign, nextTick, toBlob, toUrl } from './utils';

type Mode = 'avatar' | 'free';
type MaskType = 'circle' | 'rect';
interface gtOption {
    width: number,
    height: number,
    mode: Mode,
    maskType: MaskType
};
const defaultOption: gtOption = {
    width: 200,
    height: 200,
    mode: 'free',
    maskType: 'circle' 
}
const template = `
<div class="gt-canvas" style="display: inline-block">
    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>
    <input class="gt-upload" type="file" accept="image/jpg,image/png" style="display: none">
    <button class="gt-ctrl_upload">Upload</button>
    <div class="gt-info">
        <span class="gt-info_size"></span>
        <span class="gt-info_color"></span>
    </div>
</div>
`;
const circleMask = `
<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,100 C77.6142375,100 100,77.6142375 100,50 C100,22.3857625 77.6142375,0 50,0 C22.3857625,0 0,22.3857625 0,50 C0,77.6142375 22.3857625,100 50,100 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>
</svg>`;

export default class GeeTailor {

    public el: Element;
    public option: any;

    public width: number;
    public height: number;
    public dpr = window.devicePixelRatio || 1;
    private ratio: number;
    
    public btns: {new(): HTMLButtonElement} = {} as any;
    private wrapper: HTMLElement;
    public info: {new(): HTMLElement} = {} as any;
    private svgMask: HTMLImageElement = new Image;
    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private output: HTMLCanvasElement = document.createElement('canvas');
    private outCtx: CanvasRenderingContext2D = this.output.getContext('2d');

    public upload: HTMLButtonElement;

    private rectMaskWidth = 0;

    private isMoving = false;
    private isCropping = false;
    private hasChanged = true;

    private mouseStartPoint = { x: 0, y: 0 };
    private mouseEndPoint = { x: 0, y: 0 };

    private img: HTMLImageElement = new Image;
    private original = {
        width: 0,
        height: 0
    };
    private imgBounding = {
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0
    };
    private cropArea = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

    private _mode: 'avatar'|'free';

    constructor (el: Element, option: gtOption) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = assign(defaultOption, option);
        this.el.innerHTML = template;
        nextTick(this.init.bind(this));
    }

    private init () {

        this.wrapper = this.el.querySelector('.gt-canvas') as HTMLElement;
        this.info['size'] = this.el.querySelector('.gt-info_size') as HTMLElement;
        this.info['color'] = this.el.querySelector('.gt-info_color') as HTMLElement;
        this.canvas = this.el.querySelector('.gt-img') as HTMLCanvasElement;
        this.upload = this.el.querySelector('.gt-upload') as HTMLButtonElement;
        this.btns['upload'] = this.el.querySelector('.gt-ctrl_upload') as HTMLButtonElement;

        this.ctx = this.canvas.getContext('2d');
        // this.ctx.scale(this.dpr, this.dpr);
        // this.ctx.imageSmoothingEnabled = false;

        this.mode = this.option.mode;
        this.canvasInit();

        if (this.mode === 'avatar') {
            if (this.option.maskType === 'circle') {
                const maskData = toBlob(circleMask, 'image/svg+xml');
                this.svgMask.onload = () => {
                    this.ctx.drawImage(this.svgMask, 0, 0, this.canvas.width, this.canvas.width);
                };
                this.svgMask.src = toUrl(maskData);
            } else if (this.option.maskType === 'rect') {
                this.rectMaskWidth = this.canvas.width / 10;
                this.canvas.width += this.rectMaskWidth * 2;
                this.canvas.height += this.rectMaskWidth * 2;
            }
        } else if (this.mode === 'free') {
            this.cropArea = {
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: this.canvas.height
            }
        }

        this.addEvents();

        this.render();

        console.log(this);
    }

    private canvasInit () {
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;

        // const dprPercent = (1 / window.devicePixelRatio) *  + 'px';
        const cssWidth = this.canvas.width * (1 / window.devicePixelRatio) + 'px';
        const cssHeight = this.canvas.height * (1 / window.devicePixelRatio) + 'px';
        this.canvas.style.width = this.wrapper.style.width = cssWidth;
        this.canvas.style.height = this.wrapper.style.height = cssHeight;
    }

    public render () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBg();
        this.drawImg();
        this.drawMask();
    }

    private drawBg () {
    }

    private drawImg () {
        this.ctx.drawImage(
            this.img,
            this.imgOffsetX, 
            this.imgOffsetY, 
            this.imgWidth, 
            this.imgHeight
        );
    }

    private drawMask () {
        if (this.mode === 'avatar') {
            const maskType = this.option.maskType;
            if (maskType === 'circle') {
                this.ctx.drawImage(this.svgMask, 0, 0, this.canvas.width, this.canvas.width);
            } else if (maskType === 'rect') {
                const canvasWidth = this.canvas.width;
                this.drawRectMask(
                    this.rectMaskWidth, 
                    this.rectMaskWidth, 
                    canvasWidth - this.rectMaskWidth * 2,
                    canvasWidth - this.rectMaskWidth * 2
                );
            }
        } else if (this.mode === 'free') {
            const startPoint = JSON.parse(JSON.stringify(this.mouseStartPoint));
            const endPoint = JSON.parse(JSON.stringify(this.mouseEndPoint));
            console.log(startPoint, endPoint)
            startPoint.x > endPoint.x && ([startPoint.x, endPoint.x] = [endPoint.x, startPoint.x]);
            startPoint.y > endPoint.y && ([startPoint.y, endPoint.y] = [endPoint.y, startPoint.y]);
            this.drawRectMask(
                startPoint.x, 
                startPoint.y, 
                endPoint.x - startPoint.x, 
                endPoint.y - startPoint.y
            );
        }
    }

    private drawRectMask (x: number, y: number, width: number, height: number) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.ctx.fillStyle = 'rgba(0,0,0,.5)';
        this.ctx.fillRect(0, 0, canvasWidth, y);
        this.ctx.fillRect(0, y + height, canvasWidth, canvasHeight - (y + height));
        this.ctx.fillRect(0, y, x, height);
        this.ctx.fillRect(x + width, y, canvasWidth - (x + width), height);
    }

    private addEvents () {
        this.btns['upload'].addEventListener('click', () => {
            this.upload.click();
        });
        this.upload.addEventListener('change', (e: any) => {
            
            const imgFile = e.target.files[0];
            const imgUrl = toUrl(imgFile);
            if (!/image\/(jpg|jpeg|png)/.test(imgFile.type)) {
                console.error('Only support jpg and png format.');
                return;
            }

            URL.revokeObjectURL(this.img.src);
        
            this.img.onload = () => {
                this.imgInit();
            };
            this.img.src = imgUrl;
        
        });
        let st;
        const point = { x: 0, y: 0 };
        let isScaling = false;
        let isMoving = false;
        let isCropping = false;
        document.addEventListener('wheel', e => {

            if (e.target !== this.canvas) return;

            isScaling = true;

            st && clearTimeout(st);

            e.preventDefault();
            const deltaY = e.wheelDeltaY;
            let deltaWidth = deltaY;

            [point.x, point.y]  = [e.offsetX, e.offsetY];
            const pointOnImg = {
                x: point.x * this.dpr - this.imgOffsetX,
                y: point.y * this.dpr - this.imgOffsetY
            }

            console.log(point, pointOnImg);
            
            this.imgWidth += deltaWidth;

            this.imgOffsetX -= (pointOnImg.x / this.imgWidth) * deltaWidth;
            this.imgOffsetY -= (pointOnImg.y / this.imgHeight) * (deltaWidth / this.ratio);

            requestAnimationFrame(this.render.bind(this));
            st = setTimeout(() => {
                isScaling = false;
            }, 200);
        });

        const startPoints = { x: 0, y: 0 };
        const endPoints = { x: 0, y: 0 };
        const imgOffset = { x: this.imgOffsetX, y: this.imgOffsetY };
        document.addEventListener('mousedown', e => {
            if (e.target !== this.canvas || isScaling) return;

            if (e.metaKey === true || e.ctrlKey === true || this.mode === 'avatar') {
                isMoving = true;
                this.mouseStartPoint.x = e.clientX;
                this.mouseStartPoint.y = e.clientY;
                document.body.style.cursor = 'move';
            } else {
                isCropping = true;
                this.mouseStartPoint.x = e.offsetX * this.dpr;
                this.mouseStartPoint.y = e.offsetY * this.dpr;
                document.body.style.cursor = 'crosshair';
            }
        });
        document.addEventListener('mousemove', e => {
            if ((!isMoving && !isCropping) || isScaling) return;

            // console.log(e);

            if (isMoving) {
                this.imgOffsetX += (e.clientX - this.mouseStartPoint.x) * this.dpr;
                this.imgOffsetY += (e.clientY - this.mouseStartPoint.y) * this.dpr;

                this.mouseStartPoint.x = e.clientX;
                this.mouseStartPoint.y = e.clientY;
            } else if (isCropping) {
                this.mouseEndPoint.x = e.offsetX * this.dpr;
                this.mouseEndPoint.y = e.offsetY * this.dpr;
            }

            requestAnimationFrame(this.render.bind(this));
        });
        document.addEventListener('mouseup', e => {
            isMoving = false;
            isCropping = false;
            document.body.style.cursor = 'auto';
        })
    }

    private imgInit () {

        const option = this.option;
        const img = this.img;

        this.original.width = img.naturalWidth;
        this.original.height = img.naturalHeight;
        this.ratio = img.width / img.height;

        if (img.width > img.height) {
            this.imgHeight = this.canvas.height;
        } else {
            this.imgWidth = this.canvas.width;
        }

        this.imgOffsetX = (this.canvas.width - this.imgWidth) / 2;
        this.imgOffsetY =  (this.canvas.height - this.imgHeight) / 2;
        
        this.render();
    }

    private center (width, height) {
        return {
            offsetX: (this.canvas.width - width) / 2,
            offsetY: (this.canvas.height - height) / 2 
        }
    }

    get mode () {
        return this._mode;
    }
    set mode (val: Mode) {
        this._mode = val;
        switch (val) {
            case 'avatar': {
                this.option.width > this.option.height ?
                    this.width = this.height = this.option.height :
                    this.width = this.height = this.option.width;
                break;
            }
            case 'free': {
                this.width = this.option.width;
                this.height = this.option.height;
                break;
            } 
        }
    }

    get imgWidth () {
        return this.imgBounding.width;
    }
    set imgWidth (val) {
        let deltaWidth = Number(val) || this.imgBounding.width;
        deltaWidth < 100 && (deltaWidth = 100); 
        this.imgBounding.width = deltaWidth;
        this.imgBounding.height = deltaWidth / this.ratio;
        this.hasChanged = true;
    }
    get imgHeight () {
        return this.imgBounding.height;
    }
    set imgHeight (val) {
        let deltaHeight = Number(val) || this.imgBounding.height;
        deltaHeight < 100 && (deltaHeight = 100); 
        this.imgBounding.height = deltaHeight;
        this.imgBounding.width = deltaHeight * this.ratio;
        this.hasChanged = true;
    }
    get imgOffsetX () {
        return this.imgBounding.offsetX;
    }
    set imgOffsetX (val) {
        const rightLine = this.canvas.width - this.canvas.width / 10;
        const leftLine = -this.imgWidth + this.canvas.width / 10;
        val = val > rightLine ? rightLine : (val < -this.imgWidth ? leftLine : val);

        this.imgBounding.offsetX = val;
        this.hasChanged = true;
    }
    get imgOffsetY () {
        return this.imgBounding.offsetY;
    }
    set imgOffsetY (val) {
        const topLine =  this.canvas.height - this.canvas.height / 10;
        const bottomLine = -this.imgHeight + this.canvas.height / 10;
        val = val > this.canvas.height ? topLine : (val < -this.imgHeight ? bottomLine: val);

        this.imgBounding.offsetY = val;
        this.hasChanged = true;
    }

    private createImg () {

        if (!this.hasChanged) return;

        let width = 0;
        let height = 0;
        const startPoint = JSON.parse(JSON.stringify(this.mouseStartPoint));
        const endPoint = JSON.parse(JSON.stringify(this.mouseEndPoint));
        if (this.mode === 'avatar') {
            width = this.width;
            height = this.width;
        } else if (this.mode === 'free') {
            console.log(startPoint, endPoint)
            startPoint.x > endPoint.x && ([startPoint.x, endPoint.x] = [endPoint.x, startPoint.x]);
            startPoint.y > endPoint.y && ([startPoint.y, endPoint.y] = [endPoint.y, startPoint.y]);
            width = endPoint.x - startPoint.x;
            height = endPoint.y - startPoint.y;
        }
        this.output.width = width;
        this.output.height = height;
        this.outCtx.beginPath();

        let clipArea: Array<number>;

        if (this.mode === 'avatar') {
            if (this.option.maskType === 'circle') {
                this.outCtx.arc(
                    width / 2,
                    height / 2,
                    width / 2,
                    0,
                    2 * Math.PI,
                    true
                );
                this.outCtx.clip();
                clipArea = [0, 0, width, height];
            } else if (this.option.maskType === 'rect') {
                clipArea = [
                    this.rectMaskWidth, 
                    this.rectMaskWidth, 
                    this.canvas.width - this.rectMaskWidth * 2, 
                    this.canvas.width - this.rectMaskWidth * 2,
                    0,
                    0,
                    width, 
                    height,
                ];
            }
        } else if (this.mode === 'free') {
            clipArea = [
                startPoint.x, 
                startPoint.y, 
                endPoint.x - startPoint.x, 
                endPoint.y - startPoint.y,
                0,
                0,
                width, 
                height,
            ];
        }

        (this.outCtx.drawImage as any)(this.canvas, ...clipArea);

        this.hasChanged = false;
    }

    public toBase64 () {
        this.createImg();
        return this.output.toDataURL();
    }
    public toBlob (cb) {
        this.createImg();
        return new Promise((r, j) => {
            this.output.toBlob(blob => r(blob));
        });
    }
    public download () {
        this.createImg();
        const a = document.createElement('a');
        a.download = 'gt-img';
        this.output.toBlob(blob => {
            a.href = toUrl(blob);
            a.click();
        });
    }
}