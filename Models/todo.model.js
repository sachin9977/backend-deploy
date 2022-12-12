const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    id: Number,
    taskname:String,
    status: Boolean,
    tag: String,
    userId:String

})


const Todo = new mongoose.model("todo",todoSchema);

module.exports = {
    Todo
}