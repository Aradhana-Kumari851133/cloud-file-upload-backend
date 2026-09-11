const File=require("../models/File");
const crypto = require("crypto");
const cloudinary=require("cloudinary").v2;


exports.shareFile=async(req,res)=>{
    try{
       const file=await File.findById(req.params.id);
       if(!file){
           return res.status(404).json({
               success:false,
               message:"File not found",
           })
       }
       // Update the file to be public and generate a share token
       const shareToken = crypto.randomBytes(16).toString("hex");
        file.shareToken = shareToken;
         console.log(shareToken);

      file.isPublic = true;
      
    
       await file.save();
       res.json({
           success:true,
           message:"File shared successfully",
           shareToken:file.shareToken
       })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

exports.getSharedFile=async(req,res)=>{
    try{
        const file=await File.findOne({shareToken:req.params.shareToken});
        if(!file){
            return res.status(404).json({
                success:false,
                message:"File not found",
            })
        }
        if(!file.isPublic){
            return res.status(403).json({
                success:false,
                message:"File is not public",
            })
        }
        if(file.expiresAt && file.expiresAt.getTime() < Date.now()){
        return res.status(410).json({
    success: false,
    message: "Share link expired"
       });
    }
        res.json({
            success:true,
            file:file,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

exports.unshareFile=async(req,res)=>{
    try{
        const file=await File.findById(req.params.id);
        if(!file){
            return res.status(404).json({
                success:false,
                message:"File not found",
            })
        }
        // Update the file to be private and remove the share token
        file.isPublic = false;
        file.shareToken = null;
        await file.save();
        res.json({
            success:true,
            message:"File unshared successfully",
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

