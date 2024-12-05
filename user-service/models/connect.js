const mongoose = require('mongoose')

function connect(){
    mongoose.connect("mongodb://localhost:27017/project")
        .then(() => console.log("mongodb connected"))
        .catch((err) => console.log("mongodb not connected",err))
}

module.exports = {connect}