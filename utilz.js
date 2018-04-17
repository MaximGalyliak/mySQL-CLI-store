//Utilz
//outputs table in console using sql select response
function outputTable(sql_response) {
    var head = Object.keys(sql_response[0]);//forming table head from first element in sql response arr
    const Table = require('cli-table');
    var table = new Table({
        head: head,//col sizes on auto we set only head
    });
    sql_response.map(row => {
        var rowArr = new Array;
        head.map(col => {
            rowArr.push(row[col]);
        });
        table.push(rowArr);
    });
    console.log(table.toString());
}
//for inq input validaion
function validateIfNumber(input) {
    return /[-+]?[0-9]*\.?[0-9]+/.test(input) || "Should be a number!";
}
function validateIfNotEmpty(input){
    return !/^$/.test(input)||"Can't be empty";
}
//for inq list choices
function sqlResToArr(sql_response_arr, ...field_names) {
    var newArr = new Array;
    sql_response_arr.map(el => {
        newArr.push(
            field_names.map(field => el[field]).toString()
        );
    });
    return newArr;
}

module.exports = { outputTable, validateIfNumber, sqlResToArr, validateIfNotEmpty };