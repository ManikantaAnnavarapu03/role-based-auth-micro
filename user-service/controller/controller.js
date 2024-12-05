const {Kafka, Partitioners} = require('kafkajs')
const bcrypt = require('bcrypt')
const db = require('../models/userModel')

const kafka = new Kafka({
    clientId:'Manikanta123',
    brokers:['localhost:9092']
})

const handleUserSignup = async () =>{
    const consumer = kafka.consumer({groupId:'user-service-group'})
    const producer = kafka.producer({createPartitioner:Partitioners.LegacyPartitioner})
    await consumer.connect()
    await consumer.subscribe({topic:'user-request-topic', fromBeginning:'true'})
    await consumer.run({
        eachMessage: async({topic, partition, message}) =>{
            console.log(message.value.toString())
            const userMessage = JSON.parse(message.value.toString())
            if(userMessage.action == "register"){
                try{
                const data = {...userMessage.data}
                const hashPassword = await bcrypt.hash(data.password, 10)
                const dbres = await db.insertMany({name:data.name, username:data.username, password:hashPassword, role: data.role})
                console.log(dbres)
                if(dbres.length == 1){
                    await producer.connect()
                    await producer.send({
                        topic:'user-response-topic',
                        messages:[{value:'user created'}]
                    })
                    await producer.disconnect()
                    
                }
            }catch(err){
                await producer.connect()
                await producer.send({
                    topic:'user-response-topic',
                    messages:[{value:'user exist'}]
                })
                await producer.disconnect()
                console.log(err)
            }
            }
            else if(userMessage.action == "login"){
                try{
                    const data = {...userMessage.data}
                    const dbres = await db.findOne({username:data.username})
                    console.log(dbres)
                    var result = ''
                    if(dbres == null){
                        result = "user not valid"
                    }
                    else if(await bcrypt.compare(data.password, dbres.password)){
                        result = "user valid"
                    }
                    else{
                        result = "password incorrect"
                        dbres = null
                    }
                    await producer.connect()
                    await producer.send({
                        topic:'user-response-topic',
                        messages:[{value:JSON.stringify({action:result,data:dbres})}]
                    })
                    await producer.disconnect()
                }catch(err){
                    result = "internal server error"
                    await producer.connect()
                    await producer.send({
                        topic:'user-response-topic',
                        messages:[{value:JSON.stringify(result)}]
                    })
                    await producer.disconnect()
                    console.error(err)
                }
            }
            await producer.connect()
            await producer.send({
                topic:'user-response-topic',
                messages:[{value:JSON.stringify({data:"hello"})}]
            })
            await producer.disconnect()
    }
        
    })
}

module.exports = {
    handleUserSignup
}
