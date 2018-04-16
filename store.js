const INQ = require('inquirer');
const SQL = require('mysql');
const Table = require('cli-table')
const customer = require('./customer');

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
            var table = new Table({
                head: ['id', 'Name', 'Department', 'Price', 'Quantity']
                , colWidths: [10, 20, 20, 20, 20]
            });
            resp.map(row => {
                table.push([row.id, row.product_name, row.department_name, row.price, row.stock_quntity]);
            });
            console.log(table.toString());
            INQ.prompt([
                {
                    type: 'list',
                    message: 'Are your role?\n',
                    choices: ['customer', 'manager', 'superviser'],
                    name: 'login'
                }
            ]).then((resp) => {
                switch (resp.login) {
                    case 'customer': return customer();
                    case 'manager': console.log('You are manager now'); break;
                    case 'superviser': console.log('You are superviser now'); break;
                    default: console.log("Sorry I didn't get that.");
                }
            });
        }
    )
});



