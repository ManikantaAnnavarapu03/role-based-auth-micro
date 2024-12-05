const autocannon = require('autocannon')

const urls = ['http://localhost:7010/user/login', 'http://localhost:7010/user/signup']

const duration = 30

urls.forEach(url =>{
    const instance = autocannon({
        url,
        duration
    },(err, result) => {
        if(err){
            console.error("error: ", err)
    }else{
        console.log("url",url)
        console.log("request", result.requests)
        console.log("duration", result.duration)
    }
}
)
autocannon.track(instance)
})