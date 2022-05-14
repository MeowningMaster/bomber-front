export let socket: WebSocket;

export function setupSocket() {
  socket = new WebSocket("ws://bomb-game-server.herokuapp.com");

  socket.addEventListener("open", function (event) {
    console.log("Connected");
  });
}
