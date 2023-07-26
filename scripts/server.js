// Simple Express server setup to serve the build output
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const vm = require('vm');

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);
app.use(compression());

//For http response parse
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

setHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
}

const pool = require('./api/dbConfig');
const dbInit = require('./api/dbInit');
dbInit();

app.use('/api/*',(req, res, next) => {
    console.log('Middleware says %s %s', req.method, req.url);
    console.log(req.query.token);
    let token_to_verify = req.query.token;
    try {
        let decoded = jwt.verify(token_to_verify, 'AUTH_CODE_STR');
        console.log(decoded);
    } catch(err) {
        console.log('wrong token');
    }
    next();
})

app.get("/api/v1/pool", async (req, res) => {
    try {
        console.log('recieved');
        const data = fs.readFileSync(__dirname + '/test.txt', 'utf8');
        console.log(data);
        res.send(data);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/sighn_token',(req, res) => {
    let test_user = {
        username: 'test',
        userpassword: 'pass',
        email: 'test@mail.com',
        phone: '123456789'
    }
    let code_str = 'AUTH_CODE_STR';
    let token = jwt.sign(test_user, code_str, { expiresIn: '1h' });
    res.send(token);
});

app.get("/api/v1/sample", async (req, res) => {
    try {
        console.log('recieved');
        const response = await axios({
            url: "https://jsonplaceholder.typicode.com/todos/1",
            method: "get",
        });
        console.log('awaited');
        res.send(response.data);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/v1/writeFile", (req,res) => {
    let json = require('/app/src/client/static_data/testData.json');
    console.log(json);
    res.send(json);
});

app.post("/api/v1/doRequestToDadata", async(req,res) => {
    console.log(JSON.stringify(req.body));
    let body = req.body;
    if(!req.body) return res.sendStatus(400);
    try {
        let config = {
            headers: {
                Authorization: 'Token 7877cbceae35dd583719c5b5356e70e4410ed6d1',
            }
        }
        const response = await axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party', {
            query: body.query,
            count: 5
        }, config)
        res.send(response.data);
    }
    catch (err) {
        console.log(err);
    }
});

const evaluate_code  = require('./api/vm_code/evaluate_custom_code');

app.post("/doSomeCode", async(req,res) => {
    console.log(JSON.stringify(req.body));
    let body = req.body;
    if(!req.body) return res.sendStatus(400);
    try {
        let codeStr = 'var uuid = crypto.randomUUID();\n' +
            'console.log(uuid);' +
            'phone = phone.replace("+7", "");' +
            'if(country == "RU")' +
            '{country = "Russia"} ' +
            'else { country = "Other"}; ' +
            'var randName = generate_name(name, phone, email, "Test");';
        let context = evaluate_code(body, codeStr);
        res.send(context);
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/api/v1/doRequestToCreatio", async(req,res) => {
    console.log(JSON.stringify(req.body));
    let body = req.body;
    if(!req.body) return res.sendStatus(400);
    try {
        let config = {
            headers: {
                'X-External-API-Key': '',
                'X-External-Service': ''
            }
        }
        const response = await axios.post('http://dev1.nau.io:8015/0/ServiceModel/GoFileUploader.svc/UploadFile', body, config)
        res.send(response.data);
    }
    catch (err) {
        console.log(err);
    }
});

app.get("/api/v1/checkDeliveryZone", async(req,res) => {
    console.log('req');
    try {
        let config = {
            headers: {
                'X-API-KEY': 'a02856459a4e809e542e60b8563b5c27',
            }
        }
        const response = await axios.get('https://eda.yandex/external/v1/salesforce/courier-zone/check?latitude=55.773449&longitude=37.63164', config);
        console.log(response);
        res.send(response.data);
    }
    catch (err) {
        console.log(err);
    }
});

app.use(express.static(DIST_DIR));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
