const bcrypt = require('bcrypt');
const saltRounds = 10;
const accountModel = require('./models/account.model');

const account = {
    username: 'admin2',
    password: 'admin',
    role: 'leader'
};

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(account.password, salt);
const param = {
    username: account.username,
    password: hash,
    role: account.role,
};
accountModel.createAccount(param);