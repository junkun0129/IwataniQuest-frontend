type sequenceType =
  | "start"
  | "player-turn"
  | "player-action"
  | "enemy-action"
  | "end-player-win"
  | "end-player-lose"
  | "field";

type walkType = {
  name: string;
  email: string;
  x: number;
  y: number;
};

type userType = {
  userId: string;
  email: string;
  name: string;
  status: {
    at: number;
    exp: number;
    hp: number;
    maxmumHp: number;
    level: number;
  };
  token: string;
};
export interface ServerToClientEvents {
  screenSwitch: (hit: string) => void;
  backSwitch: (backback: string) => void;
  lose: ((toGamePanel: string) => void) | ((toReact: string) => void);
  save: ({
    x,
    y,
    mapState,
  }: {
    x: number;
    y: number;
    mapState: number;
  }) => void;
  pedestrians: (pedestrians: [walkType]) => void;
  newPedestrians: (newPedestrians: [walkType]) => void;
  tempoBack: (tempoBack: userType) => void;
  textOpentoField: (open: string) => void;
  textAppear: ({
    email,
    text,
  }: {
    email: string;
    text: string | undefined;
  }) => void;
  saveDoneToGP: ({
    x,
    y,
    mapState,
  }: {
    x: number;
    y: number;
    mapState: number;
  }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  oi: (input: string) => void;
  encount: (encount: string) => void;
  lose: (toServer: string) => void;
  back: (backback: string) => void;
  save: ({
    x,
    y,
    mapState,
  }: {
    x: number;
    y: number;
    mapState: number;
  }) => void;
  walk: ({ name, x, y }: walkType) => void;
  textOpen: (open: string) => void;
  textSubmit: ({
    email,
    text,
  }: {
    email: string;
    text: string | undefined;
  }) => void;
  saveDone: ({
    x,
    y,
    mapState,
  }: {
    x: number;
    y: number;
    mapState: number;
  }) => void;
}
export type battleResultType = "off" | "win" | "lose" | "escape";
export type gameModeType = "walk" | "battle" | "menu" | "event";
export type onFromGamePanelType = "encountEnemies" | "runIntoNPC" | "openMenu";
