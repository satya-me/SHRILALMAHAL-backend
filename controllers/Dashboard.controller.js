const QRCodeModel = require('../models/QRCode');


// DashboardData
exports.DashboardData = async (req, res) => {
    try {
        const AllQRCodesCount = await QRCodeModel.countDocuments({});
        const UsedQRCodesCount = await QRCodeModel.countDocuments({ transitions: 1 });
        const TotalCashBack = "2,81,222";

        const HighlightedLocations = [
            { id: 1, lat: 20.5937, lng: 78.9629, },
            { id: 2, lat: 19.0760, lng: 72.8777, },
            { id: 3, lat: 28.6139, lng: 77.2090, },
            { id: 4, lat: 22.5726, lng: 88.3639, },
        ];

        const data = {
            HighlightedLocations,
            TotalCashBack,
            UsedQRCodesCount,
            AllQRCodesCount
        };

        return res.json({ success: true, message: "Data fetched successfully.", data: data });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
