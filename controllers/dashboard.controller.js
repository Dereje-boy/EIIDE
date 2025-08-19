const accountModel = require('../models/accountModel');
const { generateToken, verifyToken } = require('../utils/jwt');

//just render login page
exports.login = async (req, res) => {
    //check cookie token exist
    const token = req.cookies['token']

    //if found, check validity
    try {
        if (!token || !token.length) throw "Invalid token"
        // console.log(verifyToken(token))
        const username = verifyToken(token).payload
        const user = await accountModel.getAccountByUsername(username)
        // console.log(user)

        //if valid redirect to homepage for customer and dashboard for admin
        if (user.account_type.toLowerCase() == 'customer')
            return res.redirect('/')
        else if (user.account_type.toLowerCase() == 'admin' |
            user.account_type.toLowerCase() == 'employee')
            return res.render('admin/admin.handlebars', { layout: false, username: user.username })

    } catch (e) {
        //not working jwt token
        console.log(e)
    }


    res.render('login/login.handlebars');
}