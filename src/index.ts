import { assign } from './utils';

const defaultOption = {

}
const template = `
    <canvas id="gt-img"></canvas>
    <input type="file">
`;

export default class GeeTailor {
    public el: Element;
    public option: object;
    public btns: Array<HTMLButtonElement> = [];
    constructor (el: Element, option: object) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = assign(defaultOption, option);
        this.init();
    }

    init () {

    }

    addBtns () {
        const upload = this.btns['upload'] = document.createElement('button');
        upload.innerText = 'Upload';
        upload.addEventListener
    }
}