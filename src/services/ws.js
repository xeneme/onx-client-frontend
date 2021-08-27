const ws = new WebSocket("ws://192.168.1.119:9090/trading");

ws.onopen = () => {
  console.log("WS connected");
};

ws.onmessage = function (message) {
  console.log("Message: %s", message.data);
};