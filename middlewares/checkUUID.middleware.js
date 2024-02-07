exports.CheckUUID = async (req, res, next) => {
    try {
        if (!req.body.uuid) {
            return res.status(404).json({ success: false, message: "URL Tampering Detcted.", key: "url_tampering" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something Went Wrong. Please Try Again Later", error: err.message });
    }
};