const INQ = require('inquirer');
const SQL = require('mysql');
const UTILZ = require('./utilz');

const connection = SQL.createConnection({
    host: '127.0.0.1',//3306 def port
    user: 'root',
    password: 'root',
    database: 'storedb'
});

function customer() {
    connection.connect((error) => {
        if (error) console.log('Can not connect to database');
        connection.query(
            'SELECT product_name FROM productstb ORDER BY id',
            (err, sqlRes) => { 
                if (err) throw err;
                INQ.prompt([
                    {
                        type: 'list',
                        message: 'Which product you would like to buy?',
                        choices: UTILZ.sqlResToArr(sqlRes, 'product_name'),
                        name: 'productName'
                    },
                    {
                        type: 'input',
                        message: 'How many you need?',
                        name: 'quantity',
                        validate: UTILZ.validateIfNumber
                    }
                ]).then((inqResp) => {
                    connection.query(
                        `select stock_quntity, price from productstb where productstb.product_name ="${inqResp.productName}"`,
                        (error, sqlResp) => {
                            if (error) throw error;
                            if (sqlResp[0].stock_quntity < parseInt(inqResp.quantity)) {
                                console.log("too many");
                                connection.end();
                            } else {
                                var Total = parseInt(inqResp.quantity) * parseFloat(sqlResp[0].price);
                                console.log('Total price: $', Total);//give customer final bill;
                                var newQuantity = sqlResp[0].stock_quntity - parseInt(inqResp.quantity);
                                connection.query(
                                    `UPDATE productstb SET productstb.stock_quntity =${newQuantity} where productstb.product_name ="${inqResp.productName}"`,
                                    (e, r) => {
                                        if (e) throw e;
                                        console.log('Transaction complete!');
                                        connection.end();
                                    });
                            }
                        });
                });
            });
    });
}

module.exports = customer;