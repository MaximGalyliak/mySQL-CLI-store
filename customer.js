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
    connection.query('SELECT id,product_name FROM productstb ORDER BY id', (err, masterSelRes) => {

        INQ.prompt([
            {
                type: 'list',
                message: 'Which product you would like to buy?',
                choices: UTILZ.sqlResToArr(masterSelRes, 'id', 'product_name'),
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

            var selectQuantityQ = `select stock_quantity, price from productstb where productstb.id ="${id}"`;

            connection.query(selectQuantityQ, (error, sqlResp) => {

                if (sqlResp[0].stock_quantity < parseInt(inqResp.quantity)) {

                    console.log("Sorry we don't have that many in stock");
                    connection.end();

                } else {

                    var currentTotal = parseInt(inqResp.quantity) * parseFloat(sqlResp[0].price);

                    console.log('Total price: $', currentTotal,'\n');//give customer final bill;

                    var newQuantity = sqlResp[0].stock_quantity - parseInt(inqResp.quantity);

                    var updateQuantutyQ = `UPDATE productstb SET stock_quantity ="${newQuantity}" WHERE productstb.id ="${id}"`;

                    connection.query(updateQuantutyQ, (e, updateResp) => {
                        updateTotalSales(id, currentTotal);
                        console.log('Transaction complete!');
                    });
                }
            });
        });
    });
}

function updateTotalSales(id, currentTotal) {
    connection.query(`SELECT product_sales FROM productstb WHERE productstb.id = "${id}"`, (err, resp)=>{

        var newTotal = currentTotal+resp[0].product_sales;

        connection.query(`UPDATE productstb SET product_sales="${newTotal}" WHERE productstb.id="${id}"`,(er, uResp) => {

            console.log('Product sales updated!');
            connection.end();
        });
    });
}

module.exports = customer;