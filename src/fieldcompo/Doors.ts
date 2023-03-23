import { GamePanel } from "./GamePanel.js";
export class Doors {
  gp: GamePanel;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageName: string;
  collision: boolean;
  locatation: number;
  doorTo: number;
  outDirection: string;

  constructor(
    gp: GamePanel,
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    imageName: string,
    collision: boolean,
    locatation: number,
    doorTo: number,
    outDirection: string
  ) {
    this.gp = gp;
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.imageName = imageName;
    this.collision = collision;
    this.locatation = locatation;
    this.doorTo = doorTo;
    this.outDirection = outDirection;
  }

  draw(c: CanvasRenderingContext2D): void {
    if (this.gp.mapState === this.locatation) {
      let image = new Image();
      image.src = this.imageName;

      c.fillStyle = "rgba(0,0,0,0.1)";

      let objectX: number = this.x - this.gp.player.playerX + 750;
      let objectY: number = this.y - this.gp.player.playerY + 350;

      // c.drawImage(image, objectX, objectY, this.gp.tilesize, this.gp.tilesize);
      c.fillRect(
        objectX,
        objectY,
        this.gp.tilesize * this.width,
        this.gp.tilesize * this.height
      );
    }
  }
}
