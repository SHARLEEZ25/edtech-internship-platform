const express = require('express');
const router = express.Router();
const ctrl = require('./admin.controller');
router.get('/dashboard', ctrl.dashboard);
module.exports = router;
