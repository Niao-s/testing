import { LightningElement, track, api } from 'lwc';

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
        NextCallGoal: ''
    }
    @api
    setLookupData = (data, origin) => {
        console.log(origin);
        if(origin === 'notempl'){
            this.template.querySelector('b2bformfinal-lkcontnotempl').setArray(data);
        }
        if(origin === 'empl'){
            this.template.querySelector('b2bformfinal-lkcontempl').setArray(data);
        }
    }

    get isTaskCreateSelected() {return this.finalScreenData.isCreateTask}
    get isCallType() {return this.finalScreenData.Type.Call}
    get isEmailType() {return this.finalScreenData.Type.Email}
    get isTaskType() {return this.finalScreenData.Type.Task}

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
            if(fieldType === 'text' || fieldType === 'datetime-local'){
                let value = evt.target.value;
                console.log(value);
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
        console.log(JSON.stringify(this.finalScreenData));
    }
}