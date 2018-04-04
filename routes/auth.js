var express = require('express');
var router = express.Router();
var UserModel = require("../models/user")
var Promise = require("bluebird");
require('mongoose-query-paginate');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var basicAuth = require('basic-auth');



var auth = {
  login: function (req, res) {
    var user = basicAuth(req)

    if (user.name == '' && user.pass == '') {
      res.status = 401
      return res.json({
        message: 'Access denied',
        statusCode: 401
      })

    }
    var username = user.name;
    var passwrd = user.pass;

    if (auth.findByUsername(username)) {
      var token = auth.generateToken(username);
      return res.json({
        token: token
      })
    } else {
      res.status = 404
      return res.json({
        message: 'Access denied User Not Found',
        statusCode: 404
      })
    }
  },

  findByUsername: function (username) {
    var isUserFound = false;
    UserModel.findOne({ userName: username }).exec(function (err, user) {
      if (err) throw err;
      else {
        if (typeof (user) == "undefined" || user == null) {
          isUserFound = isUserFound;
        } else {
          isUserFound = !isUserFound;
        }
      }
      return isUserFound;
    });

  },
  generateToken: function (username) {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: username
    }, require("../config/secret.config").secretKey());
  }

}

module.exports = auth;



