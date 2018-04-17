const UTILZ = require('./utilz');
const INQ = require('inquirer');
const SQL = require('mysql');

const connection = SQL.createConnection({
    host: '127.0.0.1',//3306 def port
    user: 'root',
    password: 'root',
    database: 'storedb'
});

function superviser(){
    INQ.prompt([
        {
            type: 'list',
            message: 'What would youo like to do?',
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
            name: 'choice'
        }
    ]).then(inqResp=>{
        switch(inqResp.choice){
            case 'View Product Sales by Department': viewByDep(); break;
            case 'Create New Department': createNewDep(); break;
            case 'Exit': connection.end(); break;
            default: console.log("Sorry I didn't get that..");
        }
    });
};

function viewByDep(){
    connection.query(
        ``
    )

};

function createNewDep(){
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
            validate:UTILZ.validateIfNumber,
        }
    ]).then(inqResp=>{
        connection.query(
            `insert into 
            departmentstb(department_name, overhead) 
            values(
                "${inqResp.departmentName}", 
                "${inqResp.overheadCost}"
            )`,
            (err, insResp)=>{
                if(err) throw err;
                console.log("Success!");
                superviser();
            }
        );
    });
};

module.exports = superviser;