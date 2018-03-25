var express = require('express');
var router = express.Router();
var UserModel = require("../models/user")
var Promise = require("bluebird");
require('mongoose-query-paginate');
var fs = require('fs');

const json2csv = require('json2csv').parse;
const fields = ['firstName', 'lastName', 'userName', 'password', 'email', 'markDelete', 'createdTime'];
const opts = { fields }


var users = {
  getAllUsers: function (req, res) {
    var options = {
      perPage: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      order: req.query.order || 'userName'
    };
    var query = UserModel.find({ "markDelete": false }).sort('userName');
    query.paginate(options, function (err, results) {
      if (err) throw new Error("Error in User");
      else {
        return res.json(results);
      }
    });
  },

  findByUserName: function (req, res) {
    UserModel.findOne({ "email": { $regex: req.query.email, $options: "$i" } }, function (err, results) {
      if (err) throw new Error("Error in User");
      else {
        return res.json(results)
      }
    });
  },

  saveUser: function (req, res) {

    var userOBJ = {
      userName: "admin",
      firstName: "adminR",
      lastName: "adminR",
      password: "admin123456",
      email: "admin@abc.com",
      email: "admin",
    }
    UserModel.create(userOBJ, function (err, results) {
      if (err) throw new Error("Error in Saving ");
      else {
        return res.json({
          "message": "User has been saved !!!!",

        })
      }

    });
  },

  updateUser: function (req, res) {
    return new Promise(function (resolve, reject) {
      UserModel.findOneAndUpdate({ email: req.query.email }, { $set: { email: "santosh.citech@gmail.com" } }, { new: true }, function (err, doc) {
        if (err) {
          reject("Something wrong when updating data!");
        }
        resolve(res.json({
          message: "Update User successfully !!!!"
        }))
      });
    });
  },

  deleteUser: function (req, res) {
    return new Promise(function (resolve, reject) {
      UserModel.remove({ email: "admin" }, function (err, doc) {
        if (err) {
          reject("Something wrong when updating data!");
        }
        resolve(res.json({
          message: "delete User successfully !!!!"
        }))
      });
    });
  },

  createBulkUser: function (req, res) {

    var usersList = [
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" },
      { "userName": "santosh", "firstName": "santosh", "lastName": "santosh", "password": "santosh123", "email": "santosh@gmail.com", "roleCode": "admin" }

    ];

    UserModel.insertMany(usersList, function (err, results) {
      if (err) throw err;
      else {
        res.status(201).json({
          "status": true,
          "message": "Users has been saveed Successfully!!!"
        })
      }
    });
  },

  exportToCSV: function (req, res) {

    // var fields = ['firstName', 'lastName', 'userName', 'password', 'email', 'markDelete', 'createdTime'];
    // var fieldNames = ['firstName', 'lastName', 'userName', 'password', 'email', 'markDelete', 'createdTime'];
    try {
      UserModel.find({}, function (err, results) {
        if (err) throw new Error("Error in User");
        else {
          var csv = json2csv(results, opts);
          // res.attachment('e://users.csv');
         /// res.download('/users.csv');
          // res.send(csv);
          res.sendFile("e:\\Users.csv");
          return res.status(200).json({
            "message":"download the csv files",
            result:csv
          })
          
        }
      });
    } catch (err) {
        console.error(err);
    }
  }






}

var createHeader = function () {
  return ['firstName', 'lastName', 'userName', 'password', 'email', 'markDelete', 'createdTime'];
}
module.exports = users;
