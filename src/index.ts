import { assign, nextTick } from './utils';

interface gtOption {
    width: number,
    height: number,
    mode: 'avatar' | 'free',
    maskType: 'circle' | 'rect'
};
const defaultOption: gtOption = {
    width: 200,
    height: 200,
    mode: 'avatar',
    maskType: 'circle'
}
const template = `
<div class="gt-canvas" style="display: inline-block">
    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>
    <div class="gt-info">
        <span class="gt-info_size"></span>
        <span class="gt-info_color"></span>
    </div>
</div>
<div class="gt-preview">
    <img class="gt-preview_img" style="display: none" download="gt-img">
</div>
<section class="gt-ctrl">
    <button class="gt-ctrl_upload">Upload</button>
    <button class="gt-ctrl_export">Export</button>

    <input class="gt-upload" type="file" accept="image/jpg,image/png" style="display: none">
</section>
`;
const circleMask = `
<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,100 C77.6142375,100 100,77.6142375 100,50 C100,22.3857625 77.6142375,0 50,0 C22.3857625,0 0,22.3857625 0,50 C0,77.6142375 22.3857625,100 50,100 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>
</svg>`;
const rectMask = `
<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M10,10 L90,10 L90,90 L10,90 L10,10 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>
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
    public export: HTMLButtonElement;
    public preview: HTMLImageElement;

    private isMoving = false;
    private previewImgUrl: string;

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
    private imgOffset = {
        x: 0,
        y: 0
    };

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
        this.preview = this.el.querySelector('.gt-preview_img') as HTMLImageElement;
        this.upload = this.el.querySelector('.gt-upload') as HTMLButtonElement;
        this.btns['upload'] = this.el.querySelector('.gt-ctrl_upload') as HTMLButtonElement;
        this.btns['export'] = this.el.querySelector('.gt-ctrl_export') as HTMLButtonElement;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.dpr, this.dpr);
        // this.ctx.imageSmoothingEnabled = false;

        this.mode = this.option.mode;
        this.canvasInit();
        this.previewInit();

        if (this.mode === 'avatar') {
            const svgData = this.option.maskType === 'circle' ? circleMask : rectMask;
            const maskData = this.toBlob(svgData, 'image/svg+xml');
            this.svgMask.onload = () => {
                this.ctx.drawImage(this.svgMask, 0, 0, this.canvas.width, this.canvas.width);
            };
            this.svgMask.src = this.toUrl(maskData);
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
        this.setPreview();
    }

    private drawBg () {
    }

    private drawImg () {
        this.ctx.drawImage(
            this.img,
            this.imgBounding.offsetX, 
            this.imgBounding.offsetY, 
            this.imgBounding.width, 
            this.imgBounding.height
        );
    }

    private drawMask () {
        this.ctx.drawImage(this.svgMask, 0, 0, this.canvas.width, this.canvas.width);
    }

    private previewInit () {

        let cssText = `
            display: inline-block;
            width: ${this.width}px;
            height: ${this.height}px;
            background: rgba(0,0,0,.8);
            background-size: contain;
        `;

        if (
            this.mode === 'avatar' &&
            this.option.maskType === 'circle'
        ) {
            cssText += 'border-radius: 50%';
        }

        this.preview.parentElement.style.cssText = cssText;
    }
    public setPreview () {

        // if (this.isMoving) return;

        this.preview.style.backgroundImage = `url(${this.canvas.toDataURL()})`

        // this.output.toBlob(blob => this.preview.src = this.toUrl(blob));
    }

    private addEvents () {
        this.btns['upload'].addEventListener('click', () => {
            this.upload.click();
        });
        this.btns['export'].addEventListener('click', () => {
            this.download();
        });
        this.upload.addEventListener('change', (e: any) => {
            
            const imgFile = e.target.files[0];
            const imgUrl = this.toUrl(imgFile);
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
        document.addEventListener('wheel', e => {

            if (e.target !== this.canvas) return;

            this.isMoving = true;
            st && clearTimeout(st);

            e.preventDefault();
            const deltaY = e.wheelDeltaY;
            // console.log(this.imgBounding.width);
            if (deltaY < 0 && this.imgBounding.width < this.canvas.width / 5) {
                return;
            }
            this.imgBounding.width += deltaY;
            this.imgBounding.height += deltaY / this.ratio;
            const offset = this.center(this.imgBounding.width, this.imgBounding.height);
            this.imgBounding.offsetX = offset.offsetX + this.imgOffset.x;
            this.imgBounding.offsetY = offset.offsetY + this.imgOffset.y;

            requestAnimationFrame(this.render.bind(this));
            st = setTimeout(() => {
                this.isMoving = false;
                this.setPreview();
            }, 100);
        });
        let isDragging = false;
        const startPoints = { x: 0, y: 0 };
        const imgOffset = { x: this.imgBounding.offsetX, y: this.imgBounding.offsetY };
        document.addEventListener('mousedown', e => {
            if (e.target !== this.canvas) return;

            isDragging = true;
            this.isMoving = true;
            console.log(e);
            startPoints.x = e.offsetX;
            startPoints.y = e.offsetY;
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;

            this.imgOffset.x = e.offsetX - startPoints.x;
            this.imgOffset.y = e.offsetY - startPoints.y;
            this.imgBounding.offsetX = (imgOffset.x + this.imgOffset.x) / 2;
            this.imgBounding.offsetY = (imgOffset.y + this.imgOffset.y) / 2;

            requestAnimationFrame(this.render.bind(this));
        });
        document.addEventListener('mouseup', e => {
            isDragging = false;
            this.isMoving = false;
            this.setPreview();
        })
    }

    private imgInit () {

        const option = this.option;
        const img = this.img;

        this.original.width = img.naturalWidth;
        this.original.height = img.naturalHeight;
        this.ratio = img.width / img.height;

        this.imgBounding.width = img.width;
        this.imgBounding.height = img.height;

        if (img.width > this.option.width) {
            const scaleY = this.canvas.width / img.width;
            this.imgBounding.width = this.canvas.width;
            this.imgBounding.height = scaleY * this.imgBounding.height;
        }
        if (img.height > this.option.height) {
            const scaleX = this.canvas.height / this.imgBounding.height;
            this.imgBounding.height = this.canvas.height;
            this.imgBounding.width *= scaleX;
        } 

        this.imgBounding.offsetX = (this.canvas.width - this.imgBounding.width) / 2;
        this.imgBounding.offsetY =  (this.canvas.height - this.imgBounding.height) / 2;
        
        this.render();
    }

    private center (width, height) {
        return {
            offsetX: (this.canvas.width - width) / 2,
            offsetY: (this.canvas.height - height) / 2 
        }
    }

    set mode (val: 'avatar' | 'free') {
        this._mode = val;
        switch (val) {
            case 'avatar': {
                this.option.width > this.option.height ?
                    [this.width, this.height] = [this.option.height, this.option.height] :
                    [this.width, this.height] = [this.option.width, this.option.width];
                break;
            }
            case 'free': {
                this.width = this.option.width;
                this.height = this.option.height;
                break;
            }
        }
    }

    get mode () {
        return this._mode;
    }

    private toBlob (data, type) {
        return new Blob([data], {type});
    }

    private toUrl (obj) {
        return URL.createObjectURL(obj);
    }

    public download () {

        const width = this.canvas.width;
        const height = this.canvas.height;
        this.output.width = width;
        this.output.height = height;
        this.outCtx.beginPath();

        if (
            this.mode === 'avatar' && 
            this.option.maskType === 'circle'
        ) {
            this.outCtx.arc(
                width / 2,
                height / 2,
                width / 2,
                0,
                2 * Math.PI,
                true
            );
        } 
    
        this.outCtx.clip();
        this.outCtx.drawImage(
            this.canvas, 
            0, 
            0, 
            width, 
            height
        );
        const a = document.createElement('a');
        a.download = 'gt-img';
        this.output.toBlob(blob => {
            a.href = this.toUrl(blob);
            a.click();
        });
    }
}