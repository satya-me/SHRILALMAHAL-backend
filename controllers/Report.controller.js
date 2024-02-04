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
    const data = Reports.map(report => {
        return {
            tag: report?.tag,  // Assuming 'tag' is a property in your Reports documents
            transaction_id: report?.payment_resp.id,
            transaction_date: convertUnixTimestamp(report?.payment_resp?.created_at),
            transaction_amount: (report?.payment_resp?.amount / 100).toString() || "",  // Convert to string if needed
        };
    });

    // Function to convert Unix timestamp to human-readable date
    function convertUnixTimestamp(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        return date.toLocaleString(); // Adjust the format as needed
    }

    return data;
}