const QRCodeModel = require('../models/QRCode');
const TagModel = require('../models/Tag');
const PDFModel = require('../models/PdfFiles');
const { runBackgroundTask } = require('./BGController');

exports.getQRCode = async (req, res) => {
    try {
        // Parse request parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const tag = req.params.tag;

        // Combine database queries using Promise.all
        const [TAG_DATA, QRS_RESULT] = await Promise.all([
            TagModel.findOne({ name: tag }),
            QRCodeModel.aggregate([
                {
                    $facet: {
                        metadata: [
                            { $match: { tag: tag } },
                            { $group: { _id: null, total: { $sum: 1 } } },
                            { $project: { _id: 0, total: 1 } },
                        ],
                        data: [
                            { $match: { tag: tag } },
                            { $skip: (page - 1) * pageSize },
                            { $limit: pageSize },
                        ],
                    },
                },
            ]).allowDiskUse(true).exec(),
        ]);

        // Extract relevant data from results
        const QRS_LENGTH = QRS_RESULT[0]?.metadata[0]?.total || 0;
        const QRS = QRS_RESULT[0]?.data || [];

        // Fetch QR records
        // const _QR = await QRCodeModel.find({ tag });
        const _QR = await QRCodeModel.find({ tag }).limit(pageSize).skip((page - 1) * pageSize).exec();
        const lastRecord = _QR[_QR.length - 1];
        const recordCount = _QR.length;
        // return console.log({ TAG_DATA, _QR });
        const isFPD = await PDFModel.findOne({ file_name: `${tag}.pdf` });
        console.log({ isFPD });
        if (lastRecord) {
            // Calculate time difference
            const currentDate = new Date();
            const createdAtDate = new Date(lastRecord.createdAt);
            const secondsDifference = Math.floor((currentDate - createdAtDate) / 1000);

            if (secondsDifference > 60 && QRS_LENGTH < TAG_DATA.count) {
                // If conditions met, call background task and set flag
                const restOf = TAG_DATA.count - QRS_LENGTH;
                // runBackgroundTask(tag, restOf, TAG_DATA.count);
                console.log({
                    restOf,
                    QRS_LENGTH,
                    TagLn: TAG_DATA.count,
                    TOTAL_QRS_LENGTH: QRS_LENGTH,
                    TAG_DATA_COUNT: TAG_DATA.count,
                    _FLAG: { is_bg: true, massage: "Need to call BG" },
                });
                return res.send({
                    QRS,
                    QRS_LENGTH,
                    TOTAL_QRS_LENGTH: QRS_LENGTH,
                    TAG_DATA_COUNT: TAG_DATA.count,
                    _FLAG: { is_bg: true, massage: "Need to call BG" },
                });
            }
        }
        console.log({
            // QRS,
            QRS_LENGTH,
            TOTAL_QRS_LENGTH: QRS_LENGTH,
            TAG_DATA_COUNT: TAG_DATA.count,
            _FLAG: { is_bg: false, massage: "No need to call BG" },
        });
        // runBackgroundTask(tag, TAG_DATA.count, TAG_DATA.count);
        // Return response with appropriate flag
        return res.send({
            QRS,
            QRS_LENGTH,
            TOTAL_QRS_LENGTH: QRS_LENGTH,
            TAG_DATA_COUNT: TAG_DATA.count,
            isFPD: isFPD ? true : false,
            _FLAG: { is_bg: false, massage: "No need to call BG" },
        });
    } catch (error) {
        // Handle errors and return 500 status if necessary
        console.error("Error in getQRCode:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
