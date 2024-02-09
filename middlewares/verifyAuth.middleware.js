const jwt = require('jsonwebtoken');
const { secret_key } = require('../util/SecretKey');

exports.VerifyToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;

    // Remove the "Bearer " prefix from the token
    if (token?.startsWith('Bearer ')) {
        token = token.slice(7); // Removes the first 7 characters ("Bearer ")
    }
    if (!token) {
        return res.status(401).json({ status: false, msg: "A token is required for authentication", token: false });
    }
    try {
        const decoded = jwt.verify(token, secret_key);
        console.log(decoded);

        req.admin = decoded;
        next();
    } catch (exc) {
        return res.status(401).json({ status: false, msg: "Invalid token access", token: false });
    }
};