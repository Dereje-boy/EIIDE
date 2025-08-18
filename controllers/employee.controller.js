const employeeModel = require('../models/employeeModel');

// @desc    Create new employee
// @route   POST /api/employees
exports.createEmployee = async (req, res) => {
    try {
        const { first_name, last_name, sex, phone, username } = req.body;
        const empId = await employeeModel.createEmployee({
            first_name,
            last_name,
            sex,
            phone,
            username
        });

        res.json({
            success: true,
            message: 'Employee record created successfully',
            reason: null,
            data: { emp_id: empId }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try verifying the username or required fields',
            reason: `Creation failed: ${error.message}`
        });
    }
};

// @desc    Get all employees
// @route   GET /api/employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployees();

        res.json({
            success: true,
            message: 'Employee directory retrieved',
            reason: null,
            data: employees
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or check network connection',
            reason: `Retrieval error: ${error.message}`
        });
    }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeModel.getEmployeeById(req.params.id);

        if (!employee) {
            return res.json({
                success: false,
                message: 'Check the employee ID from your directory',
                reason: 'No employee found with provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Employee details retrieved',
            reason: null,
            data: employee
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again with different criteria',
            reason: `Lookup failed: ${error.message}`
        });
    }
};

// @desc    Get employee by username
// @route   GET /api/employees/username/:username
exports.getEmployeeByUsername = async (req, res) => {
    try {
        const employee = await employeeModel.getEmployeeByUsername(req.params.username);

        if (!employee) {
            return res.json({
                success: false,
                message: 'Verify the username exists in account system',
                reason: 'No employee linked to this username'
            });
        }

        res.json({
            success: true,
            message: 'Employee profile found',
            reason: null,
            data: employee
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try checking the username spelling',
            reason: `Search error: ${error.message}`
        });
    }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
    try {
        const affectedRows = await employeeModel.updateEmployee(
            req.params.id,
            req.body
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the employee exists in your records',
                reason: 'No records updated - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee record updated successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ensure all field values are valid before retrying',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
    try {
        const affectedRows = await employeeModel.deleteEmployee(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the employee ID from HR system',
                reason: 'No records deleted - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee record permanently removed',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try revoking system access first if deletion fails',
            reason: `Deletion blocked: ${error.message}`
        });
    }
};