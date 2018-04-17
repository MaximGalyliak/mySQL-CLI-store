const UTILZ = require('./utilz');
const INQ = require('inquirer');
const SQL = require('mysql');

const connection = SQL.createConnection({
    host: '127.0.0.1',//3306 def port
    user: 'root',
    password: 'root',
    database: 'storedb'
});

function manager() {
    INQ.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            name: 'choice',
        }
    ]).then(input => {
        console.log(input.choice);
        switch (input.choice) {
            case 'View Products for Sale': showAll(); break;
            case 'View Low Inventory': showLow(); break;
            case choices[2]: console.log('ok'); break;
            default: console.log("Didn't get that...");
        }
    })
}

function showAll() {
    connection.query(
        'SELECT product_name FROM productstb',
        (err, selectResp) => {
            if (err) throw err;
            UTILZ.outputTable(selectResp);
            manager();
        }
    );
}

function showLow() {
    connection.query(
        'SELECT product_name, stock_quntity FROM productstb WHERE stock_quntity < 5',
        (err, selectLow) => {
            if (err) throw err;
            UTILZ.outputTable(selectLow);
            manager();
        }
    );
}

module.exports = manager;