


var json2csv = require('json2csv');
var fields = ['name', 'phone', 'mobile', 'email', 'address', 'notes'];
var fieldNames = ['Name', 'Phone', 'Mobile', 'Email', 'Address', 'Notes'];
var data = json2csv({ data: docs, fields: fields, fieldNames: fieldNames });
res.attachment('filename.csv');
res.status(200).send(data);


var createHeader  = function(){
    return ['name', 'phone', 'mobile', 'email', 'address', 'notes'];
}

var expToCSV ={
    createHeader:createHeader
}

module.exports = expToCSV;