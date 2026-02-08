import { Component, ComponentChildren, RenderableProps } from "preact";
import { Vector } from "../../vector";
import { getImageFromUrl, Img } from "./img";
import { Ctx } from "./types";

/**
 * FNV1a
 * @param str string
 * @returns
 */
function hashString(str: string) {
 let hash = 2166136261;
 for (let i = 0; i < str.length; i++) {
  hash ^= str.charCodeAt(i);
  hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
 }
 return (hash >>> 0).toString(16);
}

export interface TierItemData {
 id?: string;
 imageUrl?: string;
 column?: number;
 row?: number;
 description?: string;

 bg?: string;
 fg?: string;
 text?: string;
}

export function hashItemData(data: TierItemData) {
 const txt = JSON.stringify(
   data,
  (k, v)=>{
   if (k === "column" || k === "row" || k === "id") return undefined;
   return v;
  })
  return hashString(txt)
}

export class TierItem {
 targetPosition: Vector;
 position: Vector;

 data: TierItemData;

 width: number;
 height: number;

 image: Img;

 constructor() {
  this.targetPosition = new Vector();
  this.position = new Vector();

  this.data = {};

  this.width = 1;
  this.height = 1;
 }
 setData(d: TierItemData, idPrefix: string): this {
  this.data = d;
  if (!this.data) return;
  this.targetPosition.set(
   this.data.column,
   this.data.row,
  );
  if (this.data.imageUrl) {
   getImageFromUrl(this.data.imageUrl).then((img, reason) => {
    this.image = img;
   });
  }
  this.data.id = idPrefix + hashItemData(this.data)
  return this;
 }
 render(ctx: Ctx): boolean {
  this.position.lerp(this.targetPosition, 0.1);

  if (this.image) {
   ctx.drawImage(this.image, 0, 0, 1, 1);
  } else {
   ctx.fillStyle = this.data.bg;
   ctx.fillRect(
    0, //this.position.x,
    0, //this.position.y,
    this.width,
    this.height,
   );
   ctx.fillStyle = this.data.fg;

   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   ctx.fillText(this.data.text, 0.5, 0.5, 1);
  }

  return this.position.dist(this.targetPosition) > 0.025;
 }
}

interface Props {
  data: TierItemData
  onChange: (data: TierItemData)=>void;
}
interface State {

}
export class TierItemDisplay extends Component<Props,State> {
  render() {
    return <div class="tier-item">
      { this.props.data.imageUrl &&
      <div class="tier-item-image"
      style={{
        backgroundImage: `url(${this.props.data.imageUrl})`
      }}
      ></div>
      }
      <textarea
        class="tier-item-description"
        value={this.props.data.description||""}
        onChange={(evt)=>{
          const t = evt.target as HTMLTextAreaElement;
          this.props.data.description = t.value
          this.props.onChange(this.props.data)
        }}
        ></textarea>
    </div>
  }
}
