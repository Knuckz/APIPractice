const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    //get authorization header from client
    const authHeader = req.get('Authorization'); 
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    //get token from client
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        //verify token
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    //put the userId into the req for use throughout other routes=
    req.userId = decodedToken.userId;
    //of course we next() to continue
    next();
}