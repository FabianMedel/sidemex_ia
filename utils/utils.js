let mysql = require('mysql');
var Response = require('./classes');
let jwt = require('jsonwebtoken');
//let middleware = require('./../middleware');




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

async function signin(dbConn,user, password,req){
    let sql = 'SELECT idUsuario, nombre, apellido, correo FROM SIDEMEX_IA.USERS WHERE correo = \"'+user+'\" AND contrasena = \"'+password+'\"';
   
    return new Promise(function(resolve, reject){
        dbConn.query(sql, function(error, results, fields) {
            if (results.length > 0) {
                //jwt.sign({user},"sidemex_ia_uacm",(err,token)=> {
                    let splashResponse = new Response("done",200,results,"OK",null);
                    req.session.logged = true;
		            req.session.username = user;
		            req.session.password = password;
                    console.log("user exist");
                    return resolve(splashResponse);
                //});
                
            }else{
                let splashResponse = new Response("failed",403,results,"OK",null);
                console.log("user doesn\'t exist");
                return resolve(splashResponse);
            }
        });
    });

}
  
  //############################                       #################################//
  
async function closeConnection(conn){
    conn.destroy();
};

module.exports = {
    sia_local : sia_local,
    createConnection : createConnection,
    closeConnection : closeConnection,
    signin:signin
};
  