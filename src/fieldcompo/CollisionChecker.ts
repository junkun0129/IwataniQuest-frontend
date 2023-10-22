import { GamePanel } from "./GamePanel";
import { Player } from "./Player";

type collisionCheckingType = {
  direction: "up" | "down" | "left" | "right";
  passive: { x: number; y: number };
  active: { x: number; y: number };
  index?: number;
};
export class CollisionChecker {
  gp: GamePanel;

  constructor(gp: GamePanel) {
    this.gp = gp;
  }

  collisonCheckerNPC(
    direction: "up" | "down" | "left" | "right",
    callback: (collisionNum: number) => void
  ) {
    let Nullindex: number = 999;
    if (this.gp.npc.length > 0) {
      for (let i: number = 0; this.gp.npc.length > i; i++) {
        this.gp.npc[i].collision = false;
        if (this.gp.mapState === this.gp.npc[i].field) {
          this.collisionChecking(
            {
              direction,
              passive: { x: this.gp.npc[i].npcX, y: this.gp.npc[i].npcY },
              active: { x: this.gp.player.playerX, y: this.gp.player.playerY },
              index: i,
            },
            (collision) => {
              this.gp.collision = true;
              this.gp.npc[collision].collision = true;
              callback(collision);
            }
          );
        }
      }
    }
    return Nullindex;
  }

  checkCollisionTile(direction: "up" | "down" | "left" | "right"): void {
    this.gp.collision = false;
    this.gp.collisionM.collisionArray.forEach((tile) => {
      let collisionTileX: number = tile.worldX - this.gp.player.playerX + 750;
      let collisionTileY: number = tile.worldY - this.gp.player.playerY + 350;
      this.collisionChecking(
        {
          direction,
          passive: { x: tile.worldX, y: tile.worldY },
          active: { x: this.gp.player.playerX, y: this.gp.player.playerY },
        },
        (collision) => {
          this.gp.collision = true;
        }
      );
    });
  }

  checkCollisionDoors(direction: "up" | "down" | "left" | "right"): void {
    for (let i: number = 0; i < this.gp.doors.length; i++) {
      if (this.gp.doors[i].locatation === this.gp.mapState) {
        if (this.gp.doors[i] !== undefined) {
          this.collisionChecking(
            {
              direction,
              passive: { x: this.gp.doors[i].x, y: this.gp.doors[i].y },
              active: { x: this.gp.player.playerX, y: this.gp.player.playerX },
            },
            (collision) => {
              console.log(";sldkfja;slfkjasldfkajs;dflkasj;flaksjf;d");
              this.gp.mapState =
                this.gp.doors[this.gp.doors[i].doorTo].locatation;
              this.gp.mapsChange = true;
              this.gp.lastDoorNum = i;
            }
          );
        }
      }
    }
  }

  collisionChecking = (
    { direction, passive, active, index }: collisionCheckingType,
    collision: Function
  ) => {
    let passiveX: number = passive.x - active.x;
    let passiveY: number = passive.y - active.y;

    switch (direction) {
      case "up": {
        if (
          active.x + this.gp.tilesize >= passiveX + passive.x - 3 &&
          active.x <= passiveX + this.gp.tilesize + passive.x - 3 &&
          active.y + this.gp.tilesize >= passiveY + passive.y &&
          active.y <= passiveY + this.gp.tilesize + passive.y
        ) {
          collision(index);
        }
        break;
      }
      case "down": {
        if (
          active.x + this.gp.tilesize >= passiveX + passive.x &&
          active.x <= passiveX + this.gp.tilesize + passive.x &&
          active.y + this.gp.tilesize + 80 >= passiveY + passive.y &&
          active.y <= passiveY + this.gp.tilesize + passive.y - 20
        ) {
          collision(index);
        }
        break;
      }
      case "left": {
        if (
          active.x + this.gp.tilesize >= passiveX + passive.x &&
          active.x - 20 <= passiveX + this.gp.tilesize + passive.x &&
          active.y + this.gp.tilesize >= passiveY + passive.y - 20 &&
          active.y <= passiveY + this.gp.tilesize + passive.y - 20
        ) {
          collision(index);
        }
        break;
      }
      case "right": {
        if (
          active.x + this.gp.tilesize + 20 >= passiveX + passive.x &&
          active.x <= passiveX + this.gp.tilesize + passive.x &&
          active.y + this.gp.tilesize >= passiveY + passive.y - 20 &&
          active.y <= passiveY + this.gp.tilesize + passive.y - 20
        ) {
          collision(index);
        }
        break;
      }
    }
  };

