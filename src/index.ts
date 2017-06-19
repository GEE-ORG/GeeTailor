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
    <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M50,99 C77.0619527,99 99,77.0619527 99,50 C99,22.9380473 77.0619527,1 50,1 C22.9380473,1 1,22.9380473 1,50 C1,77.0619527 22.9380473,99 50,99 Z" id="Combined-Shape" stroke="none" fill-opacity="0.5" fill="#000000" fill-rule="evenodd"></path>
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

    constructor (el: Element, option: object) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = assign(defaultOption, option);
        this.el.innerHTML = template;
        nextTick(this.init.bind(this));
    }

    init () {
        this.canvas = this.el.querySelector('.gt-img') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.option.width;
        this.canvas.height = this.option.height;

        this.upload = this.el.querySelector('.gt-upload') as HTMLButtonElement;
        this.btns['upload'] = this.el.querySelector('.gt-ctrl_upload') as HTMLButtonElement;

        this.addEvents();

        console.log(this);
    }

    drawBg () {

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
    }

    setImg (img) {

        const option = this.option;

        URL.revokeObjectURL(img.src);

        this.img.width = img.width;
        this.img.height = img.height;
        const radio = img.width / img.height;

        if (img.width > this.option.width || img.height > this,option.height) {
            
        }

        this.ctx.clearRect(0, 0, option.width, option.height);
        this.ctx.drawImage(img, 0, 0);

        this.drawCircleMask();
    }
}