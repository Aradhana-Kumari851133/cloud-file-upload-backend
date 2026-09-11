const mongoose=require("mongoose");
const nodemailer=require("nodemailer");

const fileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
     },
     imageUrl:{
        type:String,
     },
     cloudinaryPublicId:{
        type:String,
     },
     tags:{
        type:String,
     },
     email:{
        type:String,
     },
     shareToken:{
         type:String,
         unique:true,
     },
     isPublic:{
         type:Boolean,
         default:false,
     },
     expiresAt:{
         type:Date,
         default:()=>Date.now() + 3*60*1000, // 3 minutes from now
     }

});

//post middleware
fileSchema.post("save",async function (doc) {
   try{
     console.log('Doc',doc);
     //create transporter
     //ToDo :shift this configuration under config folder
     let transporter=nodemailer.createTransport({
      host:process.env.MAIL_HOST,
      auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD,
      },

     })

     //send email
     let info=await transporter.sendMail({
      from:`Ahuja Gm- by aradhana`,
      to:doc.email,
      subject:"New file uploaded on cloudinary",
      html:`<h2>Hello jee</h2> <p>File uploaded View here: <a href="${doc.imageUrl}">${doc.imageUrl}</a></p>`,
     });

     console.log("Info",info);


   }
   catch(error){
      console.log(error);

   }
})

const File=mongoose.model("File",fileSchema);
module.exports=File;