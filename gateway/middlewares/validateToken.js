const jwt = require('jsonwebtoken')

const validatetoken = async(req, res, next) => {
    let token
    console.log(req.headers.authorization)
    const header = req.headers.Authorization || req.headers.authorization
    console.log(header)
    if(!header || !header.startsWith("Bearer")){
       return res.status(400).json({message:'access token required'})
    }
    else if(header && header.startsWith("Bearer")){
       token = header.split(" ")[1]
       if(!token){
           return res.status(400).json({message:'access token Missing'}) 
       }
       try{
           const decode = jwt.verify(token, process.env.JWT_SECRET || "manikanta123")
           req.user = decode
           console.log(req.user)
           next()
       }catch(err){
           console.log(err)
           return res.status(400).json({message:'not a valid token'})
       }
    }
}

module.exports = validatetoken