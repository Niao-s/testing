/**
 * Created by Niao on 19.12.2020.
 */

import {LightningElement} from 'lwc';

export default class Hexagon extends LightningElement {
    canvas;
    ctx;
    w;
    h;
    opts = {
        len: 50,
        count: 300,
        baseTime: 10,
        addedTime: 10,
        dieChance: .01,
        spawnChance: 5,
        sparkChance: .0,
        sparkDist: 10,
        sparkSize: 2,

        color: 'hsl(hue,100%,light%)',
        baseLight: 50,
        addedLight: 10, // [50-10,50+10]
        shadowToTimePropMult: 1,
        baseLightInputMultiplier: .01,
        addedLightInputMultiplier: .02,
        repaintAlpha: 0.01,
        hueChange: 0.01
    };
    tick = 0;
    lines = [];
    dieX;
    dieY;
    baseRad = Math.PI * 2 / 6;
    requestId;

    renderedCallback() {
        console.log('canvas drawing');
        this.canvas = this.template.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
        this.opts.cx = this.w / 2;
        this.opts.cy = this.h / 2;

        this.clearBaseSettings();
        this.loop();
    }

    loop = () => {
        this.requestId = window.requestAnimationFrame(this.loop);
        ++this.tick;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', this.opts.repaintAlpha);
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.globalCompositeOperation = 'lighter';

        if (this.lines.length < this.opts.count && Math.random() < this.opts.spawnChance) {
            let newLine = {};
            this.reset(newLine);
            this.lines.push(newLine);
        }
        this.lines.forEach(elem => {
            this.step(elem);
        });

    }

    Line = {};

    reset = (lineObj) => {
        lineObj.x = 0;
        lineObj.y = 0;
        lineObj.addedX = 0;
        lineObj.addedY = 0;
        lineObj.rad = 0;
        lineObj.lightInputMultiplier = this.opts.baseLightInputMultiplier + this.opts.addedLightInputMultiplier * Math.random();
        lineObj.color = this.opts.color.replace('hue', this.tick * this.opts.hueChange);
        lineObj.cumulativeTime = 0;
        this.beginPhase(lineObj);
    }

    beginPhase = (currentLine) => {
        currentLine.x += currentLine.addedX;
        currentLine.y += currentLine.addedY;

        currentLine.time = 0;
        currentLine.targetTime = (this.opts.baseTime + this.opts.addedTime * Math.random()) | 0;

        currentLine.rad += this.baseRad * (Math.random() < .5 ? 1 : -1);
        currentLine.addedX = Math.cos(currentLine.rad);
        currentLine.addedY = Math.sin(currentLine.rad);

        if (Math.random() < this.opts.dieChance || currentLine.x > this.dieX || currentLine.x < -this.dieX || currentLine.y > this.dieY || currentLine.y < -this.dieY)
            this.reset(currentLine);
    }

    step = (objToStep) => {
        ++objToStep.time;
        ++objToStep.cumulativeTime;

        if (objToStep.time >= objToStep.targetTime)
            this.beginPhase(objToStep);

        let prop = objToStep.time / objToStep.targetTime,
            wave = Math.sin(prop * Math.PI / 2),
            x = objToStep.addedX * wave,
            y = objToStep.addedY * wave;

        this.ctx.shadowBlur = prop * this.opts.shadowToTimePropMult;
        this.ctx.fillStyle = this.ctx.shadowColor = objToStep.color.replace('light', this.opts.baseLight + this.opts.addedLight * Math.sin(objToStep.cumulativeTime * objToStep.lightInputMultiplier));
        this.ctx.fillRect(this.opts.cx + (objToStep.x + x) * this.opts.len, this.opts.cy + (objToStep.y + y) * this.opts.len, 2, 2);

        if (Math.random() < this.opts.sparkChance)
            this.ctx.fillRect(this.opts.cx + (objToStep.x + x) * this.opts.len + Math.random() * this.opts.sparkDist * (Math.random() < .5 ? 1 : -1) - this.opts.sparkSize / 2, this.opts.cy + (objToStep.y + y) * this.opts.len + Math.random() * this.opts.sparkDist * (Math.random() < .5 ? 1 : -1) - this.opts.sparkSize / 2, this.opts.sparkSize, this.opts.sparkSize)
    }

    applySettings = async () => {
        this.template.querySelectorAll("lightning-input").forEach(item => {
            this.opts[item.dataset.value] = item.value;
        });
        window.cancelAnimationFrame(this.requestId);
        this.tick = 0;
        this.lines = [];
        this.clearBaseSettings();
        this.loop();

    }

    clearBaseSettings = () => {
        this.dieX = this.w / 2 / this.opts.len;
        this.dieY = this.h / 2 / this.opts.len;
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = 'black';
        this.ctx.shadowBlur=0;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }
}