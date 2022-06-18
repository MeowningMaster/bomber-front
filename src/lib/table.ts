import type { Player } from "./player";

export type Table = {
  id: string;
  name: string;
  players: Array<Player>;
  host: Player;
  gameInProgress: boolean;
  currentPlayer: Player | null;
  currentSyllable: string | null;
  currentWord: string | null;
};
