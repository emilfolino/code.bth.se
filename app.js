const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const path = require('path');

const fs = require('fs');
const { exec } = require("child_process");

const save = require('./models/save.js');
const auth = require('./models/auth.js');


const port = 8181;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

let data = {
    language: "python",
    assignment: "Write code that prints Hello World"
};

app.get("/load/:hash", (req, res) => res.json(data));

app.post("/save", (req, res) => save.runCode(req, res));

app.post("/auth", (req, res) => auth.authenticateUser(req, res));

app.get('/code', (req, res) => res.sendFile(path.join(__dirname + '/public/code.html')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
