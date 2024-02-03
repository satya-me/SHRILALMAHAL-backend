const { secret_key } = require('./SecretKey');
const JWT = require('jsonwebtoken');

const CreateToken = (user) => {
    const token = JWT.sign({ _id: user._id, full_name: user.full_name, email: user.email }, secret_key, { expiresIn: "12h" });
    return token;
}


module.exports = CreateToken;