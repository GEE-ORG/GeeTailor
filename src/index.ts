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
    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>
    <canvas class="gt-output" style="display: none"></canvas>
    <img class="gt-preview" style="display: none">
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
    
    public btns: {new(): HTMLButtonElement} = {} as any;
    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private output: HTMLCanvasElement;
    private outCtx: CanvasRenderingContext2D;

    public upload: HTMLButtonElement;
    public export: HTMLButtonElement;
    public preview: HTMLImageElement;

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

    private _mode: 'avatar'|'free';

    constructor (el: Element, option: gtOption) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = assign(defaultOption, option);
        this.el.innerHTML = template;
        nextTick(this.init.bind(this));
    }

    init () {
        this.canvas = this.el.querySelector('.gt-img') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.output = this.el.querySelector('.gt-output') as HTMLCanvasElement;
        this.outCtx = this.output.getContext('2d');

        this.mode = this.option.mode;
        
        this.canvasInit();

        this.preview = this.el.querySelector('.gt-preview') as HTMLImageElement;
        this.upload = this.el.querySelector('.gt-upload') as HTMLButtonElement;
        this.btns['upload'] = this.el.querySelector('.gt-ctrl_upload') as HTMLButtonElement;
        this.btns['export'] = this.el.querySelector('.gt-ctrl_export') as HTMLButtonElement;

        this.addEvents();

        this.render();

        console.log(this);
    }

    canvasInit () {
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;

        // const dprPercent = (1 / window.devicePixelRatio) *  + 'px';
        this.canvas.style.width = this.canvas.width * (1 / window.devicePixelRatio) + 'px';
        this.canvas.style.height = this.canvas.height * (1 / window.devicePixelRatio) + 'px';
    }

    render () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBg();
        this.drawImg();
        this.drawMask();
        this.setPreview();

        URL.revokeObjectURL(this.img.src);
    }

    drawBg () {

    }

    drawImg () {
        this.ctx.drawImage(
            this.img,
            this.imgBounding.offsetX, 
            this.imgBounding.offsetY, 
            this.imgBounding.width, 
            this.imgBounding.height
        );
    }

    drawMask () {
        console.log(this.mode);
        if (this.mode === 'avatar') {
            this.option.maskType === 'circle' && this.drawCircleMask();
            this.option.maskType === 'rect' && this.drawRectMask();
        }
    }

    drawCircleMask () {
        console.log('drawCircleMask');
        const img = new Image;
        const data = new Blob([circleMask], {type: 'image/svg+xml'});
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.width);
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(data);
    }
    drawRectMask () {
        console.log('drawRectMask');
        const img = new Image;
        const data = new Blob([rectMask], {type: 'image/svg+xml'});
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.width);
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(data);
    }

    setPreview () {
        if (this.mode === 'avatar') {
            if (this.option.maskType === 'circle') {
                this.preview.style.cssText = `
                    display: inline-block;
                    background: url(${this.canvas.toDataURL()});
                    background-size: 100%;
                    width: ${this.width}px;
                    height: ${this.height}px;
                    border-radius: 50%;
                `;
            }
        }
    }

    addEvents () {
        this.btns['upload'].addEventListener('click', () => {
            this.upload.click();
        });
        this.btns['export'].addEventListener('click', () => {
            
        });
        this.upload.addEventListener('change', (e: any) => {
            
            const imgFile = e.target.files[0];
            if (!/image\/(jpg|jpeg|png)/.test(imgFile.type)) {
                console.error('Only support jpg and png format.');
                return;
            }

            this.img.onload = () => {
                this.imgInit();
            };
            this.img.src = URL.createObjectURL(imgFile);
        });
        document.addEventListener('wheel', e => {
            if (e.target === this.canvas) {
                e.preventDefault();
                const deltaY = e.wheelDeltaY;
            }
        });
    }

    imgInit () {

        const option = this.option;
        const img = this.img;

        this.original.width = img.naturalWidth;
        this.original.height = img.naturalHeight;
        const radio = img.width / img.height;

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
        this.canvasInit();
        this.render();
    }

    get mode () {
        return this._mode;
    }
}