var MD5 = require('md5.js')
console.log(new MD5().update('42').digest('hex'))
