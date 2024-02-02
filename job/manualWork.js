const { v4: uuidv4 } = require('uuid');

exports.manualTask = async (count, tag) => {
    try {

        for (let index = 0; index < count; index++) {
            const uniqueId = uuidv4();
            const payload = {
                tag: tag,
                transitions: 0,
                link: process.env.DOMAIN,
                style: {
                    bgColor: "#fff",
                    patternColor: "#000",
                    type: "url",
                },
                logo: {
                    src: "images/shri-lal-mahal-logo.png",
                },
                shortLink: uniqueId,
                user: '',
            };


            await __MAIN__(payload, index);
            await new Promise(resolve => setTimeout(resolve, process.env.SLEEP_TIME));
            console.log({
                tag,
                count
            });
        }
    } catch (e) {
        // console.error('Error in background task:', e.message);
        console.log({ error: e.message });
    }
}

async function __MAIN__(payload, index) {
    console.log({ message: "Calling __MAIN__ function.", index });
    fetch(`${process.env.BASE_URL}/api/test/qr/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // You may need to add other headers based on your API requirements
        },
        body: JSON.stringify(payload),
    })
        .then(response => response.json())
        .then(data => {
            // Process the data as needed
            console.log('Data received:', data);
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
        });
}
