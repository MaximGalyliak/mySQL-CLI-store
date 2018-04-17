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
    connection.query(
        'SELECT id,product_name FROM productstb ORDER BY id',
        (err, sqlRes) => {
            if (err) throw err;
            INQ.prompt([
                {
                    type: 'list',
                    message: 'Which product you would like to buy?',
                    choices: UTILZ.sqlResToArr(sqlRes, 'id', 'product_name'),
                    name: 'productName'
                },
                {
                    type: 'input',
                    message: 'How many you need?',
                    name: 'quantity',
                    validate: UTILZ.validateIfNumber
                }
            ]).then((inqResp) => {
                var id = inqResp.productName.slice(0, inqResp.productName.indexOf(','));
                connection.query(
                    `select stock_quntity, price from productstb where productstb.id ="${id}"`,
                    (error, sqlResp) => {
                        if (error) throw error;
                        if (sqlResp[0].stock_quntity < parseInt(inqResp.quantity)) {
                            console.log("too many");
                            connection.end();
                        } else {
                            var Total = parseInt(inqResp.quantity) * parseFloat(sqlResp[0].price);
                            console.log('Total price: $', Total);//give customer final bill;
                            var newQuantity = sqlResp[0].stock_quntity - parseInt(inqResp.quantity);
                            console.log(newQuantity);
                            connection.query(
                                `UPDATE productstb SET stock_quntity ="${newQuantity}" where productstb.id ="${id}"`,
                                (e, r) => {
                                    if (e) throw e;
                                    console.log('Transaction complete!');
                                    connection.end();
                                }
                            );
                        }
                    }
                );
            });
        }
    );
}

module.exports = customer;