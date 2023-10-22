import { Player } from "./Player.js";
import { Keyhandler } from "./KeyHandler.js";
import { TileManager } from "./TileManager.js";
import { CollisionMap } from "./CollisionMap.js";
import { CollisionTile } from "./CollisionTile.js";
import { CollisionChecker } from "./CollisionChecker.js";
import { UI } from "./UI.js";
import { Doors } from "./Doors.js";
import { Asset } from "./Asset.js";
import { LSManager } from "./LSManager.js";
import { Npc } from "./npc/Npc.js";
import { Entity } from "./npc/Entity.js";
import { Sounds } from "./Sounds.js";
import { Book } from "./Book.js";
import { Socket } from "socket.io-client";
import { getItemFromLocalState } from "./LocalState";
import { OtherPlayers } from "./npc/OtherPlayers.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  battleResultType,
  gameModeType,
  onFromGamePanelType,
} from "../types/type.js";
import { userSliceType } from "../store/features/userStatuSlice.js";

// type statusType = {
//   email: string;
//   name: string;
//   status: {
//     at: number;
//     exp: number;
//     requireExp: number;
//     hp: number;
//     level: number;
//     x: number;
//     y: number;
//     mapState: number;
//   };
//   userId: string;
// };

type pedestriandsType = {
  name: string;
  email: string;
  x: number;
  y: number;
};

const damiStatus = {
  userId: "",
  email: "",
  name: "",
  status: {
    at: 0,
    exp: 0,
    requireExp: 0,
    hp: 0,
    maxmumHp: 0,
    level: 0,
    x: 0,
    y: 0,
    mapState: 0,
  },
};

export class GamePanel {
  // public oneC = new oneClass(this);
  // canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  count: number = 0;

  //game state
  public gameState: number = 1;
  public fieldScene: number = 1;
  public menuScene: number = 2;
  public itemViewSecne: number = 3;
  public startOverMakeSureScene: number = 4;
  public talkingScene: number = 5;
  public objectTalkingScene: number = 6;
  public statusViewScene: number = 7;
  public battleScene: number = 8;
  public saveScene: number = 9;
  public playerChattingScene: number = 10;

  public gameStartOver: boolean = false;

  //map state
  public field1: number = 0;
  public myHouse: number = 1;
  public inn: number = 2;
  public outField: number = 3;
  public firstVillage: number = 4;
  public yourHouse: number = 5;
  public mapState: number = this.yourHouse;
  public maps: string[] = [];
  public collisionDatas: number[][] = [];
  public mapsChange: boolean = true;

  public encounterCoolDown: number = 0;
  public lastDoorNum: number = 0;

  public whoSpeakIndex: number = 0;
  public whichSpeakIndex: number = 0;

  public player: Player = new Player(this);
  public entity: Entity = new Entity(this);
  public npc: Npc[] = [];
  public tileM: TileManager = new TileManager(this);
  public keyH: Keyhandler = new Keyhandler(this);
  public collisionM: CollisionMap = new CollisionMap(this);
  public collisionC: CollisionChecker = new CollisionChecker(this);
  public ui: UI = new UI(this);
  public doors: Doors[] = [];
  public asset: Asset = new Asset(this);
  public strageM: LSManager = new LSManager();
  public sound: Sounds[] = [];

  public input: string = "dekita";

  public User: {
    User_ID: number;
    Password: string;
    Username: string;
    LoginStatus: number;
  } = { User_ID: 0, Password: "", Username: "", LoginStatus: 0 };
  public Username: string = "";
  public Email: string = "";
  public ID: number = 0;
  public books: Book[] = [];
  public booksCollision: boolean = false;

  public collision: boolean = false;
  public collisionNPC: boolean = false;
  //public collisionArray:CollisionTile[] = this.collisionM.mapArrayCreate();

  public screenWidth: number = window.innerWidth;
  public screenHeight: number = window.innerHeight;

  public worldWidth: number = 3840;
  public worldHeight: number = 2560;

  public originalTilesize: number = 32;
  public scale: number = 2;
  public tilesize: number = this.originalTilesize * this.scale;

  public showCoodinates: boolean = true;

  public status: userSliceType = damiStatus;

