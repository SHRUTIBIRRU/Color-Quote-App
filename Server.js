const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.text())
    .use('/', (req, resp) => {
        console.log('body', req.body);
        resp.json(req.body)
        //resp.send('Data Received Successfully');
        //resp.send(req.body)
    })
    .listen(8001, () => console.log('Server listening on port 8001'));
