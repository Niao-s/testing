import {LightningElement, api} from 'lwc';

export default class Charts extends LightningElement {
    canvas;
    ctx;
    lastend = 0;
    data = [70,30];
    myTotal = 0;
    myColor = ['#19ce7d', '#c95252'];
    labels = ['Success', 'Error'];

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

    renderedCallback() {
        this.canvas = this.template.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.drawDiagram();
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
            this.ctx.fillText(this.labels[i], w + Math.cos(mid) * (r / 2), h + Math.sin(mid) * (r / 2));
            this.lastend += Math.PI * 2 * (this.data[i] / this.myTotal);
        }
    }
}