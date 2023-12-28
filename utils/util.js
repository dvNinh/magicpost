module.exports = {
    randomString: function randomString(len) {
        let string = '';
        let source = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < len; i++) {
            string += source.charAt(Math.floor(Math.random() * source.length));
        }
        return string;
    }
}

