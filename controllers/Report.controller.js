const QRCodeModel = require('../models/QRCode');

exports.ReportData = async (req, res) => {
    try {
        const data = [
            {
                tag: "TEST69",
                count: "35751",
                transaction_id: "TRNS281222IND",
                transaction_date: "12-28-2022",
                transaction_amount: "12282022",
            },
            {
                tag: "TEST70",
                count: "46862",
                transaction_id: "TRNS271222IND",
                transaction_date: "12-27-2022",
                transaction_amount: "12272022",
            },
        ];
        return res.json({ success: true, message: "Data fetched successfully.", data: data });
    } catch (error) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}