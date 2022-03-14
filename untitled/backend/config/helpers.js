const MySQLi = require('mysqli');

let conn = new MySQLi({
    host: 'localhost',
    post: 3306,
    user: 'yaroslav',
    password: '4867590',
    db: 'shop'
});

let db = conn.emit(false, '');

module.exports = {
    database: db
};