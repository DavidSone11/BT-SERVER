var express = require('express');
var router = express.Router();
var UserModel = require("../models/user")
var Promise = require("bluebird");
require('mongoose-query-paginate');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var basicAuth = require('basic-auth');
var q = require('q');



var auth = {
  login: function (req, res) {
    var user = basicAuth(req)

    if (user.name == '' && user.pass == '') {

      return res.status(401).json({
        message: 'Access denied',
        statusCode: 401
      })

    }
    var username = user.name;
    auth.findByUsername(username).then(function (response) {
      if (response.status) {
        var token = auth.generateToken(username);
        res.cookie('token', token, { maxAge: 900000, httpOnly: true });
        return res.json({
          token: token,
          username: username,
          role: response.results.roleCode

        })
      } else {
        return res.json({
          message: 'Access denied User Not Found',
        })
      }
    });
  },

  findByUsername: function (username) {

    var defer = q.defer();
    UserModel.findOne({ userName: username }).exec(function (err, user) {
      if (err) throw err;
      else {
        if (typeof (user) == "undefined" || user == null) {
          defer.resolve({ status: false, results: user });
        } else {

          defer.resolve({ status: true, results: user });
        }
      }

    });
    return defer.promise;
  },
  generateToken: function (username) {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: username
    }, require("../config/secret.config").secretKey());
  },

  logout: function (req, res) {
   cookie = req.cookies;
    //cookie = req.cookies['token']
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.status(200).json({
      message:"logout successfully!!!!",
      status:200
    })
  }

}

module.exports = auth;



