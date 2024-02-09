const QRCodeModel = require('../models/QRCode');


// DashboardData
exports.DashboardData = async (req, res) => {
    try {
        const AllQRCodesCount = await QRCodeModel.countDocuments({});
        const UsedQRCodesCount = await QRCodeModel.countDocuments({ transitions: 1 });
        const USERS_WHO_WON_CASHBACK = await QRCodeModel.countDocuments({
            transitions: 1,
            is_lucky_users: true,
            'payment_resp': { $ne: null }
        });

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
            const latitude = location?.data?.location?.latitude;
            const longitude = location?.data?.location?.longitude;

            if (latitude !== undefined && longitude !== undefined) {
                acc.push({
                    id: location.id,  // Adjust the property name based on your actual schema
                    lat: latitude,
                    lng: longitude
                });
            }

            return acc;
        }, []);

        // console.log(HighlightedLocations);

        const data = {
            HighlightedLocations,
            TotalCashBack,
            UsedQRCodesCount,
            AllQRCodesCount,
            USERS_WHO_WON_CASHBACK
        };

        // console.log(data);

        return res.json({ success: true, message: "Data fetched successfully.", data: data });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
