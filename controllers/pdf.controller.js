const QRCodeService = require('../services/qrcode.service');
// const pdf = require('pdfkit');
const fs = require('fs'); // Using fs.promises for async file operations
const path = require('path');
const qrcode = require('qrcode');
const pdfkit = require('pdfkit');
// const QRCode = require('qrcode');

const nodemailer = require('nodemailer');


exports.PDF = async (req, res) => {
    // console.log(PDF);

    const QRModel = await QRCodeService.getAllCode(req.params.tag_name);

    const qrSize = 1; // in inches
    const qrMargin = 0.125; // in inches
    const qrImageSize = qrSize - 2 * qrMargin;
    // console.log({qrImageSize});

    const qrCodesPerRow = 12;
    const totalQRCodesPerPage = 216;

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
        // Create a nodemailer transport
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            // requireTLS: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        console.log(path.resolve(__dirname, '..', filename));
        // Define email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER_TO,
            subject: `QR PDF of ${req.params.tag_name}`,
            text: `PLease find the ${filename} below.`,
            attachments: [
                {
                    filename: filename,
                    path: path.resolve(__dirname, '..', filename),
                    encoding: 'base64', // or 'buffer' if you want to use a Buffer
                },
            ],
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`Error sending email: ${error}`);
            } else {
                console.log(`Email sent: ${info.response}`);

            }

            // Close the PDF file stream after sending the email
            pdfStream.close();

            fs.unlink(filename, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err}`);

                } else {
                    console.log(`${filename} File deleted successfully`);

                }
            });

        });
    });
    doc.end();

    return res.status(200).json({
        page: `PDF generated with ${currentPage} pages.`,
        message: `Email sent to ${process.env.SMTP_USER_TO}`,
        fileName: filename
    });
    // console.log(`PDF generated with ${currentPage} pages.`);
};

// Function to generate QR code
async function generateQRCode(link, size) {
    // console.log({ link, size });

    return new Promise((resolve, reject) => {
        qrcode.toBuffer(link, { type: 'png', width: 80 }, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}