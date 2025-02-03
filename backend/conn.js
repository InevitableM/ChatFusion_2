const mongoose = require("mongoose");   
require("dotenv").config();
const uri = "mongodb+srv://toco:choco1234@cluster0.fiao1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const conn = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
}
module.exports = conn;