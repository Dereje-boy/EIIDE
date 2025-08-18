const accountModel = require('../models/accountModel');
const { generateToken, verifyToken } = require('../utils/jwt');


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
    //check cookie token exist
    const token = req.cookies['token']

    //if found, check validity
    try {
        if (!token || !token.length) throw "Invalid token"
        console.log(verifyToken(token))
        const username = verifyToken(token).payload
        const user = await accountModel.getAccountByUsername(username)
        console.log(user)

        //if valid redirect to homepage for customer and dashboard for admin
        if (user.account_type.toLowerCase() == 'customer')
            return res.redirect('/')
        else if (user.account_type.toLowerCase() == 'admin' |
            user.account_type.toLowerCase() == 'employee')
            return res.redirect('/dashboard')

    } catch (e) {
        //not working jwt token
        console.log(e)
    }


    res.render('login/login.handlebars');
}