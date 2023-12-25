module.exports = {
    validateUsername: function validateUsername(username) {
        const pattern = /^[a-zA-Z0-9_-]+$/;
        return pattern.test(username);
    },
    validatePassword: function validatePassword(password) {
        return password.length >= 8 && password.length <= 64;
    },
    validateRole: function validateRole(role) {
        const roles = [
            'leader',
            'dean_tran',
            'dean_gather',
            'transacting',
            'gathering'
        ]
        for (let r of roles) {
            if (role == r) return true;
        }
        return false;
    }
}