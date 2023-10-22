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
    window.addEventListener("keydown", (e) => {
      if (this.gp.gameState === this.gp.fieldScene) {
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

        //menu open
        if (e.key === "q") {
          this.gp.gameState = this.gp.menuScene;
          this.gp.emitFromGamePanel("openMenu", "open");
        }
      }

      //talk
      if (this.gp.gameState === this.gp.talkingScene) {
        if (e.key === "e") {
          console.log("kim yunson");
          this.gp.sound[2].playMusic();
          this.gp.npc[this.gp.whoSpeakIndex].dialogIndex++;
          this.gp.npc[this.gp.whoSpeakIndex].speak();
        }
      }

      if (this.gp.gameState === this.gp.objectTalkingScene) {
        if (e.key === "e") {
          this.gp.sound[2].playMusic();
          this.gp.books[this.gp.whichSpeakIndex].dialogIndex++;
          this.gp.books[this.gp.whichSpeakIndex].speak();
        }
      }
    });
  }
  public keyUp(): void {
    if (this.gp.gameState === this.gp.fieldScene) {
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
}
