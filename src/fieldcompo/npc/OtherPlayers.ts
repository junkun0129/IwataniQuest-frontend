import { GamePanel } from "../GamePanel";
import { Entity } from "./Entity";

export class OtherPlayers extends Entity {
  public gp: GamePanel;

  constructor(gp: GamePanel) {
    super(gp);
    this.gp = gp;
  }
}
