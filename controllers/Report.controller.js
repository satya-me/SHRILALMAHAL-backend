const QRCodeModel = require('../models/QRCode');
const ExcelJS = require('exceljs');
const fs = require('fs');


exports.ReportData = async (req, res) => {
    try {
        const data = await Report();

        // console.log(data);
        return res.json({ success: true, message: "Data fetched successfully.", data: data });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}


exports.DownloadExcel = async (req, res) => {

    const data = await Report();


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Capitalize and add header row
    const headerRow = Object.keys(data[0]).map(header => header.toUpperCase());
    worksheet.addRow(headerRow);

    // // Add header row
    // worksheet.addRow(Object.keys(data[0]));

    // Add data rows
    data.forEach(item => {
        worksheet.addRow(Object.values(item));
    });

    const filePath = 'transactions.xlsx';
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading the file");
        } else {
            // Delete the file after it's downloaded
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
};

async function Report() {
    // const Reports = await QRCodeModel.find({ transitions: 1, is_lucky_users: true, payment_resp: { $ne: null } });
    const Reports = await QRCodeModel.find(
        { transitions: 1, is_lucky_users: true, 'payment_resp': { $ne: null } },
        { tag: 1, 'payment_resp.id': 1, 'payment_resp.created_at': 1, 'payment_resp.amount': 1 }
    );


    // Create a dynamic data array based on the Reports
    const data = Reports
        .filter(report => report.payment_resp) // Filter out documents without payment_resp
        .map(report => ({
            tag: report.tag,
            transaction_id: report.payment_resp.id ?? 'NA',
            transaction_date: convertUnixTimestamp(report.payment_resp.created_at),
            transaction_amount: (report.payment_resp.amount / 100).toString() || "",
        }));


    // Function to convert Unix timestamp to human-readable date
    function convertUnixTimestamp(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleString(); // Adjust the format as needed
    }
    console.log(data);
    return data.reverse();
}


exports.UserReportData = async (req, res) => {
    try {
        // Pagination parameters
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;

        // const skip = (page - 1) * limit;

        // Aggregation pipeline for pagination and filtering
        const pipeline = [
            { $match: { transitions: 1 } }, // Filter documents where transitions is equal to 1
            { $sort: { createdAt: -1 } }, // Sort documents by createdAt field in descending order
            // { $skip: skip }, // Skip documents based on pagination
            // { $limit: limit }, // Limit the number of documents per page
            { $project: { _id: 0, data: 1 } } // Project only the data field
        ];

        // Perform aggregation
        const reports = await QRCodeModel.aggregate(pipeline);

        // Count total documents matching the filter
        const totalCount = await QRCodeModel.countDocuments({ transitions: 1 });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // Response data
        const response = {
            success: true,
            message: "Data fetched successfully.",
            data: reports,
            pagination: {
                total: totalCount,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit
            }
        };
        return res.json(response);
    } catch (error) {
        // Handle errors
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
