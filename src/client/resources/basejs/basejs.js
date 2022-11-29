import { LightningElement } from 'lwc';

class Basejs extends LightningElement {
    someProperty2 = 'base property';

    showAlert = () => {
        alert('extends works!');
    }
}

export { Basejs }