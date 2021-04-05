const mongoose = require('mongoose');
const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,
            {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
        console.log(`MongoDb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection failed!");
        console.log(`Error is  ${error}`);
        process.exit(1);  
    }
}


module.exports = connectDB;