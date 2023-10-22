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
    const availableTaskDatas = await ListModel.find();
    res.render("toDo",{tasks: availableTaskDatas});
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
        const TaskData = {
             task: newTask,
             time: newTime,
             date: newDate,       
             };
    
     const savedTask = await ListModel.create(TaskData);
     console.log("tasks added to Mongodb",savedTask );

}catch (error){
  console.error(" tasks aren´t added to Mongodb:", error);
};
       };
res.redirect("/");
})


//display the tasks from the choosen date from the datas store on tne mongodb
app.get("/workList", async (req, res)=>{
   
 const requestedDate = req.query.date;

 try {
   const requestedTasks = await ListModel.find( {date: requestedDate});
   res.render("workList", {tasks: requestedTasks, date: requestedDate});
 } catch(error) {
 console.log("can not display the tasks of choosen date ", error);
  }
  });

 
// add new tasks on choosen date in the database ans display it
 app.post("/workList", async (req, res)=>{
   const date = req.query.date;
    const  newTime= req.body.time;
    const newTask= req.body.task;
    if ( newTime && newTask){
      try {
        const taskData = {
          task: newTask,
          time: newTime,
          date: date,
        };
        const savedTask = await ListModel.create(taskData);
            console.log(" the updated task is :", savedTask );
      } catch (error){
        console.error("error during the update of the task", error);
      }
      res.redirect(`/workList?date=${date}`);
    }
  })

 app.get("/todos-list", async (req, res)=>{
    
  try{
    const todoList = await ListModel.find();
    res.render("todoList", { tasks: todoList})

  }catch (error){
    console.error("todos can´t display :", error)
  }


 })



 createDocument()

app.listen( port, ()=>{
    console.log(" server on port", port);
});