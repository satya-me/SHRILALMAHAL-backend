const QRCodeService = require('../services/qrcode.service');
const QRCode = require('qrcode');
const pdf = require('pdfkit');
const fs = require('fs'); // Using fs.promises for async file operations
const path = require('path');

exports.PDF = async (req, res) => {
    console.log({ message: 'Downloading PDF .......... ' });
    console.log(req.params.tag_name);
    // const doc = new pdf();
    const doc = new pdf({
        size: [13 * 72, 19 * 72], // Set the custom paper size in points (1 inch = 72 points)
        margin: 0, // No margin
    });

    const filename = req.params.tag_name + '.pdf';
    const QRS = await QRCodeService.getAllCode(req.params.tag_name);

    // Set the image properties
    const imageWidth = 60;
    const imageHeight = 60;
    const imagesPerRow = 12;
    const imagesPerPage = 216;
    const marginX = 16.5;
    const marginY = 15;

    let currentPage = 1;

    for (let i = 0; i < QRS.length; i++) {
        // Check if a new page needs to be added
        if (i > 0 && i % imagesPerPage === 0) {
            doc.addPage();
            currentPage++;

            // Add page number at the top of the page
            doc.fontSize(10).text(`Page ${currentPage}`, 20, 20);
        }

        // Generate QR code
        const _LINK = QRS[i].link + '/sl/' + QRS[i].shortLink;

        const qrCodeBuffer = await generateQRCode(_LINK, 100);

        // Calculate position for the current image with equal margins
        const rowIndex = (i % imagesPerPage) % imagesPerRow;
        const colIndex = Math.floor((i % imagesPerPage) / imagesPerRow);

        const x = marginX + rowIndex * (imageWidth + marginX);
        const y = marginY + colIndex * (imageHeight + marginY);

        // Add the QR code image to the PDF
        doc.image(qrCodeBuffer, x, y, { width: imageWidth, height: imageHeight });
    }

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
            // Now, you can attempt to delete the file
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


    console.log(`PDF generated with ${currentPage} pages.`);
}

exports.tt = async (req, res) => {
    const outputFilePath = 'qr_121.png';

    const dataToEncode = 'https://www.example.com';
    await generateQRCode(dataToEncode, 100);
    // // Generate QR code
    // QRCode.toFile('output.png', dataToEncode, (err) => {
    //     if (err) throw err;
    //     console.log(`QR code generated and saved as ${'output.png'}`);
    // });
}


// Function to generate QR code
async function generateQRCode(link, size) {
    // console.log('Calling.............. gen QR');
    const qrcode = require('qrcode');
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