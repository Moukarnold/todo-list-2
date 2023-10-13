import express  from "express";
import bodyParser from "body-parser";
import uuid from 'uuid';
import mongoose from "mongoose";
import ListModel from "./itemManager.js";

const uuidv4 = uuid.v4;


const app = express();
const port = process.env.PORT || 3000;


const toDoList = [];

function createTasks(req, res, next){
    const theDay = req.body.date;
    const theTime= req.body.time;
    const theTask = req.body.task;
    
    if( theTask && theDay && theTime) {
      const taskId= uuidv4();
        toDoList.push({
              id:taskId,
            date: theDay,
            time: theTime,
            task: theTask, 
          });
          console.log('Task ID:', taskId);

          res.locals.toDoList= toDoList;
    
    }  
  
    next();
}



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(createTasks);


const createDocument = async ()=>{
 try{
   await mongoose.connect("mongodb://127.0.0.1:27017/todoListDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
   console.log("connection successful");
 
 const listItem = await ListModel.insertMany(toDoList);
 console.log(listItem);
}catch(error){
  console.error("MongoDb connection error:", error);
};
}
createDocument()

app.get("/", (req, res)=>{
  
 res.render("toDo",{tasks: toDoList});
});

app.get("/workList", (req, res)=>{
  const requestedDate = req.query.date;
  const requestedTasks = toDoList.filter((task)=>task.date === requestedDate ) 
  res.render("workList", { tasks: requestedTasks, date: requestedDate });

})

app.post("/",(req, res)=>{
      res.render("toDo",{tasks: toDoList});
  
});

app.post("/workList", (req, res)=>{
    const newTask= req.body.task;
    const newTime= req.body.time;
    const date= req.body.date;
    const id = req.body.id;

  if (newTask && date && id) {
    const existingTask = toDoList.find(task => task.date === date && task.task === newTask && task.id===id);

    if (!existingTask) {
      toDoList.push({
        id: id,
        date: date,
        time: newTime,
        task: newTask,
      });
    }
   
  }
    res.redirect(`/workList?date=${date}`);
})

app.get("/todos-list",(req, res)=>{
   res.render("toDoList", {tasks: toDoList})
})

app.listen( port, ()=>{
    console.log(" server on port", port);
});


