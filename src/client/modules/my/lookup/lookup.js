import {LightningElement, api} from 'lwc';
import lookupSettings from './settings.json'

export default class Lookup extends LightningElement {
    _handler;
    lookupResult = '';
    lookupId;
    lookupArray;

    addressTimerId;

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
                if(command === 'setdata'){
                    let incData = message.data;
                    this.lookupArray = incData;
                }
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
        this.lookupResult = inputValue;
        this.lookupId = undefined;

        if(inputValue.length < 3){
            this.lookupArray = undefined;
            return;
        }

        clearTimeout(this.addressTimerId);

        let transferData;
        let serializedData = JSON.stringify(lookupSettings);
        transferData = serializedData.replace("searchValue", inputValue);

        this.addressTimerId = setTimeout( () => {
            this.sendMsgToParent(JSON.stringify({ command: "GetLookupData", message: transferData }));
        }, 1000);
    }

    startClickLookupEvt = (evt) => {
        evt.stopPropagation();

        this.lookupResult = evt.currentTarget.dataset.val;
        this.lookupId = evt.currentTarget.dataset.idx;

        this.lookupArray = undefined;
        return false;
    }

    goToEntity = () => {
        if(this.lookupId){
            console.log('no id');
        }
        else {
            console.log(this.lookupId);
        }
    }

    sendMsgToParent = (message) => {
        window.parent.postMessage((message), '*');
    }
}