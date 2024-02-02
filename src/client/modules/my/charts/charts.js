import {LightningElement, track} from 'lwc';
const axios = require('axios');

export default class Charts extends LightningElement {
    canvas;
    ctx;
    lastend = 0;
    @track
    data = [];
    myTotal = 0;
    myColor = ['#19ce7d', '#c95252'];
    labels = [];
    reqId;
    completeCount;
    errorCount;
    errorPercent;
    completePercent;

    constructor() {
        super();
        const styles = document.createElement('link');
        styles.href = './resources/css/bootstrap.min.css';
        styles.rel = 'stylesheet';
        this.template.appendChild(styles);
        const styles2 = document.createElement('link');
        styles2.href = './resources/css/charts.min.css';
        styles2.rel = 'stylesheet';
        this.template.appendChild(styles2);
    }

    async renderedCallback() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.reqId = urlParams.get('id');
        let reqData = this.reqId ? await axios.get('/api/get_req_data?req_id=' + this.reqId) : await axios.get('/api/get_req_data');
        let errorCountElem = reqData.data.find(elem => elem.status == 'Error');
        let completeCountElem = reqData.data.find(elem => elem.status == 'Complete');
        this.errorCount = Number(errorCountElem.count);
        this.completeCount = Number(completeCountElem.count);
        this.errorPercent = (this.errorCount/(this.completeCount + this.errorCount))*100;
        this.errorPercent = this.roundToTwo(this.errorPercent);
        this.completePercent = 100 - this.errorPercent;
        console.log(this.errorPercent);
        console.log(this.completePercent);
        this.data.push(this.completeCount, this.errorCount);
        this.labels.push('Complete (' + this.completePercent + '%)', 'Error (' + this.errorPercent + '%)')
        this.canvas = this.template.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.drawDiagram();
    }

    roundToTwo = (number) => {
        return +(Math.round(number + "e+2") + "e-2");
    }

    drawDiagram = () => {
        for (let e = 0; e < this.data.length; e++) {
            this.myTotal += this.data[e];
        }
        let off = 10
        let w = (this.canvas.width - off) / 2
        let h = (this.canvas.height - off) / 2
        for (let i = 0; i < this.data.length; i++) {
            this.ctx.fillStyle = this.myColor[i];
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(w, h);
            let len = (this.data[i] / this.myTotal) * 2 * Math.PI
            let r = h - off / 2
            this.ctx.arc(w, h, r, this.lastend, this.lastend + len, false);
            this.ctx.lineTo(w, h);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = 'white';
            this.ctx.font = "20px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            let mid = this.lastend + len / 2
            this.ctx.fillText(this.labels[i], w + Math.cos(mid) * (r / 2), h + Math.sin(mid) * (r / 2) + 15);
            this.lastend += Math.PI * 2 * (this.data[i] / this.myTotal);
        }
    }
}