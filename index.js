//app create
const express= require("express");
const app=express();

//port find karna hai
require("dotenv").config();
const PORT=process.env.PORT || 3000;



//middleware add karna hai
app.use(express.json());
const fileupload=require("express-fileupload");
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}));

const file=require("./routes/FileUpload");

//mount
app.use("/api/v1/upload",file);

app.listen(PORT,()=>{
   console.log(`server started successfully at ${PORT}`);

})

//db se connect karna hai
const dbConnection=require("./config/database");
dbConnection();

//cloud se connect karna hai
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();



app.get("/",(req,res)=>{
    res.send(`<h1>This is HomePage</h1>`);
})