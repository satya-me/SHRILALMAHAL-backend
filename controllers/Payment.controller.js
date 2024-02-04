const axios = require('axios');



exports.UPIPay = async (req) => {
    const AC = process.env.RAZORPAY_AC_NO;
    let data = JSON.stringify({
        "account_number": AC,
        "amount": 10000, // in 1 rupee = 100 paisa ex: 1*100 = 100
        "currency": "INR",
        "mode": "UPI",
        "purpose": "cashback",
        "fund_account": {
            "account_type": "vpa",
            "vpa": {
                "address": req.upi_id //
            },
            "contact": {
                "name": req.full_name, //
                "email": "", //
                "contact": req.mobile_number, //
                "type": "user",
                "reference_id": "Acme Contact ID 12345",
                "notes": {
                    "notes_key_1": "Tea, Earl Grey, Hot",
                    "notes_key_2": "Tea, Earl Grey… decaf."
                }
            }
        },
        "queue_if_low_balance": true,
        "reference_id": req.uuid,
        "narration": "Cashback Fund Transfer",
        "notes": {
            "notes_key_1": "Beam me up Scotty",
            "notes_key_2": "Engage"
        }
    });

    const username = process.env.RAZORPAY_USER; //'rzp_test_d9w5CSV7IzRWYm';
    const password = process.env.RAZORPAY_PASSW; //'YbCbOBOBy5DDjZChCkqWBWQd';

    // Encode the credentials in Base64
    const base64Credentials = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

    // Set up the headers with Basic Authentication
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`
    };
    // console.log({ headers });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.razorpay.com/v1/payouts',
        headers,
        data: data
    };

    return axios.request(config)
        .then((response) => {
            // console.log(JSON.stringify(response.data));
            return JSON.stringify(response.data);
        })
        .catch((error) => {
            console.log(error.message);
            return error.message;
        });
}

exports.CompositePay = async (req, res) => {
    // Call the UPIPay function using exports.UPIPay
    try {
        const AC = process.env.RAZORPAY_AC_NO;
        const result = await UPIPay(AC);
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
};

