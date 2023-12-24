module.exports = {
    validateUsername: function validateUsername(username) {
        const pattern = /^[a-zA-Z0-9_-]+$/;
        return pattern.test(username);
    },
    validatePassword: function validatePassword(password) {
        return password.length >= 8 && password.length <= 64;
    }
}