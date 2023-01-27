import { LightningElement } from 'lwc';
const axios = require('axios');

export default class Filereader extends LightningElement {

    imageUrl;
    compressedDataStr;
    ext;
    SavePhoto = async (evt) => {
        let file = evt.target.files[0];
        let name = file.name;
        let lastDot = name.lastIndexOf('.');
        let ext = name.substring(lastDot + 1);
        this.ext = ext.toLowerCase();
        console.log(this.ext);
        this.imageUrl = URL.createObjectURL(file);

        let dataToUpl = await this.getReaderAsDataUrlResult(file);
        this.compressedDataStr = await this.getImageProcessing(dataToUpl);

        console.log('upload data: ' + this.compressedDataStr);
    }

    getReaderAsDataUrlResult = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }

    getImageProcessing = (data) => {
        return new Promise((resolve, reject) => {
            let img, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;
            img = new Image();
            img.src = data;
            img.onload = () => {
                oldWidth = img.width;
                oldHeight = img.height;
                newHeight = Math.floor(oldHeight / oldWidth * 700)

                // Create a temporary canvas to draw the downscaled image on.
                canvas = document.createElement("canvas");
                canvas.width = 700;
                canvas.height = newHeight;

                // Draw the downscaled image on the canvas and return the new data URL.
                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, 700, newHeight);
                newDataUrl = canvas.toDataURL("image/jpeg", 0.7).replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                resolve(newDataUrl);
            }
        });
    }

    uploadFile = async () => {
        let dataObj = {};
        dataObj.base64Data = this.compressedDataStr;
        dataObj.fileName = 'test';
        dataObj.fileType = this.ext;

        const response = await axios.post('/api/v1/doRequestToCreatio', dataObj);
        console.log(response);
    }

}