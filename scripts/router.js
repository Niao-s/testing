const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

const apiRoutes = () => {
    router.use('/*',(req, res, next) => {
        console.log('Middleware says %s %s', req.method, req.url);
        console.log(req.query.token);
        let token_to_verify = req.query.token || req.headers['x-access-token'];
        try {
            let decoded = jwt.verify(token_to_verify, 'AUTH_CODE_STR');
            console.log(decoded);
            let test_user = {
                username: decoded.username,
                userpassword: decoded.userpassword,
                email: decoded.email,
                phone: decoded.phone
            }
            let code_str = 'AUTH_CODE_STR';
            let newToken = jwt.sign(test_user, code_str, { expiresIn: '1h' });
            res.append('x-access-token-new', newToken);
            console.log(newToken);
            next();
        } catch(err) {
            console.log('wrong token');
            let message = ['Failed to decrypt token.'];
            res.status(401).json({
                success: false,
                message
            });
        }
    });

    router.get("/v1/sample", async (req, res) => {
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

    router.get("/v1/check", async (req, res) => {
        res.send({text : "Hello from router"});
    });

    return router;
}

module.exports = apiRoutes;
