accountModel = require('../models/accountModel');
const { verifyToken } = require('./jwt');

exports.check = async (req) => {
    //if found return account type (customer, emlployee, admin)
    //else return empty string

    const token = req.cookies['token']

    //if found, check validity
    try {
        if (!token || !token.length) return '';

        const username = verifyToken(token).payload
        const user = await accountModel.getAccountByUsername(username)
        // console.log(user)

        return user.account_type;
    } catch (e) {
        //not working jwt token
        console.log(e)
        return '';
    }

}