  checkCollisionNPCtoTile(direction: string): void {
    this.gp.collision = false;

    if (this.gp.npc.length > 0) {
      for (let i: number = 0; this.gp.npc.length > i; i++) {
        if (this.gp.mapState === this.gp.npc[i].field) {
          this.gp.collisionM.collisionArray.forEach((tile) => {
            let collisionTileX: number =
              tile.worldX - this.gp.player.playerX + 750;
            let collisionTileY: number =
              tile.worldY - this.gp.player.playerY + 350;

            let npcX: number =
              this.gp.npc[i].npcX - this.gp.player.playerX + 750;
            let npcY: number =
              this.gp.npc[i].npcY - this.gp.player.playerY + 350;

            switch (direction) {
              case "down": {
                if (
                  npcX + this.gp.tilesize >= collisionTileX + 20 &&
                  npcX <= collisionTileX + this.gp.tilesize - 20 &&
                  npcY + this.gp.tilesize >= collisionTileY &&
                  npcY <= collisionTileY + this.gp.tilesize - 20
                ) {
                  // console.log("collisionNPC down!!!");
                  this.gp.collisionNPC = true;
                }
                break;
              }

              case "right": {
                if (
                  npcX + this.gp.tilesize >= collisionTileX &&
                  npcX <= collisionTileX + this.gp.tilesize - 20 &&
                  npcY + this.gp.tilesize >= collisionTileY + 20 &&
                  npcY <= collisionTileY + this.gp.tilesize - 20
                ) {
                  // console.log("collisionNPC right!!!");
                  this.gp.collisionNPC = true;
                }
                break;
              }
              case "left": {
                if (
                  npcX + this.gp.tilesize >= collisionTileX + 20 &&
                  npcX <= collisionTileX + this.gp.tilesize &&
                  npcY + this.gp.tilesize >= collisionTileY + 20 &&
                  npcY <= collisionTileY + this.gp.tilesize - 20
                ) {
                  // console.log("collisionNPC left!!!");
                  this.gp.collisionNPC = true;
                }
                break;
              }

              case "up": {
                if (
                  npcX + this.gp.tilesize >= collisionTileX + 20 &&
                  npcX <= collisionTileX + this.gp.tilesize - 20 &&
                  npcY + this.gp.tilesize >= collisionTileY + 20 &&
                  npcY <= collisionTileY + this.gp.tilesize
                ) {
                  // console.log("collisionNPC up!!!");
                  this.gp.collisionNPC = true;
                }
                break;
              }
            }
          });
        }
      }
    }
  }

