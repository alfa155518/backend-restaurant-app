const Tables = require('../models/tablesModel');
const errorsControllers = require('../controllers/errorsControllers');

const getAllTables = async (req, res) => {
  try {
    const tables = await Tables.find();
    res.status(200).json({
      status: 'success',
      results: tables.length,
      tables,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// get single Table by Id
const getSingleTable = async (req, res) => {
  try {
    const table = await Tables.findById(req.params.id);
    if (!table) {
      return errorsControllers.dataNotExit(res, 404, err);
    }
    res.status(200).json({
      status: 'success',
      table,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// update singe table
const updateTable = async (req, res) => {
  try {
    const updatedTable = await Tables.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTable) {
      return errorsControllers.dataNotExit(res, 404, err);
    }
    res.status(200).json({
      status: 'success',
      table: updatedTable,
    });
  } catch (err) {
    return errorsControllers.globalErrorHandler(res, 400, err);
  }
};
module.exports = { getAllTables, getSingleTable, updateTable };
