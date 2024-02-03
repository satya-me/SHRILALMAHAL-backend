const QRCodeService = require('../services/qrcode.service');
const QRCode = require('qrcode');
const pdf = require('pdfkit');
const fs = require('fs'); // Using fs.promises for async file operations
const path = require('path');
const qrcode = require('qrcode');

exports.PDF = async (req, res) => {
    console.log({ message: `Generating PDF ${req.params.tag_name}.pdf .......... ` });

    const doc = new pdf({
        size: [12 * 72, 18 * 72], // Set the custom paper size in points (1 inch = 72 points)
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

        }

        // Generate QR code
        const _LINK = QRS[i].link + `/${process.env.PREFIX}/fd/` + QRS[i].shortLink;

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
            // fs.unlink(filename, (err) => {
            //     if (err) {
            //         console.error(`Error deleting file: ${err}`);
            //     } else {
            //         console.log(`${filename} File deleted successfully`);
            //     }
            // });
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


exports.PDF2 = async (req, res) => {
    const QRS = await QRCodeService.getAllCode(req.params.tag_name);


    // Define the paper size and PDF document
    const doc = new pdf({
        size: [12 * 72, 18 * 72], // Set the custom paper size in points (1 inch = 72 points)
        margin: 0, // No margin
    });

    console.log({ message: `Generating PDF ${req.params.tag_name}.pdf .......... ` });

    // Define the QR code size and margin
    const qrSize = 1; // in inches
    const qrMargin = 0.125; // in inches

    // Calculate the actual size of the QR image (excluding the margin)
    const qrImageSize = qrSize - 2 * qrMargin;

    // Calculate the number of QR codes per row and per column
    const qrCodesPerRow = 12;
    const qrCodesPerColumn = Math.ceil((18 - 2 * qrMargin) / qrSize);

    // Set the total number of QR codes per page
    const totalQRCodesPerPage = qrCodesPerRow * qrCodesPerColumn;

    // Initialize variables to keep track of the current QR code data and the page count
    let currentPage = 1;
    let currentQRCodeIndex = 0;

    // Function to generate QR codes and add them to the PDF
    const generateQRCodes = async () => {
        // Loop to generate and add QR codes to the PDF
        for (let Q = 0; Q < QRS.length; Q++) {

            const element = QRS[Q];
            for (let row = 0; row < qrCodesPerColumn; row++) {
                for (let col = 0; col < qrCodesPerRow; col++) {
                    const x = col * qrSize * 72; // Convert inches to points
                    const y = row * qrSize * 72; // Convert inches to points

                    // Check if there is more QR code data
                    if (currentQRCodeIndex < QRS.length) {
                        const qrCodeData = element.link + `/${process.env.PREFIX}/fd/` + element.shortLink;
                        console.log({ qrCodeData });

                        // Generate QR code image and add it to the PDF
                        const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, { width: qrImageSize * 72 });
                        doc.image(qrCodeBuffer, x, y, { width: qrSize * 72, height: qrSize * 72 });

                        // Check if the current page is filled, and add a new page if needed
                        if (currentQRCodeIndex > 0 && currentQRCodeIndex % totalQRCodesPerPage === 0) {
                            doc.addPage();
                            currentPage++;
                        }
                    }
                }
            }
        }
    };

    // Generate QR codes
    await generateQRCodes();

    // Save or stream the PDF
    const filePath = `${req.params.tag_name}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.end();

    console.log({ message: `Saved PDF: ${filePath}` });

    res.send({ message: 'PDF generated successfully.' });
};

// Fixed code
/*
The paper size is 12x18 inches, and each QR code has a size of 1 inch including a margin of 0.125 inches on each side,
 making the actual size of the QR image 0.75 inches excluding the margin. You want to display 12 QR codes in a row, 
 and there should be a total of 216 QR codes on a page.
*/
exports.PDF3 = async (req, res) => {
    const doc = new pdf({
        size: [12 * 72, 18 * 72], // Set the custom paper size in points (1 inch = 72 points)
        margin: 0, // No margin
    });

    // Define the QR code size and margin
    const qrSize = 1; // in inches
    const qrMargin = 0.125; // in inches

    // Calculate the actual size of the QR image (excluding the margin)
    const qrImageSize = qrSize - 2 * qrMargin;

    // Calculate the number of QR codes per row and per column
    const qrCodesPerRow = 12;
    const qrCodesPerColumn = Math.ceil((18 - 2 * qrMargin) / qrSize);


    // Set the total number of QR codes per page
    const totalQRCodesPerPage = 216;

    // Loop to generate and add QR codes to the PDF
    for (let row = 0; row < qrCodesPerColumn; row++) {
        for (let col = 0; col < qrCodesPerRow; col++) {
            const x = col * qrSize * 72; // Convert inches to points
            const y = row * qrSize * 72; // Convert inches to points

            // Generate QR code data
            const qrCodeData = `https://google.com`;

            // Generate QR code image and add it to the PDF
            const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, { width: qrImageSize * 72 });
            doc.image(qrCodeBuffer, x, y, { width: qrSize * 72, height: qrSize * 72 });

            // Check if the total number of QR codes has been reached
            if (row * qrCodesPerRow + col + 1 === totalQRCodesPerPage) {
                console.log({ break: row * qrCodesPerRow + col + 1 });
                // break; // Exit the loop once the desired count is reached
            }
        }
    }

    // Save or stream the PDF
    doc.pipe(fs.createWriteStream(`${req.params.tag_name}.pdf`));
    doc.end();
    res.send({ message: `Generating PDF ${req.params.tag_name}.pdf .......... ` });
};

// Fixed code with dynamic QR code
exports.PDF6 = async (req, res) => {
    const pdfkit = require('pdfkit');
    const fs = require('fs');
    const QRCode = require('qrcode');

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

    for (const data of QRModel) {
        if (qrCodeCount % totalQRCodesPerPage === 0 && qrCodeCount > 0) {
            // Create a new page if the current page is full
            doc.addPage();
        }

        const row = Math.floor(qrCodeCount / qrCodesPerRow);
        const col = qrCodeCount % qrCodesPerRow;

        const x = col * qrSize * 72;
        const y = (row % (totalQRCodesPerPage / qrCodesPerRow)) * qrSize * 72;

        const _LINK = data.link + `/${process.env.PREFIX}/fd/` + data.shortLink;
        const qrCodeBuffer = await QRCode.toBuffer(_LINK, { width: qrImageSize * 72 });

        doc.image(qrCodeBuffer, x, y, { width: qrSize * 72, height: qrSize * 72 });

        qrCodeCount++;
    }

    const pdfFileName = `${req.params.tag_name}.pdf`;
    const pdfStream = fs.createWriteStream(pdfFileName);

    doc.pipe(pdfStream);
    doc.end();

    pdfStream.on('finish', () => {
        res.send({ message: `Generated PDF: ${pdfFileName}` });
    });
};



