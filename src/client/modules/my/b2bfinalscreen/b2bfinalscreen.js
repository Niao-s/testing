import { LightningElement, track } from 'lwc';

export default class B2bfinalscreen extends LightningElement {
    @track
    finalScreenData = {
        TaskResult: '',
        isCreateTask: false,
        Type: {
            Empty: true,
            Call: false,
            Email: false,
            Task: false
        },
        CategoryCall: {
            Empty: true,
            Call: false,
            Fall: false,
            Info: false,
            Activation: false,
            ColdCall: false,
            LPR: false,
            AnswerCall: false,
            FirstRideControl: false,
            ServicePresentation: false,
            Prequalify: false,
            CreativeControl: false,
            AwaitContractControl: false
        }
    }

    get isTaskCreateSelected() {return this.finalScreenData.isCreateTask}
    get isCallType() {return this.finalScreenData.Type.Call}

    constructor() {

        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
    }

    handleFieldChange = (evt) => {

        let fieldType = evt.target.type;
        let currentField = evt.target.dataset.field;
        let elem = this.template.querySelector(`[data-field="${currentField}"]`);
        console.log(elem.tagName);
        if(elem.tagName === 'INPUT'){
            if(fieldType === 'text'){
                let value = evt.target.value;
                this.finalScreenData[currentField] = value;
            }
            if(fieldType === 'checkbox'){
                let checked = evt.target.checked;
                this.finalScreenData[currentField] = checked;
            }
        }
        if(elem.tagName === 'SELECT'){
            let value = evt.target.value;
            let innerObj = this.finalScreenData[currentField];
            console.log(value);
            console.log(currentField);
            Object.entries(innerObj).forEach(([selectName, selectValue]) => {
                if(selectName === value){
                    innerObj[selectName] = true;
                }
                else {
                    innerObj[selectName] = false;
                }
            });
        }
        console.log(this.finalScreenData);
    }
}