const userService = require('../services/userServices');

exports.checkToken = (req, res, next) => {
    const { token } = req.body;

    const isAuthenticated = userService.checkToken(token);
    if(isAuthenticated){
        res.status(200).json({ isAuthenticated: true })
    } else {
        res.status(403).json({ reason: 'unauthorized' })
    }
};