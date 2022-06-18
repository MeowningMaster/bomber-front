import { nanoid } from "nanoid";
import type { actions } from "./actions";
import type { Values } from "./typeUtilities/values";

class Socket {
  rawSocket: WebSocket;

  constructor(rawSocket: WebSocket) {
    this.rawSocket = rawSocket;
  }

  send(action: Values<typeof actions>, data?: object) {
    this.rawSocket.send(JSON.stringify({ ...data, action }));
  }

  async sendInstant(
    action: Values<typeof actions>,
    data?: object
  ): Promise<unknown> {
    const rawSocket = this.rawSocket;
    return new Promise(function (resolve) {
      const requestId = nanoid();

      function handler(event: MessageEvent<string>) {
        const data: { data: unknown; request_id: string } = JSON.parse(
          event.data
        );
        console.log(`handled ${data.request_id}`);
        if (data.request_id == requestId) {
          rawSocket.removeEventListener("message", handler);
          resolve(data.data);
        }
      }

      rawSocket.addEventListener("message", handler);

      rawSocket.send(
        JSON.stringify({
          ...data,
          action,
          request_id: requestId,
        })
      );
    });
  }
}

let socket: Socket;

export async function getSocketInstance(): Promise<Socket> {
  return new Promise(function (resolve, reject) {
    if (socket) {
      resolve(socket);
    } else {
      const rawSocket = new WebSocket("ws://localhost:8080");
      const socket = new Socket(rawSocket);

      socket.rawSocket.addEventListener("open", function () {
        console.log("Socket opened");
        resolve(socket);
      });

      socket.rawSocket.addEventListener("error", function () {
        console.log("Socket error");
        reject();
      });

      socket.rawSocket.addEventListener("close", function () {
        console.log("Socket closed");
      });

      socket.rawSocket.addEventListener("message", function (event) {
        console.log(`message: ${event.data}`);
      });
    }
  });
}
