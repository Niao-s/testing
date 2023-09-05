import {LightningElement} from "lwc";

export default class fancyinput extends LightningElement {

    simpledText = '';
    fancyText = '';

    openedDivStyle = '<code class="parsedtext">{{';
    closedDivStyle = '}}</code>';

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

    renderedCallback() {
        this.setFancedInput();
    }

    setFancedInput = () => {
        this.simpledText = '{\n' +
            '    "Name": "Account",\n' +
            '    "Id": "{{1.response.Entity.GoLegalEntityId}}",\n' +
            '    "fields": [\n' +
            '        {\n' +
            '            "fieldName": "GoTaxSystemId",\n' +
            '            "fieldValue": "{{request.tax_system}}"\n' +
            '        }\n' +
            '    ]\n' +
            '}';
        this.fancyText = this.simpledText.replaceAll('{{', this.openedDivStyle).replaceAll('}}', this.closedDivStyle);
        console.log(this.fancyText);
        this.template.querySelector('[data-id="faketexstarea"]').innerHTML = this.fancyText;
    }
}