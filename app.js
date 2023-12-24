const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
}));

var cors = require('cors')
app.use(cors({
	origin: (origin, callback) => { callback(null, true); },
	credentials: true
}));

const router = require('./route.js');
app.use(router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})