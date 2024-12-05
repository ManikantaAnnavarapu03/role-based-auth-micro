

async function validatebody(req, res, next){
    const {name, username, password, role} = req.body
    if(!name || !username || !password || !role){
        return res.status(400).json({message:'all fields are required'})
    }
    next()
}

async function validateLoginbody(req, res, next){
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({message:'all fields are required'})
    }
    next()
}

module.exports = {validatebody, validateLoginbody}