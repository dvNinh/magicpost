const bcrypt = require('bcrypt');
const saltRounds = 10;
const accountModel = require('./models/account.model');

const account = {
    username: 'admin',
    password: 'admin123',
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