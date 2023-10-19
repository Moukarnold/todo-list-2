import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    id: String,
    task: String,
    date: String,
    time: String

});

const ListModel =  mongoose.model("ListItems", listSchema);

export default ListModel;  