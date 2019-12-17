const SerialPort = require('serialport');

const port = new SerialPort('/dev/cu.usbmodem141101', {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
    });

/*    port.on("open", () => {
    console.log('serial port open');
    port.write("g");
});*/

const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', client => {
    client.on('event', data => { });
    client.on('update', data => { port.write(data); });
    client.on('disconnect', () => { /* … */ });
});
server.listen(3000);