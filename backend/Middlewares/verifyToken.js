const jwt = require('jsonwebtoken')
require('dotenv').config()

//verify token function
function verifyToken(req,res,next){
    //get bearee token from header
    const bearerToken = req.headers.authorization
    //if no bearer token 
    if(!bearerToken){
        res.send({message : 'Unauthorized access. Please Login in to continue'})
    }
    //extract tokek from bearer token 
    const token = bearerToken.split(' ')[1]
    //verify token
    try{
        jwt.verify(token,process.env.PRIVATE_KEY)
        next()
    }catch(err){
        next(err)
    }
}

//export
module.exports = verifyToken
