const express=require("express");
const app=express();
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const authRoute=require("./routes/auth");
const userRoute=require("./routes/users");
const postRoute=require("./routes/posts");
const categoryRoute=require("./routes/categories");
const multer=require("multer");
const path=require("path");

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.connect(process.env.MONGO_URI)
.then(console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));
app.use(cors({
    origin: 'https://destination-dairy-frontend.onrender.com'
  }));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://destination-dairy-frontend.onrender.com'); // Replace '*' with the specific origin of your React app
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });
  
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },filename:(req,file,cb)=>{
        cb(null,req.body.name)//if wanted "hello.jpeg"
    }
});

const upload=multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("File has been uploaded");
})
app.use("/api/auth",authRoute); 
app.use("/api/users",userRoute); 
app.use("/api/posts",postRoute); 
app.use("/api/categories",categoryRoute);
app.listen("5001",()=>{
    console.log("Backend Is Running.");
})
