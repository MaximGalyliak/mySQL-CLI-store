const INQ = require('inquirer');
const SQL = require('mysql');

const connection = SQL.createConnection({
    host: '127.0.0.1',//3306 def port
    user: 'root',
    password: 'root',
    database: 'storedb'
});


INQ.prompt([
    {
        type: 'list',
        message: 'Are you customer or admin?\n',
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

function customer() {
    connection.connect((error) => {
        if (error) console.log('Can not connect to database');
        connection.query('SELECT product_name FROM productstb ORDER BY id', (err, sqlRes) => {
            if (err) throw err;
            INQ.prompt([
                {
                    type: 'list',
                    message: 'Which product you would like to buy?',
                    choices: sqlResToArr(sqlRes, 'product_name'),
                    name: 'productName'
                },
                {
                    type: 'input',
                    message: 'How many you need?',
                    name: 'quantity',
                    validate: validateQuatity
                }
            ]).then((inqResp) => {
                var finalQuery = `select stock_quntity, price from productstb where productstb.product_name ="${inqResp.productName}"`;
                connection.query(finalQuery, (error, sqlResp) => {
                    if (error) throw error;
                    if (sqlResp[0].stock_quntity < parseInt(inqResp.quantity)) {
                        console.log("too many");
                        connection.end();
                    } else {
                        var Total = parseInt(inqResp.quantity) * parseFloat(sqlResp[0].price);
                        console.log('Total price: $', Total);//give customer final bill;
                        var newQuantity = sqlResp[0].stock_quntity - parseInt(inqResp.quantity);
                        connection.query(`UPDATE productstb SET productstb.stock_quntity =${newQuantity} where productstb.product_name ="${inqResp.productName}"`, (e, r) => {
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

//Utilz
function validateQuatity(quantity) {
    return /^\d+$/.test(quantity) || "Should be a number!";
}
function sqlResToArr(sql_response, fieldName) {
    var newArr = new Array;
    sql_response.map(el => newArr.push(el[fieldName]));
    return newArr;
}