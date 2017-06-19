import { assign, nextTick } from './utils';

const defaultOption = {
    width: 800,
    height: 500
}
const template = `
    <canvas class="gt-img" style="background-color: rgba(0,0,0,.8)"></canvas>
    <input class="gt-upload" type="file" accept="image/jpg,image/png" style="display: none">
    <section class="gt-ctrl">
        <button class="gt-ctrl_upload">Upload</button>
        <button class="gt-ctrl_export">Export</button>
    </section>
`;
const circleMask = `
<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,100 C77.6142375,100 100,77.6142375 100,50 C100,22.3857625 77.6142375,0 50,0 C22.3857625,0 0,22.3857625 0,50 C0,77.6142375 22.3857625,100 50,100 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>
</svg>`;

export default class GeeTailor {

    public el: Element;
    public option: any;
    
    public btns: {new(): HTMLButtonElement} = {} as any;
    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private upload: HTMLButtonElement;

    private img = {
        width: 0,
        height: 0
    };

    private _mode: 'avatar'|'free';

    constructor (el: Element, option: object) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = assign(defaultOption, option);
        this.el.innerHTML = template;
        nextTick(this.init.bind(this));
    }

    init () {
        this.canvas = this.el.querySelector('.gt-img') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.canvasInit();

        this.upload = this.el.querySelector('.gt-upload') as HTMLButtonElement;
        this.btns['upload'] = this.el.querySelector('.gt-ctrl_upload') as HTMLButtonElement;

        this.addEvents();

        this.mode === 'avatar' && this.drawCircleMask();

        console.log(this);
    }

    canvasInit () {
        this.canvas.width = this.option.width;
        this.canvas.height = this.option.height;
        this.canvas.style.width = this.canvas.width / window.devicePixelRatio + 'px';
        this.canvas.style.height = this.canvas.height / window.devicePixelRatio + 'px';
    }

    drawBg () {

    }

    drawImg () {

    }

    drawMask () {
        
    }

    drawCircleMask () {
        const img = new Image;
        const data = new Blob([circleMask], {type: 'image/svg+xml'});
        img.onload = () => {
            const maskWidth = this.option.width > this.option.height ? 
                                this.option.height :
                                this.option.width;
            const offsetX = (this.option.width - maskWidth) / 2;
            const offsetY = (this.option.height - maskWidth) / 2;
            console.log(this.option.width, this.option.height, offsetX, offsetY, maskWidth);
            this.ctx.drawImage(img, offsetX, offsetY, maskWidth, maskWidth);
        };
        img.src = URL.createObjectURL(data);
    }

    addEvents () {
        this.btns['upload'].addEventListener('click', () => {
            this.upload.click();
        });
        this.upload.addEventListener('change', (e: any) => {
            
            const imgFile = e.target.files[0];
            if (!/image\/(jpg|jpeg|png)/.test(imgFile.type)) {
                console.error('Only support jpg and png format.');
                return;
            }
            
            const img = new Image;
            img.onload = () => {
                this.setImg(img);
            };
            img.src = URL.createObjectURL(imgFile);
        });
        document.addEventListener('wheel', e => {
            if (e.target === this.canvas) {
                console.log(e.wheelDeltaY);
            }
        });
    }

    setImg (img) {

        const option = this.option;

        URL.revokeObjectURL(img.src);

        this.img.width = img.width;
        this.img.height = img.height;
        const radio = img.width / img.height;

        const imgBounding = {
            width: img.width,
            height: img.height,
            offsetX: 0,
            offsetY: 0
        };

        if (img.width > this.option.width) {
            const scaleY = this.option.width / img.width;
            imgBounding.width = this.option.width;
            imgBounding.height = scaleY * imgBounding.height;
        }
        if (img.height > this.option.height) {
            const scaleX = this.option.height / imgBounding.height;
            imgBounding.height = this.option.height;
            imgBounding.width *= scaleX;
        } 

        imgBounding.offsetX = (this.option.width - imgBounding.width) / 2;
        imgBounding.offsetY =  (this.option.height - imgBounding.height) / 2;

        this.ctx.clearRect(0, 0, this.option.width, this.option.height);
        this.ctx.drawImage(
            img,
            imgBounding.offsetX, 
            imgBounding.offsetY, 
            imgBounding.width, 
            imgBounding.height
        );

        this.mode === 'avatar' && this.drawCircleMask();
    }

    set mode (val: 'avatar' | 'free') {
        switch (val) {
            case 'avatar': {
                this.option.width > this.option.height ?
                    this.canvas.width = this.option.width = this.option.height :
                    this.canvas.height = this.option.height = this.canvas.width;
                break;
            }
        }
        this.canvasInit();
        this._mode = val;
    }

    get mode () {
        return this._mode;
    }
}