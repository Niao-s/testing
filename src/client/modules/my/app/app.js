import { LightningElement } from 'lwc';
import ymaps from 'ymaps';
const axios = require('axios');
import jsonTest from '../../../static_data/testData.json'
import testJsonData from './jsonTestData.json'

export default class App extends LightningElement {
    currentData = {
        GivenName: '',
        Surname: '',
        SomeApiName: ''
    };

    maps;

    timerId;
    addressTimerId;
    searchResult = '';
    searchAddress = '';
    finalSuggestions = [];
    finalAddresses = [];
    cachedAddress;
    treeData;
    _handler;

    constructor() {

        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
    }

    get showInnVariants(){ return this.finalSuggestions.length > 0}
    get showAddressVariants() {return this.finalAddresses.length > 0}

    connectedCallback() {
        console.log(jsonTest);
        this.treeData = testJsonData;
        document.addEventListener('click', this._handler = this.close.bind(this));
        ymaps.load('https://api-maps.yandex.ru/2.1/?lang=ru&load=SuggestView,geocode,package.full&apikey=cda026cb-6d1c-42a2-9988-a291cd04bcab')
            .then(maps => {
                console.log('loaded');
                this.maps = maps;
            })
            .catch(error => console.log('Failed to load Yandex Maps', error));

        window.onmessage = (event) => {
            let message = event.data ? JSON.parse(event.data) : {};
            if (message && message.command) {
                let command = message.command;
                if(command === 'setdatalookup'){
                    let incData = message.data;
                    let origin = message.origin;
                    this.template.querySelector('b2bformfinal-screen').setLookupData(incData, origin);
                }
            }
        }

    }

    disconnectedCallback() {
        document.removeEventListener('click', this._handler);
    }
    ignore(event) {
        event.stopPropagation();
        return false;
    }
    close() {
        this.finalAddresses = [];
    }

    processNode = (evt) => {
        let currentLvl = evt.currentTarget.dataset.level;
        let elementToProcess = this.template.querySelector(`[data-level="${currentLvl}"]`);
        elementToProcess.parentElement.querySelector(".nested").classList.toggle("active");
        elementToProcess.classList.toggle("caret-down");
    }

    handleChange = (evt) => {
        let targetType = evt.target.type;
        if (targetType === 'text' || targetType === 'textarea'){
            let key = evt.target.dataset.field;
            this.currentData[key] =evt.target.value;
        }
    }

    clickButton = () => {
        console.log(JSON.stringify(this.currentData));
        let values = this.template.querySelectorAll('.form-control');
        values.forEach(elem => {
           console.log(elem.dataset.question);
        });
    }

    modifyFile = () => {
        let json = require('../../../static_data/testData.json');
        console.log(json);
    }

    clearAddressArray = () => {
        this.searchAddress = '';
        this.finalAddresses = [];
    }

    clearINNArray = () => {
        this.searchResult = '';
        this.finalSuggestions = [];
    }

    handleSearchAddress = (evt) => {
        this.searchAddress = evt.target.value;
        clearTimeout(this.addressTimerId);
        this.addressTimerId = setTimeout( () => {
            this.doRequestToYaMaps(this.searchAddress);
        }, 1000);
    }

    handleSearchINN = (evt) => {
        console.log(evt.target.value);
        this.searchResult = evt.target.value;
        clearTimeout(this.timerId);
        this.timerId = setTimeout( () => {
            this.doRequest(this.searchResult);
        }, 1000);
    }

    doRequestToYaMaps = async (searchStr) => {
        let result = await new this.maps.suggest(searchStr);
        this.finalAddresses = [];
        console.log(JSON.stringify(result));
        if(result){
            result.forEach((elem, index) => {
                this.finalAddresses = [...this.finalAddresses, {
                    value: elem.displayName,
                    id: index
                }];
            });
            console.log(JSON.stringify(this.finalAddresses));
        }
    }

    tryYaGeocode =async () => {
        let res = await new this.maps.geocode(this.searchAddress);
        console.log(res);
        let obj = res.geoObjects.get(0);
        let comp = obj.properties._data.metaDataProperty.GeocoderMetaData.Address.Components;
        let coordinates = obj.geometry._coordinates;
        let citySelected;
        let country;
        let street;
        let house;
        let latitude = coordinates &&  coordinates[0] ? coordinates[0] : '';
        let longitude = coordinates &&  coordinates[1] ? coordinates[1] : '';

        let translatedAddress = obj.properties._data.text;
        console.log(translatedAddress);

        comp.forEach(elem => {
            if(elem.kind === 'locality') {
                citySelected = elem.name;
            }
            if(elem.kind === 'country') {
                country = elem.name;
            }
            if(elem.kind === 'street') {
                street = elem.name;
            }
            if(elem.kind === 'house') {
                house = elem.name;
            }
        })

        console.log(obj);
        let geoObj = {
            citySelected: citySelected,
            country: country,
            street: street,
            house: house,
            latitude: latitude,
            longitude: longitude,
            translatedAddress: translatedAddress
        }
        console.log(geoObj);
        return geoObj;
    }

    setCurrentAddress = (evt) => {
        let currentIdx = evt.currentTarget.dataset.idx;
        let currentElem = this.finalAddresses.find(elem => {
            return elem.id == currentIdx
        });
        console.log(currentElem);
        this.searchAddress = currentElem.value;
        this.cachedAddress = currentElem.value;
        this.finalAddresses = [];
    }

    handleAddressChange = () => {
        if(this.searchAddress !== this.cachedAddress){
            this.searchAddress = this.cachedAddress;
        }
    }

    doRequest = async (reqQuery) => {
        let query = { query: reqQuery};
        const response = await axios.post('/api/v1/doRequestToDadata', query);
        if(response.data) {
            this.finalSuggestions = [];
            let responceData = response.data.suggestions;
            responceData.forEach((elem, index) => {
                this.finalSuggestions = [...this.finalSuggestions, {
                    value: elem.value,
                    inn: elem.data.inn,
                    address: elem.data.address.value,
                    id: index
                }];
            });
            console.log(JSON.stringify(this.finalSuggestions));
        }
    }

    setCurrentOrg = (evt) => {
        let currentIdx = evt.currentTarget.dataset.idx;
        console.log(currentIdx);
        let currentElem = this.finalSuggestions.find(elem => {
            return elem.id == currentIdx
        });
        console.log(currentElem);
        this.searchResult = currentElem.inn + ' ' + currentElem.value + ' ' + currentElem.address;
        this.finalSuggestions = [];
        this.ignore(evt);
    }

    handleLookupValClicked = (evt) => {
        console.log(JSON.stringify(evt.detail));
    }

    getLookupData = () => {
        let data = this.template.querySelector('my-lookup').currentData;
        console.log(data);
    }

    tryCheck = async () => {
        const response = await axios.get('/api/v1/checkDeliveryZone');
        console.log(response);
    }

    validateFinalScreen = () => {
        this.template.querySelector('b2bformfinal-screen').checkForm();
    }

    processFinalData = (evt) => {
        console.log(JSON.stringify(evt.detail));
    }
}
