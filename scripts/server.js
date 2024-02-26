// Simple Express server setup to serve the build output
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const vm = require('vm');
const apiRoutes = require('./router');
const nestedProperty = require("nested-property");
const CsvParser = require("json2csv").Parser;
const schedule = require('node-schedule');

const {
    Worker,
    isMainThread,
    workerData,
    parentPort,
} = require("worker_threads");

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
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

app.get("/api/v1/test_workers", async (req,res) => {
    const worker = new Worker('./scripts/worker_thread.js');
    worker.on("message", count => {
        res.status(200).send(`The final count :${count}`);
    });
    worker.on("error", err => {
        console.error(err);
        res.status(400).send(`error worker thread`);
    });
    worker.postMessage({coucou : 'john'});
});


app.get("/api/v1/set_timer", (req,res) => {
    const date = new Date(Date.now() + 5000);
    const job = schedule.scheduleJob(date, function(){
        console.log('Test job after 5 sec');
    });
    res.send("timer ready");
});

const pool = require("./api/dbConfig");
app.get("/api/get_req_data", async (req,res) => {
    let selectQuery;
    if(req.query.req_id) {
        selectQuery = {
            text: 'SELECT status, count(status) FROM request_results WHERE request_id = $1 GROUP BY status',
            values: [req.query.req_id]
        }
    }
    else {
        selectQuery = {
            text: 'SELECT status, count(status) FROM request_results GROUP BY status'
        }
    }
    let result = await pool.query(selectQuery);
    console.log(result.rows);
    res.send(result.rows);
});

app.get("/api/v1/check_in_server", (req,res) => {
    res.send("hello from server");
});

app.get("/nested_prop", (req,res) => {
    const data = {
        a: {
            b: [
                10,
                20
            ]
        }
    };
    var array = [{
        a: {
            b: [0, 1]
        }
    }];
    let testArrData = nestedProperty.get(array, "0.a.b.0");
    console.log(testArrData);
    let testData = nestedProperty.get(data, "a.b.1");
    console.log(testData);
    nestedProperty.set(data, "req.data", "test");
    console.log(data);
    res.send("ok");
});
// Routes
app.use('/api',apiRoutes());

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
const tokenList = {}
app.get('/login/sighn_token',(req, res) => {
    let test_user = {
        username: 'test',
        userpassword: 'pass',
        email: 'test@mail.com',
        phone: '123456789'
    }
    let code_str = 'AUTH_CODE_STR';
    let token = jwt.sign(test_user, code_str, { expiresIn: '1h' });
    let refreshToken = jwt.sign(test_user, code_str, { expiresIn: '24h'});
    const response = {
        "status": "Logged in",
        "token": token,
        "refreshToken": refreshToken,
    };
    tokenList[refreshToken] = response;
    res.status(200).json(response);
});


app.post('/refresh_token', (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        let test_user = {
            username: 'test',
            userpassword: 'pass',
            email: 'test@mail.com',
            phone: '123456789'
        }
        let token = jwt.sign(test_user, 'AUTH_CODE_STR', { expiresIn: '1h' });
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
})


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

app.post("/doSomeCode", (req,res) => {
    console.log(JSON.stringify(req.body));
    let body = req.body;
    if(!req.body) return res.sendStatus(400);
    try {
        let codeStr = 'testFunc = () => {console.log("test func")};' + 'var uuid = crypto.randomUUID();\n' +
            'console.log(uuid);' +
            'this["0"].response.Entity.Phone = this["0"].response.Entity.Phone.replace("+7", "");' +
            'if(request.testField) {console.log("test field exist")};' +
            'if(this["0"].response.Entity.CountryName == "Israel")' +
            '{this["0"].response.Entity.CountryName = "Isr"} ' +
            'else {this["0"].response.Entity.CountryName = "Other"}; ' +
            'request.randName = generate_name("Opp:", request.name, request.email, "Test");' +
            'testFunc();';
        let context = evaluate_code(body, codeStr);
        res.send(context);
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/doSomeCodeAnother", async(req,res) => {
    console.log(JSON.stringify(req.body));
    let body = req.body;
    if(!req.body) return res.sendStatus(400);
    try {
        let codeStr = 'console.log(Entity.GoName); console.log("test" === "test");' +
            'Entity.GoClientGoName = "test"; Entity.TestProp = "test2"; var Test = ["1","2"]; Test.push("3", "4")';
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


app.use(express.static(__dirname));
app.use('/json_validator', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname + '/index2.html'));
});
app.use(express.static(DIST_DIR));
app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
