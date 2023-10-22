import { GamePanel } from "./GamePanel.js";

export class UI {
  gp: GamePanel;
  menuNumber: number = 1;
  itemViewNum: number = 1;
  itemViewIndicateNum: number = 0;
  makesureNum: number = 1;
  makesureWaite: number = 0;

  numberOfItem: number = 1;
  currentDialog: string = "";

  playerDialogAppearNum: number = 0;

  constructor(gp: GamePanel) {
    this.gp = gp;
  }

  draw(c: CanvasRenderingContext2D) {}
}
