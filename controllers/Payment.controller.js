const axios = require('axios');



exports.UPIPay = async (req) => {
    let data = JSON.stringify({
        "account_number": req,
        "amount": 10000,
        "currency": "INR",
        "mode": "UPI",
        "purpose": "cashback",
        "fund_account": {
            "account_type": "vpa",
            "vpa": {
                "address": "satyajit08@axl"
            },
            "contact": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9876543210",
                "type": "employee",
                "reference_id": "Acme Contact ID 12345",
                "notes": {
                    "notes_key_1": "Tea, Earl Grey, Hot",
                    "notes_key_2": "Tea, Earl Grey… decaf."
                }
            }
        },
        "queue_if_low_balance": true,
        "reference_id": "UUID",
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
    console.log({ headers });

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
            console.log(error);
            return error;
        });
}

exports.CompositePay = async (req, res) => {
    // Call the UPIPay function using exports.UPIPay
    try {
        const result = await exports.UPIPay('2323230027319975');
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
}