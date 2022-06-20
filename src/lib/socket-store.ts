import { get, writable, type Writable } from "svelte/store";
import { GameSocket } from "./socket";

export const socketStore: Writable<GameSocket> = writable();

export async function getSocketInstance(): Promise<GameSocket> {
  return new Promise(function (resolve, reject) {
    const stored = get(socketStore);
    if (stored) {
      resolve(stored);
    } else {
      const socket = new GameSocket("ws://localhost:8080");

      // send logging
      const send = socket.raw.send.bind(socket.raw);
      socket.raw.send = (data) => {
        console.log(data);
        send(data);
      };

      socket.raw.addEventListener("open", function () {
        console.log("Socket opened");
        resolve(socket);
      });

      socket.raw.addEventListener("error", function () {
        console.log("Socket error");
        reject();
      });

      socket.raw.addEventListener("close", function () {
        console.log("Socket closed");
      });

      socket.raw.addEventListener("message", function (event) {
        console.debug(`message: ${event.data}`);
      });
      socketStore.set(socket);
    }
  });
}
