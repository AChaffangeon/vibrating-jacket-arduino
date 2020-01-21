const WebSocket = require('ws');
const SerialPort = require('serialport');

const port = new SerialPort("/dev/cu.usbmodem141101", {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});


let buffer = [];

function addMessage(message) {
    while (buffer.length >= 10){
        buffer.shift();
    }
    
    buffer.push(message);
}

function writeMessage() {
    if(buffer.length == 0){
        return;
    }
    let message = buffer.shift();
    port.write(message);
}

setInterval(function () { writeMessage(); }, 100);

const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        addMessage(message);
    });
});
