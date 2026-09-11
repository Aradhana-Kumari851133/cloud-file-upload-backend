const File=require("../models/File");

const cloudinary=require("cloudinary").v2;

exports.deleteFile=async(req,res)=>{
    try{

        //pehle file find karo the delete karo cloudinary se and then database se
        const file=await File.findById(req.params.id);
        if(!file){
            return res.status(404).json({
                success:false,
                message:"File not found",
            })
        }

        //delete from cloudinary
        await cloudinary.uploader.destroy(file.cloudinaryPublicId);

        //delete from database
        await file.deleteOne();

        res.json({
            success:true,
            message:"File deleted successfully",
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