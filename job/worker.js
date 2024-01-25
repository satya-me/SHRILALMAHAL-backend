const { parentPort, workerData } = require('worker_threads');
const { v4: uuidv4 } = require('uuid');

async function backgroundTask() {
    console.log({ message: 'backgroundTask => worker.js' });
    try {
        const tag = workerData.tag;
        const count = workerData.count;
        for (let index = 0; index < count; index++) {
            const uniqueId = uuidv4();
            const payload = {
                tag: tag,
                transitions: 0,
                link: process.env.BASE_URL,
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
            await new Promise(resolve => setTimeout(resolve, 200));
            parentPort.postMessage('Background task completed.');
            parentPort.postMessage({
                tag,
                count
            });
        }
    } catch (e) {
        // console.error('Error in background task:', e.message);
        parentPort.postMessage({ error: e.message });
    }
}

backgroundTask();

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