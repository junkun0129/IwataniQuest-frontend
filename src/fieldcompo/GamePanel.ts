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
import { ServerToClientEvents, ClientToServerEvents } from "../App.js";
import { getItemFromLocalState } from "./LocalState";
import { OtherPlayers } from "./npc/OtherPlayers.js";

type statusType = {
  email: string;
  name: string;
  status: {
    at: number;
    exp: number;
    requireExp: number;
    hp: number;
    level: number;
    x: number;
    y: number;
    mapState: number;
  };
  userId: string;
};

type pedestriandsType = {
  name: string;
  email: string;
  x: number;
  y: number;
};

const damiStatus = {
  email: "",
  name: "",
  status: {
    at: 0,
    exp: 0,
    requireExp: 0,
    hp: 0,
    level: 0,
    x: 0,
    y: 0,
    mapState: 0,
  },
  userId: "",
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

  public screenWidth: number = 1500;
  public screenHeight: number = 700;

  public worldWidth: number = 3840;
  public worldHeight: number = 2560;

  public originalTilesize: number = 32;
  public scale: number = 2;
  public tilesize: number = this.originalTilesize * this.scale;

  public showCoodinates: boolean = true;

  public status: statusType = damiStatus;

  public pedestrians: pedestriandsType[] = [];
  public otherPlayers: OtherPlayers[] = [];

  public isTextApper: boolean = false;
  public textAppearPersonEmail: string = "";
  public textAppearPersonText: string | undefined = "";

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
    console.log(this.player.playerX);
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

    //start over
    if (this.gameStartOver) {
      this.asset.setObject();
      localStorage.removeItem("itemInventory");
      this.player.itemInventory = [];
      this.player.playerX = this.player.playerXOriginal;
      this.player.playerY = this.player.playerYOriginal;
    }

    // encount;
    if (this.gameState === this.fieldScene) {
      const encount = this.Encounter();
      if (
        encount &&
        this.gameState !== this.battleScene &&
        this.mapState === this.outField
      ) {
        this.socket.emit("encount", "hit");
        this.gameState = this.battleScene;
      }
    }

    this.socket.on("backSwitch", (data) => {
      this.gameState = this.fieldScene;
      this.mapState = this.outField;
    });

    this.socket.on("pedestrians", (data) => {
      for (let i: number = 0; i < data.length; i++) {
        this.otherPlayers[i] = new OtherPlayers(this);
        this.otherPlayers[i].npcX = data[i].x;
        this.otherPlayers[i].npcY = data[i].y;
        this.otherPlayers[i].picture = "/img/main.png";
        this.otherPlayers[i].direction = "down";
        this.otherPlayers[i].email = data[i].email;
      }
      // console.log(this.otherPlayers);
    });

    this.socket.on("textOpentoField", (data) => {
      if (data === "open") this.gameState = this.playerChattingScene;
      if (data === "close") this.gameState = this.fieldScene;
    });

    this.socket.on("textAppear", (data) => {
      // console.log(data, "junjun");
      this.isTextApper = true;
      const sameperson = this.otherPlayers.filter(
        (element) => element.email === data.email
      );

      console.log(sameperson);
      this.textAppearPersonEmail = sameperson[0].email;
      this.textAppearPersonText = data.text;
      // console.log(sameperson[0].email);
    });

    this.socket.on("saveDoneToGP", (data) => {
      console.log(data, "+;l;;;;;;;");
      this.player.playerX = data.x;
      this.player.playerY = data.y;
    });

    requestAnimationFrame(this.gameloop.bind(this));
  }

  public draw(): void {
    // this.count++;

    this.tileM.draw(this.c);
    this.player.draw(this.c);
    // console.log(this.otherPlayers);
    this.otherPlayers.forEach((otherPlayer, i) => {
      const yourIndex = this.otherPlayers.findIndex(
        (each) => each.email === this.status.email
      );

      if (i !== yourIndex) {
        this.otherPlayers[i].draw(this.c);
      } else {
      }
    });

    //collision tile
    this.collisionM.draw(this.c);

    //object
    for (let i: number = 0; i < this.doors.length; i++) {
      if (this.doors[i] !== undefined) {
        this.doors[i].draw(this.c);
      }
    }

    //book
    for (let i: number = 0; i < this.doors.length; i++) {
      if (this.books[i] !== undefined) {
        this.books[i].draw(this.c);
      }
    }

    this.asset.draw(this.c);

    this.ui.draw(this.c);
  }

  public Encounter(): boolean {
    const ramdomNum: number = Math.floor(Math.random() * 800);

    if (ramdomNum === 50) {
      return true;
    } else {
      return false;
    }
  }
}

//start game
// function start():void{

//     window.onload = ()=>{
//         let iwatani = new GamePanel;

//         iwatani.setup();
//     }
// }

// start();

// console.log("iwataniiiiii");

// let iwatani = new GamePanel;
// iwatani.setup();
// window.onload = ()=>{
//     iwatani.gameloop();
// }
