const mongoose=require("mongoose");

require("dotenv").config();

const dbConnection=()=>{
  mongoose.connect(process.env.MONGODB_URL,{

  })
  .then(()=>console.log("DB ka Connection is Successful"))
  .catch((error)=>{
    console.log("Issue in connection");
    console.error(error.message);
     process.exit(1);

  });
}

module.exports=dbConnection;