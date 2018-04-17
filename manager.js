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
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
            name: 'choice',
        }
    ]).then(input => {
        console.log(input.choice);
        switch (input.choice) {
            case 'View Products for Sale': showAll(); break;
            case 'View Low Inventory': showLow(); break;
            case 'Add to Inventory': addQuantity(); break;
            case 'Add New Product': addProduct(); break;
            case 'Exit': connection.end(); break;
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
        'SELECT product_name, stock_quantity FROM productstb WHERE stock_quantity < 5',
        (err, selectLow) => {
            if (err) throw err;
            if (selectLow.length!=0){
                UTILZ.outputTable(selectLow);
            }else{
                console.log("No items to display");
            }
            
            manager();
        }
    );
}

function addQuantity(){
    connection.query(
        'SELECT id,product_name FROM productstb ORDER BY id',
        (err, sqlRes) => {
            if (err) throw err;
            INQ.prompt([
                {
                    type: 'list',
                    message: 'Which product you would like to stock up?',
                    choices: UTILZ.sqlResToArr(sqlRes, 'id', 'product_name'),
                    name: 'productName'
                },
                {
                    type: 'input',
                    message: 'How many you want to add?',
                    name: 'amount',
                    validate: UTILZ.validateIfNumber
                }
            ]).then((inqResp) => {
                var id = inqResp.productName.slice(0, inqResp.productName.indexOf(','));
                connection.query(
                    `select stock_quantity from productstb where productstb.id ="${id}"`,
                    (err, selResp)=>{
                        if(err) throw err;
                        var updatedQuantity = selResp[0].stock_quantity + parseInt(inqResp.amount);
                        console.log(updatedQuantity);
                        connection.query(
                            `update productstb set stock_quantity = "${updatedQuantity}" where productstb.id ="${id}"`,
                            (error, updResp) => {
                                if (error) throw error;
                                console.log('Success!');
                                manager();
                            }
                        );
                    }
                )
            });
        }
    );
}

function addProduct(){
    INQ.prompt([
        {
            type: 'input',
            message: 'Please enter product name',
            name: 'productName',
            validate: UTILZ.validateIfNotEmpty,
        },
        {
            type: 'input',
            message: 'Please enter product department',
            name: 'productDepartment',
            validate: UTILZ.validateIfNotEmpty,
        },
        {
            type: 'input',
            message: 'Please enter product price',
            name: 'productPrice',
            validate: UTILZ.validateIfNumber,
        },
        {
            type: 'input',
            message: 'Please enter product quantity',
            name: 'productQuantity',
            validate: UTILZ.validateIfNumber,
        },
    ]).then(inqResp=>{
        connection.query(
            `insert into 
            productstb(product_name, department_name, price, stock_quantity) 
            values(
                "${inqResp.productName}", 
                "${inqResp.productDepartment}", 
                "${inqResp.productPrice}", 
                "${inqResp.productQuantity}"
            )`,
            (err, insResp)=>{
                if(err) throw err;
                console.log("Success!");
                manager();
            }
        );
    });
}

module.exports = manager;