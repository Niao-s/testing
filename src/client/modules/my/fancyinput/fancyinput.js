import {LightningElement} from "lwc";

export default class fancyinput extends LightningElement {

    constructor() {

        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
    }

    connectedCallback() {
        console.log('test');
    }
}