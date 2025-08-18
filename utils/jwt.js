const jwt = require('jsonwebtoken');
const JWT_SECRET = "EIIDE"


// Generate JWT token
exports.generateToken = (payload) => {
    //payload: {username}
    return jwt.sign({ payload }, JWT_SECRET);
};

// Verify JWT token
exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};