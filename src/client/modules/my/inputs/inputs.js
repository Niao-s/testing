import {LightningElement} from "lwc";

export default class Inputs extends LightningElement {
    phoneMask = '___________';
    timeSlotMask = '__:__';

    constructor() {

        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
    }


    validateEmail = (evt) => {
        if(!evt.target.value){
            evt.target.setAttribute("placeholder","Enter email");
        }
    }

    setMask = (evt) => {
        evt.target.setAttribute("placeholder","test@mail.com");
    }

    handleEmailInput = (evt) => {
        //Do some check
    }

    doFormatPhone = (str, mask) => {
        let pattern ="***********";
        let strippedValue = str.replace(/[^0-9]/g, "");
        let chars = strippedValue.split('');
        let count = 0;

        let formatted = '';
        for (let i=0; i<pattern.length; i++) {
            const c = pattern[i];
            if (chars[count]) {
                if (/\*/.test(c)) {
                    let currentNum = Number(chars[count]);
                    if(count === 0 && currentNum !== 7 &&  currentNum !== 8 && currentNum !== 3)
                    {
                        break;
                    }
                    if(count === 0 && currentNum === 8)
                    {
                        formatted += '7';
                    }
                    else {
                        formatted += chars[count];
                    }
                    count++;
                } else {
                    formatted += c;
                }
            }
            else if (mask) {
                if (mask.split('')[i])
                    formatted += mask.split('')[i];
            }
        }
        return formatted;
    }

    handlePhoneInput = (evt) => {
        let input = evt.target.value;
        let formattedInput = this.doFormatPhone(input, this.phoneMask);
        let pureInput = this.doFormatPhone(input);
        evt.target.value = formattedInput;
        this.setCaretPos(pureInput, evt.target);
    }

    setCaretPos = (pureInput, elem) => {
        if (elem.createTextRange) {
            let range = elem.createTextRange();
            range.move('character', pureInput.length);
            range.select();
        } else if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(pureInput.length, pureInput.length);
        }
    }

    validatePhone = (evt) => {
        if(evt.target.value === this.phoneMask){
            evt.target.value = '';
        }
    }

    validateFrom = (evt) => {
        let input = evt.target.value;
        let formattedInput = this.doFormatTimeSLots(input, this.timeSlotMask);
        let pureInput = this.doFormatTimeSLots(input);
        evt.target.value = formattedInput;
        this.setCaretPos(pureInput, evt.target);
    }

    doFormatTimeSLots = (x, mask) => {
        let pattern ="**:**";
        let strippedValue = x.replace(/[^0-9]/g, "");
        let chars = strippedValue.split('');
        let count = 0;

        let formatted = '';
        for (let i=0; i<pattern.length; i++) {
            const c = pattern[i];
            if (chars[count]) {
                if (/\*/.test(c)) {
                    let currentNum = Number(chars[count]);
                    if(count === 0 && currentNum !== 0 &&  currentNum !== 1 && currentNum !== 2)
                    {
                        break;
                    }
                    if(count === 2 && currentNum > 5){
                        break;
                    }
                    formatted += chars[count];
                    count++;
                } else {
                    formatted += c;
                }
            } else if (mask) {
                if (mask.split('')[i])
                    formatted += mask.split('')[i];
            }
        }
        return formatted;
    }
}