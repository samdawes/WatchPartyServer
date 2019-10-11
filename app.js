let WebSocket = require('ws');

//web socket server
let wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    var message = JSON.parse(data);
    let room_code = message.room_code;

    wss.clients.forEach(function each(client) {
      //The protocol is the room_code, host clients will have a protocol that is a room_code,
      //guest clients will have the protocol "guest"
      let protocol = client.protocol;

      //Only send data to the host client, who has the same room_code (client protocol) as the message
      if (client !== ws && client.readyState === WebSocket.OPEN && protocol === room_code) {
        client.send(data);
      }
    });
  });
});