  public pedestrians: pedestriandsType[] = [];
  public otherPlayers: OtherPlayers[] = [];

  public isTextApper: boolean = false;
  public textAppearPersonEmail: string = "";
  public textAppearPersonText: string | undefined = "";
  customEventListeners: {};
  eventListeners: Map<any, any>;

  public battleResult: battleResultType = null;
  constructor(
    c: CanvasRenderingContext2D,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {
    this.c = c;

    if (!c) {
      throw new Error("failed");
    }

    if (!socket) {
      throw new Error("soccket failed");
    }

    this.socket = socket;
    this.c = c;
    this.customEventListeners = {};
    this.eventListeners = new Map();
  }

  public setup(): void {
    this.asset.setObject();
    this.asset.setNpc();
    this.asset.setSounds();
    this.asset.setMaps();
    this.asset.setCollisions();
    this.asset.setDoor();
    //statusfetch
    this.status = JSON.parse(
      getItemFromLocalState("persist:root").userStatusReducer
    );
    this.player.playerX = this.status.status.x;
    this.player.playerY = this.status.status.y;
    this.mapState = this.status.status.mapState;

    // developer mode
    this.player.playerX = 2800;
    this.player.playerY = 2300;
    this.mapState = this.field1;

    this.gameloop();
  }

  public gameloop(): void {
    //map create
    this.collisionM.mapArrayCreate();
    //draw on canvas
    this.draw();
    if (this.gameState === this.fieldScene) {
      //player
      this.player.update();

      //npc
      if (this.npc.length > 0) {
        for (let i: number = 0; this.npc.length > i; i++) {
          this.npc[i].update();
        }
      }
    }

    // encount;
    if (this.gameState === this.fieldScene && this.mapState === this.outField) {
      this.encounterCoolDown -= 10;
      const encount = this.Encounter();
      if (
        encount &&
        this.gameState !== this.battleScene &&
        this.mapState === this.outField
      ) {
        this.emitFromGamePanel("encountEnemies", "hit");
        this.gameState = this.battleScene;
      }
    }
    // console.log(this.battleResult, "battleresult");
    if (this.battleResult === "win") {
      this.gameState = this.fieldScene;
      this.mapState = this.outField;
    }

    if (this.battleResult === "lose") {
      this.player.playerX = this.status.status.x;
      this.player.playerY = this.status.status.y;
      this.gameState = this.fieldScene;
      this.mapState = this.status.status.mapState;
      this.mapsChange = true;
      this.asset.setCollisions();
    }

    requestAnimationFrame(this.gameloop.bind(this));
  }

  public draw(): void {
    // this.count++;
    this.tileM.draw(this.c);

    //collision tile
    this.collisionM.draw(this.c);

    //object
    for (let i: number = 0; i < this.doors.length; i++) {
      if (this.doors[i] !== undefined) {
        this.doors[i].draw(this.c);
      }
    }

    // //book
    // for (let i: number = 0; i < this.doors.length; i++) {
    //   if (this.books[i] !== undefined) {
    //     this.books[i].draw(this.c);
    //   }
    // }

    this.asset.draw(this.c);
    this.player.draw(this.c);

    this.ui.draw(this.c);
  }

  public Encounter(): boolean {
    if (this.encounterCoolDown <= 0) {
      const ramdomNum: number = Math.floor(Math.random() * 100);

      if (ramdomNum === 50) {
        this.encounterCoolDown = 5000;
        return true;
      }
    }
    return false;
  }

  onFromGamePanel(event: onFromGamePanelType, listener: Function) {
    if (!this.customEventListeners[event]) {
      this.customEventListeners[event] = [];
    }
    this.customEventListeners[event].push(listener);
  }
  public emitFromGamePanel(event: onFromGamePanelType, data: any) {
    if (this.customEventListeners[event]) {
      for (const listener of this.customEventListeners[event]) {
        listener(data);
      }
    }
  }

  emitFromRedux(
    user: userSliceType,
    battleResult: battleResultType,
    gamemode: gameModeType
  ) {
    this.status = user;
    this.battleResult = battleResult;
    if (gamemode === "walk") {
      this.gameState = this.fieldScene;
    }
  }
}
