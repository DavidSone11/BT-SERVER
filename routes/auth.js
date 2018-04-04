var express = require('express');
var router = express.Router();
var UserModel = require("../models/user")
var Promise = require("bluebird");
require('mongoose-query-paginate');
var fs = require('fs');
var jwt = require('jsonwebtoken');



var users = {
  login: function (req, res) {
     
    var username  = req.query.username;



  },

 

   generateToken  = function(username){
   return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: username
    }, require("../config/secret.config"));
  }



  






}

module.exports = users;
