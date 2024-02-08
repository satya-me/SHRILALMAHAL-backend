require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const authRouter = require('./routes/auth.routes');
const linkRouter = require('./routes/link.routes');
const qrcodeRouter = require('./routes/qrcode.routes');
const testRouter = require('./routes/bg.process.routes');
const payRouter = require('./routes/pay.routes');
const reportRouter = require('./routes/report.routes');
const dashboardRouter = require('./routes/dashboard.routes');

const errorMiddleware = require('./middlewares/error.middleware');


const app = express();


// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static('public'));

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
// Set the timeout for server requests
app.timeout = 600000; // 600 seconds
app.use('/sl', linkRouter);

// Proxy requests from /satya to an external URL



app.use('/expired', (req, res) => {
    return res.render('expired');
});
app.use('/hi', (req, res) => {
    return res.status(200).json({ message: "Server up......" });
});
app.use('/update', (req, res) => {
    // const QRModel = require('./models/QRCode');
    // const TAGModel = require('./models/Tag');
    // QRModel.updateMany({ tag: "Trial 31.01.2024  - 10500" }, { $set: { data: null, is_lucky_users: false, payment_resp: false } }, (err, result) => {
    //     // TAGModel.updateMany({ name: "Trial 31.01.2024  - 10500" }, { $set: { cashback_lucky_users: 10500, cashback_amount: 5 } }, (err, result) => {
    //     if (err) {
    //         console.error("Error updating documents:", err);
    //     } else {
    //         console.log("Documents updated successfully:", result);
    //     }
    // });
    return res.status(200).json({ message: "Updating......" });
});

app.use('/api/auth', authRouter);
app.use('/api/report', reportRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/qrcode', qrcodeRouter);
app.use('/api/pay', payRouter);

app.use('/api/test', testRouter);

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
