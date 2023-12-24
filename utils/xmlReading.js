const fs = require('fs');
const xml2js = require('xml2js');

module.exports = new Promise((resolve, reject) => {
    fs.readFile('./dvhc_data.xml', 'utf8', (err, data) => {
        if (err) reject(err);
        var parser = new xml2js.Parser();
        parser.parseString(data, (err, result) => {
            if (err) reject(err);
            let tinh = {}, huyen = {};
            data = result.DonViHanhChinhVietNam.DVHC;
            for (let dvhc of data) {
                if (dvhc.Cap[0] == 'TINH') {
                    tinh[dvhc.MaDVHC[0]] = dvhc.Ten[0];
                }
                if (dvhc.Cap[0] == 'HUYEN') {
                    huyen[dvhc.MaDVHC[0]] = {
                        Ten: dvhc.Ten[0],
                        CapTren: dvhc.CapTren[0],
                        TenCapTren: tinh[dvhc.CapTren[0]]
                    }
                }
            }
            resolve({ tinh, huyen });
        });
    });
});
