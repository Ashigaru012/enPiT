const server = require("ws").Server;
const s = new server({ port: 5001 });
console.log("success");

s.on("connection", ws => {
    ws.on("message", message => {
        console.log("Received: " + message);

        ws.send(message);
    });
});