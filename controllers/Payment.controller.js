const axios = require('axios');

const UPIPay = async (payload) => {
    // console.log({ satya: payload });
    // return payload;

    const AC = process.env.RAZORPAY_AC_NO;
    const username = process.env.RAZORPAY_USER; //'rzp_test_d9w5CSV7IzRWYm';
    const password = process.env.RAZORPAY_PASSW; //'YbCbOBOBy5DDjZChCkqWBWQd';
    // Encode the credentials in Base64
    const base64Credentials = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

    let data = JSON.stringify({
        "account_number": AC,
        "amount": Number(payload.amount) * 100,
        "currency": "INR",
        "mode": "UPI",
        "purpose": "cashback",
        "fund_account": {
            "account_type": "vpa",
            "vpa": {
                "address": payload.upi_id
            },
            "contact": {
                "name": payload.full_name,
                "email": "",
                "contact": payload.mobile_number,
                "type": "customer",
                "reference_id": payload.uuid,
                "notes": {
                    "notes_key_1": "Tea, Earl Grey, Hot",
                    "notes_key_2": "Tea, Earl Grey… decaf."
                }
            }
        },
        "queue_if_low_balance": true,
        "reference_id": payload.uuid,
        "narration": "Cashback Fund Transfer",
        "notes": {
            "notes_key_1": "Beam me up Scotty",
            "notes_key_2": "Engage"
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.razorpay.com/v1/payouts',
        headers: {
            'X-Payout-Idempotency': '',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Credentials}`
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        // console.log(JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        // console.error("Error response:", error.response.data);
        throw error;
    }

    // return result;
}

const CompositePay = async (req, res) => {
    // Call the UPIPay function using exports.UPIPay
    try {
        const payload = {
            amount: 150,
            upi_id: 'satyajit08@axl',
            full_name: "Satyajit Barik",
            mobile_number: "9658730362",
            uuid: "c23b91dc-e3fc-451c-9967-9793473cf846",
        }
        const result = await UPIPay(payload);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.send(error.message);
    }
};

// Export the controller function
module.exports = { UPIPay, CompositePay };