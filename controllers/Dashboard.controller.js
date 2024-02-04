const QRCodeModel = require('../models/QRCode');


// DashboardData
exports.DashboardData = async (req, res) => {
    try {
        const AllQRCodesCount = await QRCodeModel.countDocuments({});
        const UsedQRCodesCount = await QRCodeModel.countDocuments({ transitions: 1 });

        const CashBack = await QRCodeModel.aggregate([
            {
                $match: {
                    transitions: 1,
                    is_lucky_users: true,
                    payment_resp: { $ne: null }  // Filter out documents where payment_resp is null
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$payment_resp.amount" }
                }
            }
        ]);

        // console.log(CashBack[0].totalAmount);
        const TotalCashBack = CashBack[0].totalAmount / 100;

        const Locations = await QRCodeModel.find({ transitions: 1 });

        const HighlightedLocations = Locations.reduce((acc, location) => {
            const lat = location?.data?.location?.lat;
            const lng = location?.data?.location?.lng;

            if (lat !== undefined && lng !== undefined) {
                acc.push({
                    id: location.id,  // Adjust the property name based on your actual schema
                    lat: lat,
                    lng: lng
                });
            }

            return acc;
        }, []);

        // console.log(HighlightedLocations);

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
