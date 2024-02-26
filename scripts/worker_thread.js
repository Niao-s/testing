const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
    console.log(message.coucou);
    let big = bigComputing();
    parentPort.postMessage(big);
})

function bigComputing() {
    let i = 0;
    console.log("* start big computing")
    for (i = 0; i < 300; i++) {
    }
    return i;
}