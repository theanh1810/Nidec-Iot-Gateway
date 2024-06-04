const bcrypt = require('bcrypt')
const moment = require('moment')

// console.log(bcrypt.compareSync('123', '$2y$10$A7Dzkdfj996FEd1aGKgCRuYZoK4lVcpV2XI2MgYZ67G9S7t.uwJ9q'.replace(/^\$2y(.+)$/i, '$2a$1')))
console.log(moment.unix(1694076133).format('HH:mm:ss').toString())
console.log(moment.unix(1694097733).format('HH:mm:ss').toString())