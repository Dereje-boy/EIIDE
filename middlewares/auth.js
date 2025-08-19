//import my account type checker
const { check } = require('../utils/account_type');



exports.auth = async (req, res, next) => {
    //check acc type and if customer deny
    try {

        const type = await check(req);
        // console.log({ type })
        if (type.toLowerCase() == 'customer') {
            res.json({
                success: false,
                reason: 'Can\'t access this endpoint with customer account',
                message: 'Your account(customer) is not allowed to entry this endpoint'
            })
        } else if (type.toLowerCase() == 'admin' || type.toLowerCase() == 'employee') {
            next();
        } else {
            res.json({
                success: false,
                reason: 'Can\'t access this endpoint with unknown account type',
                message: `Your account(${type}) is not allowed to entry this endpoint`
            })
        }
    } catch (error) {
        console.log('Error in auth middleware : ' + error)
        res.json({
            success: false,
            reason: 'Error accessing the endpoint error: ' + error,
            message: `Error : (${type}) \n Please contact adminstrators`
        })
    }

}