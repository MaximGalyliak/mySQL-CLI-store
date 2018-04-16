//Utilz
function outputTable(){
    

}
//for inq input validaion
function validateIfNumber(input) {
    return /^\d+$/.test(input) || "Should be a number!";
}
//for inq list choices
function sqlResToArr(sql_response_arr, field_name_str) {
    var newArr = new Array;
    sql_response_arr.map(el => newArr.push(el[field_name_str]));
    return newArr;
}

module.exports = {validateIfNumber, sqlResToArr};