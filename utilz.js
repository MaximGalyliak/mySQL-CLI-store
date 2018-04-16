//Utilz
function outputTable(){
    
}
//for inq input validaion
function validateIfNumber(input) {
    return /^\d+$/.test(input) || "Should be a number!";
}
//for inq list choices
function sqlResToArr(sql_response_arr, ...field_names) {
    var newArr = new Array;
    sql_response_arr.map(el => {
        newArr.push(
            field_names.map(field=> el[field]).toString()
        );
    });
    return newArr;
}

module.exports = {validateIfNumber, sqlResToArr};