export type Player = {
  id: string;
  name: string;
  lives: number;
  spectating: boolean;
  /**
   * array of chars
   */
  neededCharacters: Array<string>;
};