  CheckCollisionDoors(direction: string, hit: Function): void {
    for (let i: number = 0; i < this.gp.doors.length; i++) {
      if (this.gp.doors[i].locatation === this.gp.mapState) {
        if (this.gp.doors[i] !== undefined) {
          let objectX = this.gp.doors[i].x - this.gp.player.playerX + 750;
          let objectY = this.gp.doors[i].y - this.gp.player.playerY + 350;

          switch (direction) {
            case "down": {
              if (
                this.gp.player.playerX +
                  this.gp.tilesize * this.gp.doors[i].width >=
                  objectX + this.gp.doors[i].x - 800 + 20 &&
                this.gp.player.playerX <=
                  objectX +
                    this.gp.tilesize * this.gp.doors[i].width +
                    this.gp.doors[i].x -
                    700 -
                    20 &&
                this.gp.player.playerY +
                  this.gp.tilesize * this.gp.doors[i].height >=
                  objectY + this.gp.doors[i].y - 400 &&
                this.gp.player.playerY <=
                  objectY +
                    this.gp.tilesize * this.gp.doors[i].height +
                    this.gp.doors[i].y -
                    300 -
                    20
              ) {
                hit(i);
              }
              break;
            }

            case "right": {
              if (
                this.gp.player.playerX +
                  this.gp.tilesize * this.gp.doors[i].width >=
                  objectX + this.gp.doors[i].x - 800 &&
                this.gp.player.playerX <=
                  objectX +
                    this.gp.tilesize * this.gp.doors[i].width +
                    this.gp.doors[i].x -
                    700 -
                    20 &&
                this.gp.player.playerY +
                  this.gp.tilesize * this.gp.doors[i].height >=
                  objectY + this.gp.doors[i].y - 400 + 20 &&
                this.gp.player.playerY <=
                  objectY +
                    this.gp.tilesize * this.gp.doors[i].height +
                    this.gp.doors[i].y -
                    300 -
                    20
              ) {
                hit(i);
              }
              break;
            }
            case "left": {
              if (
                this.gp.player.playerX +
                  this.gp.tilesize * this.gp.doors[i].width >=
                  objectX + this.gp.doors[i].x - 800 + 20 &&
                this.gp.player.playerX <=
                  objectX +
                    this.gp.tilesize * this.gp.doors[i].width +
                    this.gp.doors[i].x -
                    700 &&
                this.gp.player.playerY +
                  this.gp.tilesize * this.gp.doors[i].height >=
                  objectY + this.gp.doors[i].y - 400 + 20 &&
                this.gp.player.playerY <=
                  objectY +
                    this.gp.tilesize * this.gp.doors[i].height +
                    this.gp.doors[i].y -
                    300 -
                    20
              ) {
                hit(i);
              }
              break;
            }

            case "up": {
              if (
                this.gp.player.playerX +
                  this.gp.tilesize * this.gp.doors[i].width >=
                  objectX + this.gp.doors[i].x - 800 + 20 &&
                this.gp.player.playerX <=
                  objectX +
                    this.gp.tilesize * this.gp.doors[i].width +
                    this.gp.doors[i].x -
                    700 -
                    20 &&
                this.gp.player.playerY +
                  this.gp.tilesize * this.gp.doors[i].height >=
                  objectY + this.gp.doors[i].y - 400 + 20 &&
                this.gp.player.playerY <=
                  objectY +
                    this.gp.tilesize * this.gp.doors[i].height +
                    this.gp.doors[i].y -
                    300
              ) {
                hit(i);
              }
              break;
            }
          }
        }
      }
    }
  }
  CheckCollisionBooks(direction: string): number {
    let Index = 999;

    for (let i: number = 0; i < this.gp.books.length; i++) {
      if (this.gp.books[i].mapstate === this.gp.mapState) {
        if (this.gp.books[i] !== undefined) {
          let objectX = this.gp.books[i].x - this.gp.player.playerX + 750;
          let objectY = this.gp.books[i].y - this.gp.player.playerY + 350;

          switch (direction) {
            case "down": {
              if (
                this.gp.player.playerX + this.gp.tilesize >=
                  objectX + this.gp.books[i].x - 800 + 20 &&
                this.gp.player.playerX <=
                  objectX + this.gp.tilesize + this.gp.books[i].x - 700 - 20 &&
                this.gp.player.playerY + this.gp.tilesize >=
                  objectY + this.gp.books[i].y - 400 &&
                this.gp.player.playerY <=
                  objectY + this.gp.tilesize + this.gp.books[i].y - 300 - 20
              ) {
                console.log("books!!!!!!");
                // if(this.gp.books[i].jumpable)window.location.href = "/book";
                // if(this.gp.books[i].speakable)
                return i;
              }
              break;
            }

            case "right": {
              if (
                this.gp.player.playerX + this.gp.tilesize >=
                  objectX + this.gp.books[i].x - 800 &&
                this.gp.player.playerX <=
                  objectX + this.gp.tilesize + this.gp.books[i].x - 700 - 20 &&
                this.gp.player.playerY + this.gp.tilesize >=
                  objectY + this.gp.books[i].y - 400 + 20 &&
                this.gp.player.playerY <=
                  objectY + this.gp.tilesize + this.gp.books[i].y - 300 - 20
              ) {
                console.log("books!!!!!!");
                // if(this.gp.books[i].jumpable)window.location.href = "/book";
                return i;
              }
              break;
            }
            case "left": {
              if (
                this.gp.player.playerX + this.gp.tilesize >=
                  objectX + this.gp.books[i].x - 800 + 20 &&
                this.gp.player.playerX <=
                  objectX + this.gp.tilesize + this.gp.books[i].x - 700 &&
                this.gp.player.playerY + this.gp.tilesize >=
                  objectY + this.gp.books[i].y - 400 + 20 &&
                this.gp.player.playerY <=
                  objectY + this.gp.tilesize + this.gp.books[i].y - 300 - 20
              ) {
                console.log("books!!!!!!");
                // if(this.gp.books[i].jumpable)window.location.href = "/book";
                return i;
              }
              break;
            }

            case "up": {
              if (
                this.gp.player.playerX + this.gp.tilesize >=
                  objectX + this.gp.books[i].x - 800 + 20 &&
                this.gp.player.playerX <=
                  objectX + this.gp.tilesize + this.gp.books[i].x - 700 - 20 &&
                this.gp.player.playerY + this.gp.tilesize >=
                  objectY + this.gp.books[i].y - 400 + 20 &&
                this.gp.player.playerY <=
                  objectY + this.gp.tilesize + this.gp.books[i].y - 300
              ) {
                console.log("books!!!!!!");
                // if(this.gp.books[i].jumpable)window.location.href = "/book";
                return i;
              }
              break;
            }
          }
        }
      }
    }
    return Index;
  }
  CheckCollisionObject(direction: string): number {
    let index: number = 999;

    for (let i: number = 0; i < this.gp.asset.itemsOnMap.length; i++) {
      if (this.gp.asset.itemsOnMap[i] !== undefined) {
        let objectX =
          this.gp.asset.itemsOnMap[i].x - this.gp.player.playerX + 750;
        let objectY =
          this.gp.asset.itemsOnMap[i].y - this.gp.player.playerY + 350;

        switch (direction) {
          case "down": {
            if (
              this.gp.player.playerX + this.gp.tilesize >=
                objectX + this.gp.asset.itemsOnMap[i].x - 800 + 20 &&
              this.gp.player.playerX <=
                objectX +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].x -
                  700 -
                  20 &&
              this.gp.player.playerY + this.gp.tilesize >=
                objectY + this.gp.asset.itemsOnMap[i].y - 400 &&
              this.gp.player.playerY <=
                objectY +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].y -
                  300 -
                  20
            ) {
              if (this.gp.asset.itemsOnMap[i].collision === true) {
                this.gp.collision = true;
              }

              return i;
            }
            break;
          }

          case "right": {
            if (
              this.gp.player.playerX + this.gp.tilesize >=
                objectX + this.gp.asset.itemsOnMap[i].x - 800 &&
              this.gp.player.playerX <=
                objectX +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].x -
                  700 -
                  20 &&
              this.gp.player.playerY + this.gp.tilesize >=
                objectY + this.gp.asset.itemsOnMap[i].y - 400 + 20 &&
              this.gp.player.playerY <=
                objectY +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].y -
                  300 -
                  20
            ) {
              if (this.gp.asset.itemsOnMap[i].collision === true) {
                this.gp.collision = true;
              }

              return i;
            }
            break;
          }
          case "left": {
            if (
              this.gp.player.playerX + this.gp.tilesize >=
                objectX + this.gp.asset.itemsOnMap[i].x - 800 + 20 &&
              this.gp.player.playerX <=
                objectX +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].x -
                  700 &&
              this.gp.player.playerY + this.gp.tilesize >=
                objectY + this.gp.asset.itemsOnMap[i].y - 400 + 20 &&
              this.gp.player.playerY <=
                objectY +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].y -
                  300 -
                  20
            ) {
              if (this.gp.asset.itemsOnMap[i].collision === true) {
                this.gp.collision = true;
              }

              return i;
            }
            break;
          }

          case "up": {
            if (
              this.gp.player.playerX + this.gp.tilesize >=
                objectX + this.gp.asset.itemsOnMap[i].x - 800 + 20 &&
              this.gp.player.playerX <=
                objectX +
                  this.gp.tilesize +
                  this.gp.asset.itemsOnMap[i].x -
                  700 -
                  20 &&
              this.gp.player.playerY + this.gp.tilesize >=
                objectY + this.gp.asset.itemsOnMap[i].y - 400 + 20 &&
              this.gp.player.playerY <=
                objectY + this.gp.tilesize + this.gp.asset.itemsOnMap[i].y - 300
            ) {
              if (this.gp.asset.itemsOnMap[i].collision === true) {
                this.gp.collision = true;
              }

              return i;
            }
            break;
          }
        }
      }
    }
    return index;
  }
}
