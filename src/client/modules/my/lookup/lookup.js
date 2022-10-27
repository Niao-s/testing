import {LightningElement} from 'lwc';

export default class Lookup extends LightningElement {
    lookupResult = '';
    lookupArray = [
        {
        id: '123',
        value: 'Иванов Иван Иванович'
        },
        {
            id: '321',
            value: 'Петров Петр Петрович'
        },
    ];

    constructor() {
        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
    }

    handleSearchLookup = (evt) => {
        let inputValue = evt.target.value;
        console.log(evt.target.value);
    }

    startClickLookupEvt = (evt) => {
        let currentIdx = evt.currentTarget.dataset.idx;
        let currentVal = evt.currentTarget.dataset.val;
        const action = new CustomEvent('vallicked', {
            detail: {
                currentIdx: currentIdx,
                currentVal: currentVal
            },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(action);
        this.lookupArray = undefined;
    }
}