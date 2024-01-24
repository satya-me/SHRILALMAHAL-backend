require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const linkRouter = require('./routes/link.routes');
const qrcodeRouter = require('./routes/qrcode.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Use bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ extended: true }));
app.use(cookieParser());
// app.use(
//     cors({
//         credentials: true,
//         origin: process.env.CLIENT_URL,
//     }),
// );

app.use(cors());

app.use('/sl', linkRouter);
app.use('/expired', (req, res) => {
    return res.render('expired');

    // comment added
    // return res.send({ message: "Expired! link" });
});

app.use('/api/qrcode', qrcodeRouter);

app.get('/download-pdf', async (req, res) => {
    const filename = 'my-pdf.pdf';
    res.sendFile(filename, {
        root: __dirname, // Adjust according to your file structure
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${filename}`,
        },
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        app.listen(PORT, () => console.log('Started on port:', PORT));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
};

start();
