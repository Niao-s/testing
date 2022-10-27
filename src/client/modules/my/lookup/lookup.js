import {LightningElement} from 'lwc';

export default class Lookup extends LightningElement {
    _handler;
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

    connectedCallback() {
        document.addEventListener('click', this._handler = this.close.bind(this));
        window.onmessage = (event) => {
            let message = event.data ? JSON.parse(event.data) : {};
            if (message && message.command) {
                let command = message.command;
                console.log(command);
            }
        }
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._handler);
    }

    close() {
        this.lookupArray = undefined;
    }

    handleSearchLookup = (evt) => {
        let inputValue = evt.target.value;
        console.log(inputValue);
        this.sendMsgToParent(JSON.stringify({ command: "GetLookupData", searchStr: inputValue }));
    }

    startClickLookupEvt = (evt) => {
        evt.stopPropagation();
        let currentIdx = evt.currentTarget.dataset.idx;
        let currentVal = evt.currentTarget.dataset.val;
        this.lookupResult = currentVal;
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
        return false;
    }

    sendMsgToParent = (message) => {
        window.parent.postMessage((message), '*');
    }
}