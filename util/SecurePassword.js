const bcryptjs = require('bcryptjs');

const SecurePassword = async (password) => {
    const HashPassword = await bcryptjs.hash(password, 13);
    return HashPassword;
}


module.exports = SecurePassword;