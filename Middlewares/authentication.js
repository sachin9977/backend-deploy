const jwt = require("jsonwebtoken")
require("dotenv").config()

const authentication = (req, res, next) => {
    console.log(req.headers.authorization)
    if(!req.headers.authorization){
        return res.send("Please login again")
    }
    const token = req.headers.authorization
    jwt.verify(token, "secret", function(err, decoded) {
            if(err){
                res.send("Please login")
            }
            else{
                req.body.userId = decoded.userId
                next()
            }
        });
}

module.exports = {authentication}