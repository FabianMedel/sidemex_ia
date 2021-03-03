var mysql = require('mysql');
var middleware = require('./../middleware');



//############################ variables declaration #################################//

let sia_local = {hostSQL: 'localhost' , User: 'root' , Pass: '' , db: 'SIDEMEX_IA', port: '3306' };

async function createConnection(dbConn){
    conn = mysql.createConnection({
        host: dbConn.hostSQL,
        user: dbConn.User,
        password: dbConn.Pass,
        database: dbConn.db,
        port: dbConn.port
    });
    return conn;
};

async function login(dbConn){
    console.log();

}
  
  //############################                       #################################//
  
async function closeConnection(conn){
    conn.destroy();
};

module.exports = {
    sia_local : sia_local,
    createConnection : createConnection,
    closeConnection : closeConnection,
    login:login
};
  