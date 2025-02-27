const jwt = require('jsonwebtoken');

module.exports = (id)=>{
    const token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    return token;
}