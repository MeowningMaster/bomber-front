import { nanoid } from "nanoid";
import { instantReplyActions, replyActions, requestActions } from "./actions";
import type { Table } from "./table";
import type { Values } from "./typeUtilities/values";
import { EventEmitter } from "events";
import type { Player } from "./player";

type NeverObject = Record<PropertyKey, never>;

type InstantEventResult<T extends object> = {
  action: Values<typeof instantReplyActions>;
  data: T;
};

export declare interface GameEventEmmiter {
  on(
    event: typeof replyActions.playerJoined,
    listener: (data: { player: Player }) => void
  ): this;

  on(
    event: typeof replyActions.playerLeft,
    listener: (data: { player: Player; next_player: Player | null }) => void
  ): this;

  on(
    event: typeof replyActions.gameStarted,
    listener: (data: {
      syllable: string;
      required_letters: Array<string>;
      current_player: Player;
    }) => void
  ): this;

  on(
    event: typeof replyActions.wordUpdated,
    listener: (data: { updated_word: string }) => void
  ): this;

  on(
    event: typeof replyActions.wordAccepted,
    listener: (data: { new_syllable: string; next_player: Player }) => void
  ): this;

  on(event: typeof replyActions.wordRejected, listener: () => void): this;

  on(
    event: typeof replyActions.timeHasRunOut,
    listener: (data: {
      new_syllable: string;
      next_player: Player;
      new_syllable_complexity: number;
      possible_word: string;
    }) => void
  ): this;

  on(
    event: typeof replyActions.lifeEarned,
    listener: (data: {
      player_id: string;
      new_required_letters: Array<string>;
    }) => void
  ): this;

  on(
    event: typeof replyActions.tableDeleted,
    listener: (data: { description: Table }) => void
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
        return;
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
        const eventResult: {
          action: Values<typeof instantReplyActions>;
          data: unknown;
          request_id: string;
        } = JSON.parse(event.data);
        if (eventResult.request_id == requestId) {
          this.removeEventListener("message", handler);
          resolve(eventResult as InstantEventResult<T>);
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
    return response.data.tables;
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

  async getMyTable() {
    const response = await this.emitInstantEvent(requestActions.getMyTable);
    return response.action === instantReplyActions.myTable
      ? (response.data.table as Table)
      : undefined;
  }

  deleteTable() {
    this.emitEvent(requestActions.deleteTable);
  }
}
