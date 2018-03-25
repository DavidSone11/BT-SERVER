'use strict'
var mongoose = require('mongoose');
const options = {
  autoIndex: false, 
  reconnectTries: Number.MAX_VALUE, 
  reconnectInterval: 500, 
  poolSize: 10, 
  bufferMaxEntries: 0
};

mongoose.connect('mongodb://127.0.0.1/locolink',options,function (err) {
  if (err) {
    console.log('Error in Connection', error);
  } else {
    console.log('db Connected Successfully !!!!!!!!');
  }
});

