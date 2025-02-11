const mongoose = require("mongoose");   
require("dotenv").config();
const uri = process.env.URI;

const conn = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
}
module.exports = conn;