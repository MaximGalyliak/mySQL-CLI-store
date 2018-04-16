const INQ = require('inquirer');
const customer = require('./customer');

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