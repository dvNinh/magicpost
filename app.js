const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());

const router = require('./route.js');
app.use(router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})