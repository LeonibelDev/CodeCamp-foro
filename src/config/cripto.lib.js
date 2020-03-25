const cipher = {}
const crypto = require('crypto');
module.exports = cipher;

cipher.Cripto = class Cripto{
    cripto_pass(xxx){
        var mykey = crypto.createCipher('aes-128-cbc', '');
        var mystr = mykey.update(xxx, 'utf8', 'hex');
        mystr += mykey.final('hex');

        return mystr 
    }
}

cipher.Desencript = class Desencript{
    desencript_pass(xxx){
        var mykey = crypto.createDecipher('aes-128-cbc', '');
        var descript = mykey.update(xxx, 'hex', 'utf8');
        descript += mykey.final('utf8');

        return descript 
    }
}