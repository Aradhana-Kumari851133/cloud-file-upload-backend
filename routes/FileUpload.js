const express=require("express");
const router=express.Router();

const{imageUpload,videoUpload,imageReducerUpload,localFileUpload}=require("../controllers/fileUpload");
const{deleteFile}=require("../controllers/deleteUpload");
const{shareFile,getSharedFile,unshareFile}=require("../controllers/shareFile");
const{expiresIn}=require("../controllers/expiresIn");

//api route
router.post("/imageUpload",imageUpload);
router.post("/videoUpload",videoUpload);
router.post("/localFileUpload",localFileUpload);
router.post("/imageReducerUpload",imageReducerUpload);

//delete file from cloudinary
router.delete("/:id", deleteFile);
router.post("/share/:id", shareFile);
router.get("/shared/:shareToken", getSharedFile);
router.delete("/unshare/:id", unshareFile);
router.post("/expiresIn/:id",expiresIn);
module.exports=router;
