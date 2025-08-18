const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Hash password
exports.hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, saltRounds);
};

// Compare password
exports.comparePassword = async (plainPassword, hashedPassword) => {
    console.log("checking password")
    console.log(await bcrypt.compare(plainPassword, hashedPassword))
    return await bcrypt.compare(plainPassword, hashedPassword);
};