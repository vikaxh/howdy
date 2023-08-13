const mongoose = require("mongoose");
const color = require('colors')

module.exports =  connectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected : ${connect.connection.name}`.green.bold);
    } catch (error) {
        console.log(`Error:${error.message}`);
    }
}