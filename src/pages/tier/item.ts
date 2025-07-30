import { Vector } from "../../vector";
import { getImageFromUrl, Img } from "./img";
import { Ctx } from "./types";

export interface TierItemData {
 id: string;
 imageUrl: string;
 column: number;
 row: number;
}
export class TierItem {
 targetPosition: Vector;
 position: Vector;

 data: TierItemData;

 backgroundColor: string;
 color: string;
 text: string;

 width: number;
 height: number;

 image: Img;

 constructor(bg = "#555", fg = "#000", text = "", col = 0) {
  this.targetPosition = new Vector();
  this.position = new Vector();
  this.backgroundColor = bg;
  this.color = fg;
  this.text = text;
  this.width = 1;
  this.height = 1;
 }
 setData(d: TierItemData): this {
  this.data = d;
  if (!this.data) return;
  this.targetPosition.set(
   this.data.column,
   this.data.row
  )
  if (this.data.imageUrl) {
   getImageFromUrl(this.data.imageUrl).then((img, reason)=>{
    this.image = img;
   })
  }
  return this;
 }
 render(ctx: Ctx, highlight = false): boolean {
  this.position.lerp(this.targetPosition, 0.1)

  if (this.image) {
   ctx.drawImage(this.image, 0, 0, 1, 1)
  } else {
   ctx.fillStyle = this.backgroundColor;
   ctx.fillRect(
    0,//this.position.x,
    0, //this.position.y,
    this.width,
    this.height
   )
   ctx.fillStyle = this.color;
   
   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   ctx.fillText(this.text, 0.5, 0.5, 1)
  }

  const offset = 0.02
  if (highlight) {
   ctx.strokeStyle = this.color;
   ctx.strokeRect(0-offset, 0-offset, 1+(offset*2), 1+(offset*2))
  }

  return this.position.dist(this.targetPosition) > 0.025
 }
}