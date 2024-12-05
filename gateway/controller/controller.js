const {Kafka, Partitioners} = require('kafkajs')
const jwt = require('jsonwebtoken')
const logger = require('../logger/logger')

const kafka = new Kafka({
    clientId:'Manikanta123',
    brokers:['localhost:9092']
})

const handleUserSignup = async(req, res) =>{
    const data = req.body
    const producer = kafka.producer({createPartitioner:Partitioners.LegacyPartitioner})
    await producer.connect()
    console.log("producer connected")
    await producer.send({
        topic:'user-request-topic',
        messages:[{value:JSON.stringify({action:'register', data:data})}]
    })
    await producer.disconnect()
    const consumer = kafka.consumer({groupId:'user-ress-group'})
    await consumer.connect()
    await consumer.subscribe({topic:'user-response-topic', fromBeginning:true})
    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            const userMessage = message.value.toString()
            console.log(userMessage)
            if(!res.headerSent){
                if(userMessage == "user created"){
                    res.status(201).json({message:userMessage})
                }else if(userMessage == "user exist"){
                    res.status(400).json({message:userMessage})
                }
            consumer.disconnect()
            }
        }
    })

}

const handleUserLogin = async (req, res) => {
    const data = req.body
    const producer = kafka.producer({createPartitioner:Partitioners.LegacyPartitioner})
    await producer.connect()
    console.log("producer connected")
    await producer.send({
        topic:'user-request-topic',
        messages:[{value:JSON.stringify({action:'login', data:data})}]
    })
    //res.status(200).send("message sent")
    await producer.disconnect()
    const consumer = kafka.consumer({groupId:'user-res-group'})
    await consumer.connect()
    await consumer.subscribe({topic:'user-response-topic'})
    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            const userMessage = JSON.parse(message.value.toString())
            console.log(userMessage.data)
            console.log(userMessage.data)
            if(!res.headerSent){
                if(userMessage.action == "user valid"){
                    const payload = {
                        role:userMessage.data.role
                    }
                    const token = await jwt.sign(payload, process.env.SECRET || "manikanta123")
                    console.log(token)
                   res.status(200).json({Access_token:token})
                }else if(userMessage.action == "user not valid"){
                    res.status(400).json({message:userMessage.action})
                }
            await consumer.disconnect()
            }
        }
    })
}

async function handleAdmin(req, res){
    logger.info("hello")
    logger.warn("hey")
    logger.error("error")
    logger.debug("debug")
    res.send("hello admin")
}

async function handleManager(req, res){
    res.send("hello Manager")
}


module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleAdmin,
    handleManager
}