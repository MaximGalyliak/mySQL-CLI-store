const INQ = require('inquirer');
const SQL = require('mysql');
const customer = require('./customer');
const manager = require('./manager');
const UTILZ = require('./utilz');

const connection = SQL.createConnection({
    host: '127.0.0.1',//3306 def port
    user: 'root',
    password: 'root',
    database: 'storedb'
});
connection.connect((error) => {
    if (error) throw error;
    connection.query(
        'SELECT * FROM productstb',
        (err, resp) => {
            if (err) throw err;
            UTILZ.outputTable(resp); 
            INQ.prompt([
                {
                    type: 'list',
                    message: 'Are your role?\n',
                    choices: ['customer', 'manager', 'superviser'],
                    name: 'login'
                }
            ]).then((resp) => {
                switch (resp.login) {
                    case 'customer': customer(); connection.end(); break;
                    case 'manager': manager(); connection.end(); break;
                    default: console.log("Sorry I didn't get that.");
                }
            });
        }
    )
});



