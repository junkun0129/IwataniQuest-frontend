import { GamePanel } from "../GamePanel";
import { Entity } from "./Entity";

export class OtherPlayers extends Entity {
  // public gp: GamePanel;
  public email: string = "";
  public isDialogAppear: boolean = false;

  constructor(gp: GamePanel) {
    super(gp);
    this.gp = gp;
  }
}
