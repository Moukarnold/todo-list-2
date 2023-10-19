import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ListModel from "./itemManager.js";



const app = express();
const port = process.env.PORT || 3000;





app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const createDocument = async ()=>{
 try{
   await mongoose.connect("mongodb://127.0.0.1:27017/todoListDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
   console.log("connection successful");
 
 
} catch(error){
  console.error("MongoDb connection error:", error);
};
}

//display all the tasks depending on the date at the homepage and read from them from mongodb
app.get("/", async (req, res)=>{

  try{
    const taskDatas = await ListModel.find();
    res.render("toDo",{tasks: taskDatas});
  } catch (error){
    console.error(" tasks can´t not be laoded from Mongodb",error);
  }
});


// post-request that captures the tasks at he home page and store them to mongodb
app.post("/", async (req, res)=>{
   
  const newTask = req.body.task;
  const newTime = req.body.time;
  const newDate = req.body.date;

     
       if ( newTask && newTime && newDate){
try{ 
        const newTaskData = {
             task: newTask,
             time: newTime,
             date: newDate,       
             };
    
     const savedTask = await ListModel.create(newTaskData);
     console.log("tasks added to Mongodb",savedTask );

}catch (error){
  console.error(" tasks aren´t added to Mongodb:", error);
};
       };
res.redirect("/");
})



 createDocument()

app.listen( port, ()=>{
    console.log(" server on port", port);
});


