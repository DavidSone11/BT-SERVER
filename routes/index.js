var express = require('express');
var router = express.Router();

var user = require("./users")



router.get('/api/v1/users/getAllUsers',user.getAllUsers);
router.post('/api/v1/users/createUser',user.saveUser);
router.get('/api/v1/users/findByUsername',user.findByUserName);
router.put('/api/v1/users/updateUser',user.updateUser);
router.delete('/api/v1/users/deleteUser',user.deleteUser);
router.post('/api/v1/users/bulkCreate',user.createBulkUser);
router.get('/api/v1/users/exports',user.exportToCSV);

module.exports = router;
