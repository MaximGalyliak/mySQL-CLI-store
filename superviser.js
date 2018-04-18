const UTILZ = require('./utilz');
const INQ = require('inquirer');
const SQL = require('mysql');

const connection = SQL.createConnection({
    host: '127.0.0.1',//3306 def port
    user: 'root',
    password: 'root',
    database: 'storedb'
});

function superviser() {
    INQ.prompt([
        {
            type: 'list',
            message: 'What would youo like to do?',
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
            name: 'choice'
        }
    ]).then(inqResp => {
        switch (inqResp.choice) {
            case 'View Product Sales by Department': viewByDep(); break;
            case 'Create New Department': createNewDep(); break;
            case 'Exit': connection.end(); break;
            default: console.log("Sorry I didn't get that..");
        }
    });
};

function viewByDep() {

    var OMGTHISQUERY = `
    SELECT departmentstb.id, productstb.department_name, departmentstb.overhead, sum(productstb.product_sales)-departmentstb.overhead as profit
    FROM departmentstb 
    JOIN productstb 
    ON departmentstb.department_name = productstb.department_name
    GROUP BY productstb.department_name 
    ORDER BY id;`

    connection.query(OMGTHISQUERY, (error, joinResp) => {
        if (error) throw error;
        UTILZ.outputTable(joinResp);
        superviser();
    });
};

function createNewDep() {
    INQ.prompt([
        {
            type: 'input',
            message: 'Please enter department name',
            name: 'departmentName',
            validate: UTILZ.validateIfNotEmpty,
        },
        {
            type: 'input',
            message: 'Please enter overhead cost',
            name: 'overheadCost',
            validate: UTILZ.validateIfNumber,
        }
    ]).then(inqResp => {
        var addNewDepartmentQ = `insert into departmentstb(department_name, overhead) values("${inqResp.departmentName}",  "${inqResp.overheadCost}")`;
        connection.query(insertNewDepartmentQ, (err, insertResp) => {
            if (err) throw err;
            console.log("Success!");
            superviser();
        });
    });
};

module.exports = superviser;