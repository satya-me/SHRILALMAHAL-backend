const QRCodeService = require('../services/qrcode.service');
// const pdf = require('pdfkit');
const fs = require('fs'); // Using fs.promises for async file operations
const path = require('path');
const qrcode = require('qrcode');
const pdfkit = require('pdfkit');
// const QRCode = require('qrcode');

const nodemailer = require('nodemailer');


exports.PDF = async (req, res) => {


    const QRModel = await QRCodeService.getAllCode(req.params.tag_name);

    const qrSize = 2; // in inches
    const qrMargin = 0.2846457; // in inches
    const qrImageSize = 1.53543 + qrMargin; //qrSize - 2 * qrMargin;
    console.log({ qrImageSize, SIZE: qrImageSize * 72 });

    const qrCodesPerRow = 6;
    const totalQRCodesPerPage = 54;

    const doc = new pdfkit({
        size: [12 * 72, 18 * 72],
        margin: 0,
    });

    let qrCodeCount = 0;
    let currentPage = 1;
    for (const data of QRModel) {
        if (qrCodeCount % totalQRCodesPerPage === 0 && qrCodeCount > 0) {
            // Create a new page if the current page is full
            doc.addPage();
            currentPage++;
        }

        const row = Math.floor(qrCodeCount / qrCodesPerRow);
        const col = qrCodeCount % qrCodesPerRow;

        const x = col * qrSize * 72;
        const y = (row % (totalQRCodesPerPage / qrCodesPerRow)) * qrSize * 72;
        console.log({ x, y });

        const _LINK = data.link + `/${process.env.PREFIX}/fd/` + data.shortLink;
        // const qrCodeBuffer = await QRCode.toBuffer(_LINK, { width: qrImageSize * 72 });
        const qrCodeBuffer = await generateQRCode(_LINK, qrImageSize * 72);


        doc.image(qrCodeBuffer, x, y, { width: qrSize * 72, height: qrSize * 72 });

        qrCodeCount++;
    }

    const filename = `${req.params.tag_name}.pdf`;

    // Finalize PDF file
    const pdfStream = doc.pipe(fs.createWriteStream(filename));

    pdfStream.on('finish', () => {
        // Send the PDF file as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        const readStream = fs.createReadStream(filename);

        // Pipe the read stream to the response
        readStream.pipe(res);

        // Close the file stream after piping
        readStream.on('end', () => {

        });
    });
    doc.end();


    console.log(`PDF generated with ${currentPage} pages.`);
};

// Function to generate QR code
async function generateQRCode(link, size) {

    return new Promise((resolve, reject) => {
        qrcode.toBuffer(link, { type: 'png', width: size }, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}