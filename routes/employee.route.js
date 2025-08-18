const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.get('/username/:username', employeeController.getEmployeeByUsername);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;