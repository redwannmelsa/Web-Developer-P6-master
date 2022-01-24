const jwt = require('jsonwebtoken'); //importing json web token to authenticate users

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //getting the second value out of the authorization header in requests
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //verifying the token received from the header with our key
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) { //case if the user attempting a request isn't the one that's authorized to do that request
            throw 'Invalid user ID';
        } else { //else (if the user is authorized), next()
            next();
        }
    } catch (error) {
        res.status(403).json({ error: error | 'Authentication required' })
    }
};