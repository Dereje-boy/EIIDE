const db = require('./db');

// CREATE: Add a new employee
exports.createEmployee = async (employeeData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO employee (first_name, last_name, sex, phone, username) VALUES (?, ?, ?, ?, ?)',
            [
                employeeData.first_name,
                employeeData.last_name,
                employeeData.sex,
                employeeData.phone,
                employeeData.username
            ]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// READ: Get all employees
exports.getAllEmployees = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM employee');
        return rows;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

// READ: Get employee by ID
exports.getEmployeeById = async (emp_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM employee WHERE emp_id = ?', [emp_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw error;
    }
};

// READ: Get employee by username (FK check)
exports.getEmployeeByUsername = async (username) => {
    try {
        const [rows] = await db.query('SELECT * FROM employee WHERE username = ?', [username]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching employee by username:', error);
        throw error;
    }
};

// UPDATE: Modify employee details
exports.updateEmployee = async (emp_id, updateData) => {
    try {
        const [result] = await db.query(
            'UPDATE employee SET first_name = ?, last_name = ?, sex = ?, phone = ? WHERE emp_id = ?',
            [
                updateData.first_name,
                updateData.last_name,
                updateData.sex,
                updateData.phone,
                emp_id
            ]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

// DELETE: Remove employee by ID
exports.deleteEmployee = async (emp_id) => {
    try {
        const [result] = await db.query('DELETE FROM employee WHERE emp_id = ?', [emp_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};
