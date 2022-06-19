import { nanoid } from "nanoid";
import { instantReplyActions, replyActions, requestActions } from "./actions";
import type { Table } from "./table";
import type { Values } from "./typeUtilities/values";
import { EventEmitter } from "events";
import type { Player } from "./player";

type NeverObject = Record<PropertyKey, never>;

type InstantEventResult<T extends object> = {
  action: Values<typeof instantReplyActions>;
} & T;

export declare interface GameEventEmmiter {
  on(
    event: typeof replyActions.playerJoined,
    listener: (data: { player: Player }) => void
  ): this;
}

export class GameEventEmmiter extends EventEmitter {}

export class GameSocket {
  raw: WebSocket;
  emmiter: GameEventEmmiter;

  constructor(url: string) {
    this.raw = new WebSocket(url);

    this.emmiter = new EventEmitter();
    this.raw.addEventListener("message", (event) => {
      const eventData: { action: Values<typeof replyActions>; data: unknown } =
        JSON.parse(event.data);

      if (Object.values(replyActions).includes(eventData.action)) {
        this.emmiter.emit(eventData.action, eventData.data);
        console.group(`Action ${eventData.action} emmited`);
        console.log(eventData.data);
        console.groupEnd();
      }

      // ignore instant reply actions
      if (Object.values(instantReplyActions).includes(eventData.action)) {
        return;
      }

      console.log(`Unhandled game action ${eventData.action}`);
    });
  }

  emitEvent(action: Values<typeof requestActions>, data?: object) {
    this.raw.send(JSON.stringify({ ...data, action }));
  }

  async emitInstantEvent<T extends object = NeverObject>(
    action: Values<typeof requestActions>,
    data?: object
  ): Promise<InstantEventResult<T>> {
    return new Promise((resolve) => {
      const requestId = nanoid();

      function handler(event: MessageEvent<string>) {
        const eventData: {
          action: Values<typeof instantReplyActions>;
          data: unknown;
          request_id: string;
        } = JSON.parse(event.data);
        if (eventData.request_id == requestId) {
          this.removeEventListener("message", handler);
          resolve(eventData.data as InstantEventResult<T>);
        }
      }

      this.raw.addEventListener("message", handler);

      this.raw.send(
        JSON.stringify({
          ...data,
          action,
          request_id: requestId,
        })
      );
    });
  }

  async getTableList() {
    const response = await this.emitInstantEvent<{ tables: Array<Table> }>(
      requestActions.getTableList
    );
    return response.tables;
  }

  async createTable(playerName: string, tableName: string) {
    const response = await this.emitInstantEvent(requestActions.createTable, {
      player_name: playerName,
      table_name: tableName,
    });
    return response.action === instantReplyActions.createTableSuccess;
  }

  async joinTable(playerName: string, tableId: string) {
    const response = await this.emitInstantEvent(requestActions.joinTable, {
      player_name: playerName,
      table_id: tableId,
    });
    return response.action === instantReplyActions.joinTableSuccess;
  }

  async leaveTable() {
    await this.emitInstantEvent(requestActions.leaveTable);
  }

  startGame() {
    this.emitEvent(requestActions.startGame);
  }

  updateWord(updatedWord: string) {
    this.emitEvent(requestActions.updateWord, { updated_word: updatedWord });
  }

  confirmWord() {
    this.emitEvent(requestActions.confirmWord);
  }
}

let socket: GameSocket;

export async function getSocketInstance(): Promise<GameSocket> {
  return new Promise(function (resolve, reject) {
    if (socket) {
      resolve(socket);
    } else {
      const socket = new GameSocket("ws://localhost:8080");

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
    }
  });
}
