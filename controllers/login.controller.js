const accountModel = require('../models/accountModel');
const { generateToken, verifyToken } = require('../utils/jwt');
const { check } = require('../utils/account_type');


// New login endpoint
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const isValid = await accountModel.verifyCredentials(username, password);

        if (!isValid) {
            return res.json({
                success: false,
                message: 'Invalid credentials, Incorrect username or password',
                reason: 'Incorrect username or password'
            });
        }

        //generate and send jwt token
        const token = generateToken(username);
        res.cookie('token', token)

        res.json({
            success: true,
            message: 'Login successful',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Login failed',
            reason: error.message
        });
    }
};

//just render login page
exports.loginget = async (req, res) => {
    try {
        const type = await check(req);
        if (type == 'customer')
            return res.redirect('/')
        else if (type == 'admin' |
            type == 'employee')
            return res.redirect('/dashboard')

    } catch (e) {
        //not working jwt token
        console.log(e)
    }


    res.render('login/login.handlebars');
}