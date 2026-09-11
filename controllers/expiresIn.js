const File=require("../models/File");


exports.expiresIn = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
                 console.log("REQ BODY:", req.body);


        const { expiresIn } = req.body;

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        if (!file.isPublic) {
            return res.status(403).json({
                success: false,
                message: "File is not public"
            });
        }

        if (!expiresIn) {
            return res.status(400).json({
                success: false,
                message: "Please provide expiresIn"
            });
        }

        const expiresAt = new Date(
            Date.now() + expiresIn * 60 * 1000
        );

        file.expiresAt = expiresAt;

        await file.save();

        res.json({
            success: true,
            message: "Expiry set successfully",
            expiresAt: file.expiresAt
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};