const { secret_key } = require('./SecretKey');
const JWT = require('jsonwebtoken');

const CreateToken = (user) => {
    const token = JWT.sign({ _id: user._id, full_name: user.full_name, email: user.email, user_type: user.type }, secret_key, { expiresIn: "24h" });
    // console.log(user.type);
    return token;
}


module.exports = CreateToken;