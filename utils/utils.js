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
    return await conn;
};

async function login(dbConn,user, password,req){
    let sql = `SELECT nombre, apellido, correo FROM SIDEMEX_IA.USERS WHERE correo = "${user}" AND contrasena = "${password}"`;
   
    return new Promise(function(resolve, reject){
        dbConn.query(sql, function(error, results, fields) {
            if (results.length > 0) {
                jwt.sign({user},"sidemex_ia_uacm",(err,token)=> {
                    let splashResponse = new Response("done",200,results,"OK",token);
                    req.session.logged = true;
		            req.session.username = user;
		            req.session.password = password;
                    req.session.token = token;
                    console.log("user exist");
                    return resolve(splashResponse);
                });
            }else{
                let splashResponse = new Response("failed",403,results,"User not exists",null);
                console.log("user doesn\'t exist");
                return resolve(splashResponse);
            }
        });
    }); 
}

async function signin(dbConn, user,last_name, email,password){
    let sql = `INSERT INTO SIDEMEX_IA.USERS VALUES (null,"${user}","${last_name}","${email}","${password}")`;
    console.log(sql)
    return new Promise(function(resolve, reject){
        dbConn.query(sql, function(error, results, fields) {
           if(error){
            let splashResponse = new Response("failed",403,{message: 'El usuario ya existe'},"Unregister user",null);
            console.log("user doesn\'t register");
            return resolve(splashResponse);
           }else{
            let splashResponse = new Response("done",200,{message: 'Usuario registrado'},"OK",null);
            console.log("Registered user");
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
    login:login,
    signin:signin
};
  