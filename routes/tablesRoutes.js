const express = require('express');

const router = express.Router();
const tablesControllers = require('../controllers/tablesControllers');
router.get('/', tablesControllers.getAllTables);
router.get('/:id', tablesControllers.getSingleTable);
router.patch('/:id', tablesControllers.updateTable);

module.exports = router;
