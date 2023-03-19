import { GamePanel } from "./GamePanel";
export class OtherPlayers {
  public gp: GamePanel;
  public direction: string;
  public playerX: number;
  public playerY: number;
  public playerXOriginal: number;
  public playerYOriginal: number;
  public speed: number;

  public screenX: number;
  public screenY: number;

  public spriteCounter: number = 0;
  public spriteNum: number = 1;

  public itemInventory: {
    name: string;
    x: number;
    y: number;
    picture: string;
    collision: boolean;
  }[] = [];

  public image: any;

  public previousRoom!: number;
}
