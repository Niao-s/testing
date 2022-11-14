import {LightningElement, track, api} from 'lwc';

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
            Dogon: false,
            WelcomeCall: false,
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
            AwaitContractControl: false,
            Other: false,
            Debt: false,
            CallClient: false,
            SupportTask: false,
            Call: false,
            FirstContact: false,
            ReanimationCall: false,
            AutoTask: false
        },
        EmailCall: {
            Empty: true,
            MailAfterMeeting: false,
            AutoTask: false,
            Email: false,
            Messenger: false,
            SupportTask: false
        },
        TaskCall: {
            Empty: true,
            CreativeFormFill: false,
            Call: false,
            Free: false,
            ClientResearch: false,
            Agreement: false,
            ContractCancel: false,
            PaperWork: false,
            WebForm: false,
            ScoringCheck: false,
            AwaitReq: false,
            Meeting: false,
            DebtClosed: false,
            OnControl: false,
            SupTask: false,
            WaitForCreative: false,
            PaymentAwait: false,
            ContractAwait: false,
            QualityControlClient: false,
            GiveContact: false,
            HandyActs: false,
            Replay: false,
            AutoTask: false,
            CreativeAccept: false,
            QualityControlResult: false,
            ToDo: false,
            Scoring: false,
            TicketUpdate: false
        },
        NextCallDate: '',
        NextCallGoal: '',
        SendEmail: {
            Empty: true,
            Yes: false,
            No: false
        },
        EmailGoal: 'Отправить письмо после разговора с клиентом'
    }
    @api
    setLookupData = (data, origin) => {
        console.log(origin);
        if (origin === 'notempl') {
            this.template.querySelector('b2bformfinal-lkcontnotempl').setArray(data);
        }
        if (origin === 'empl') {
            this.template.querySelector('b2bformfinal-lkcontempl').setArray(data);
        }
    }

    @api
    checkForm() {
        let isValidInputs = this.validateInputs();
        console.log(isValidInputs);
        let isValidSelects = this.validateSelects();
        console.log(isValidSelects);
        let isTaskRespLookupValid = this.validateLookupTaskResp();
        console.log(isTaskRespLookupValid);
        if(isValidSelects && isValidInputs && isTaskRespLookupValid){
            let data = this.processFinalScreenData();
            const sendConfirmEvent = new CustomEvent('confirm', {
                detail:data,
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(sendConfirmEvent);
        }
    }

    processFinalScreenData = () => {
        let finalScreenData = {};
        let inputs = this.template.querySelectorAll('.form-control');
        inputs.forEach(elem => {
            if(elem.value){
                finalScreenData[elem.dataset.field] = elem.value;
            }
        });
        let selects = this.template.querySelectorAll('.form-select');
        selects.forEach(elem => {
            if(elem.value){
                finalScreenData[elem.dataset.field] = elem.value;
            }
        });
        let checks = this.template.querySelectorAll('.form-check-input');
        checks.forEach(elem => {
            if(elem.checked && elem.value) {
                finalScreenData[elem.dataset.field] = elem.value;
            }
        });
        if(this.finalScreenData.isCreateTask){
            let firstLookupData = this.template.querySelector('b2bformfinal-lkcontnotempl').currentData;
            if(firstLookupData.id){
                finalScreenData.lookupName = firstLookupData;
            }
            let secondLookupData = this.template.querySelector('b2bformfinal-lkcontempl').currentData;
            finalScreenData.lookupTaskResp = secondLookupData;
        }

        finalScreenData.isCreateTask = this.finalScreenData.isCreateTask;
        console.log(JSON.stringify(finalScreenData));
        return finalScreenData;
    }

    validateInputs = () => {
        let inputs = this.template.querySelectorAll('.form-control');
        let isValid = true;
        inputs.forEach(elem => {
            if (elem.hasAttribute('required') && !elem.value) {
                elem.classList.add('is-invalid');
                isValid = false;
            }

        });
        return isValid;
    }

    validateSelects = () => {
        let selects = this.template.querySelectorAll('.form-select');
        let isValid = true;
        selects.forEach(elem => {
            if (elem.hasAttribute('required') && !elem.value) {
                elem.classList.add('is-invalid');
                isValid = false;
            }

        });
        return isValid;
    }

    validateLookupTaskResp = () => {
        let isValid = true;
        if(this.finalScreenData.isCreateTask) {
            let taskResp = this.template.querySelector('b2bformfinal-lkcontempl').currentData;
            if(!taskResp.id){
                this.template.querySelector('b2bformfinal-lkcontempl').setErrorStyle();
                isValid = false;
            }
        }
        return isValid;
    }

    get isTaskCreateSelected() {
        return this.finalScreenData.isCreateTask
    }

    get isCallType() {
        return this.finalScreenData.Type.Call
    }

    get isEmailType() {
        return this.finalScreenData.Type.Email
    }

    get isTaskType() {
        return this.finalScreenData.Type.Task
    }

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

        if (elem.tagName === 'INPUT') {
            if (fieldType === 'text' || fieldType === 'datetime-local') {
                let value = evt.target.value;
                this.finalScreenData[currentField] = value;
                if (elem.hasAttribute('required') && !value) {
                    elem.classList.add('is-invalid');
                } else {
                    elem.classList.remove('is-invalid');
                }
            }
            if (fieldType === 'checkbox') {
                let checked = evt.target.checked;
                this.finalScreenData[currentField] = checked;
            }
            if(fieldType === 'radio') {
                this.finalScreenData[currentField] = evt.target.value;
            }
        }
        if (elem.tagName === 'SELECT') {
            let value = evt.target.value;
            let innerObj = this.finalScreenData[currentField];
            Object.entries(innerObj).forEach(([selectName, selectValue]) => {
                if (selectName === value) {
                    innerObj[selectName] = true;
                } else {
                    innerObj[selectName] = false;
                }
            });
            if (value) {
                elem.classList.remove('is-invalid');
            }
        }

    }
}