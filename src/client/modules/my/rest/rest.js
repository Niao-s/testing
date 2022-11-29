import restData from './data.json'
import {Basejs} from '../../../resources/basejs/basejs';

export default class Rest extends Basejs {
    restData = [];

    constructor() {

        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
    }

    connectedCallback() {
        console.log(restData);
        console.log(this.someProperty2);
        this.showAlert();
        this.restData = restData;
    }

    openRestForm = (evt) => {
        console.log('open');
        window.open('https://ya-restaurants.onrender.com?entId=' + evt.target.dataset.ent);
    }
}