const File=require("../models/File");
const { options } = require("../routes/FileUpload");
const cloudinary=require("cloudinary").v2;


//localfileupload ->handle function
exports.localFileUpload=async(req,res)=>{
    try{
      //file ko fetch karna hai from request
      const file=req.files.file;
      console.log("File aa gayi =>",file);

    //create path where file need to stored on server
      let path=__dirname+"/files/"+Date.now()+`.${file.name.split('.')[1]}`;
      console.log("Path->",path);
     
      //add path to the move function
      file.mv(path,(err)=>{
        console.log(err);
      });
      res.json({
        success:true,
        message:"Local file uploaded successfully",
      })
    }
    catch(error){
       console.log(error); 
    }
}


function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality,height,width){

    const options={folder};
    console.log("temp file path",file.tempFilePath);

    if(quality){
        options.quality=quality;

    }
    if(height){
        options.height=height;
    }
    if(width){
        options.width=width;
    }
    options.resource_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);

}
//image upload ka handler
exports.imageUpload=async(req,res)=>{
    try{
        //data fetch
        const{name,email,tags}=req.body;
        console.log(name,tags,email);

        const file=req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes=["jpeg","jpg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log("Filetype",fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File Format not Supported',
            })
        }

        //file format supported ,cloudinary per upload
        const response=await uploadFileToCloudinary(file,"mediashop");
        console.log(response);

        //db mein entry save karna hai
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
            cloudinaryPublicId:response.public_id,
        });

       res.json({
        success:true,
        imageUrl:response.secure_url,
        message:'Image Successfully Uploaded',
       });

    }
    catch(error){
  console.log(error);
    res.status(400).json({
        success:false,
        message:'Something went wrong',
    });
    }
}

//video upload ka handler
exports.videoUpload=async(req,res)=>{
    try{
        //data fetch karna
        const{name,email,tags}=req.body;
        console.log(name,tags,email);

        const file=req.files.videoFile;
        console.log(file);

        //validation
        const supportedTypes=["mp4","mov"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        //todo:add a upper limit of 5MB for video
        if(!isFileTypeSupported(fileType,supportedTypes)){
           return res.status(400).json({
                success:false,
                message:'File Format not Supported',
            })  
        }
        if(file.size>10*1024*1024){
            return res.status(400).json({
                success:false,
                message:'File size should be less than 10MB',
            })  
        }

        //file format supported ,cloudinary per upload
        console.log("Uploading to media shop");
        const response=await uploadFileToCloudinary(file,"mediashop");
        console.log(response);

        //db mein entry save karna hai
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
            cloudinaryPublicId:response.public_id,
        });

       res.json({
        success:true,
        imageUrl:response.secure_url,
        cloudinaryPublicId:response.public_id,
        message:'Video Successfully Uploaded',
       });




    }
   catch(error){
    res.status(400).json({
        success:false,
        message:'Something went wrong',
        error:error.message,
    });
   }

}



//imageReducer upload ka handler
exports.imageReducerUpload=async(req,res)=>{
    try{
        //data fetch karna
        const{name,email,tags}=req.body;
        console.log(name,tags,email);

        const file=req.files.imageReducerFile;
        console.log(file);

        //validation
        const supportedTypes=["jpeg","jpg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        //todo:add a upper limit of 10MB for video
        if(!isFileTypeSupported(fileType,supportedTypes)){
           return res.status(400).json({
                success:false,
                message:'File Format not Supported',
            })  
        }

        //file format supported ,cloudinary per upload
        console.log("Uploading to media shop");
        const response=await uploadFileToCloudinary(file,"mediashop",90,400,800);
        console.log(response);
//console.log("Width:", response.width);
//console.log("Height:", response.height);
//console.log("Size:", response.bytes);
        //db mein entry save karna hai
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
            cloudinaryPublicId:response.public_id,
        });

       res.json({
        success:true,
        imageUrl:response.secure_url,
        cloudinaryPublicId:response.public_id,
        message:'ImageReducer Successfully Uploaded',
       });




    }
   catch(error){
    res.status(400).json({
        success:false,
        message:'Something went wrong',
        error:error.message,
    });
   }

}
