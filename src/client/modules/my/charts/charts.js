import {LightningElement, api} from 'lwc';

export default class Charts extends LightningElement {

    constructor() {
        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
        const styles2 = document.createElement('link');
        styles2.href = './resources/css/charts.min.css';
        styles2.rel = 'stylesheet';
        this.template.appendChild(styles2);
    }

}