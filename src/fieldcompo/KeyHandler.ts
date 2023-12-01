import { wait } from "../utils/wait.js";
import { GamePanel } from "./GamePanel.js";
export class Keyhandler {
  gp: GamePanel;
  upPressed: boolean = false;
  downPressed: boolean = false;
  leftPressed: boolean = false;
  rightPressed: boolean = false;
  iwatani: number = 1;

  constructor(gp: GamePanel) {
    this.gp = gp;
    this.keyDown();
    this.keyUp();
  }

  public keyDown(): void {
    window.addEventListener("keydown", async (e) => {
      if (e.key === "g") {
        console.log(this.gp.gameMode, "gamemode");
      }
      if (this.gp.gameMode === "walk") {
        if (e.key === "w") {
          this.upPressed = true;
        }
        if (e.key === "s") {
          this.downPressed = true;
        }
        if (e.key === "a") {
          this.leftPressed = true;
        }
        if (e.key === "d") {
          this.rightPressed = true;
        }
      }

      //talk
      if (this.gp.gameMode === "walk") {
        if (e.key === "e") {
          const collisionNPCIndex = this.gp.npc.findIndex(
            (person) => person.collision === true
          );
          if (collisionNPCIndex !== -1) {
            this.gp.emitFromGamePanel(
              "runIntoNPC",
              this.gp.npc[collisionNPCIndex]
            );
          }
        }
      }
    });
  }
  public keyUp(): void {
    window.addEventListener("keyup", (e) => {
      if (e.key === "w") {
        this.upPressed = false;
      }
      if (e.key === "s") {
        this.downPressed = false;
      }
      if (e.key === "a") {
        this.leftPressed = false;
      }
      if (e.key === "d") {
        this.rightPressed = false;
      }
    });
  }
}
