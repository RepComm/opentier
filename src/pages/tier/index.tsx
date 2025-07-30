
import { Component, createRef, RefObject } from "preact";
import "./style.css"
import { Vector } from "../../vector";
import { TierItem, TierItemData } from "./item";
import { Ctx } from "./types";
import { TierList } from "./list";

interface Props {
 tierid: string;
}
interface State {
 list: TierList;
}

function htmlStringToImgSrc(s: string): string {
 const p = new DOMParser()
 const d = p.parseFromString(s, "text/html")
 const i = d.querySelector("img")
 if (!i) return "";
 return i.src
}

export class Tier extends Component<Props, State> {
 canvasRef: RefObject<HTMLCanvasElement>;
 ctx: Ctx;
 onAnimationFrame: FrameRequestCallback;
 needsRedraw: boolean;
 zoomAmount: number;
 zoomWheelRate: number;
 zoomMin: number;
 zoomMax: number;
 translation: Vector;
 ratio: number;

 pointerDom: Vector;
 pointerRender: Vector;
 pointerWorld: Vector;
 pointerIsDown: boolean;
 pointerWorldPrev: Vector;
 pointerWorldDelta: Vector;

 constructor() {
  super();
  this.needsRedraw = true;
  this.canvasRef = createRef();

  this.zoomAmount = 1 / 6;
  this.zoomWheelRate = 1 / 1000;
  this.zoomMin = 0.01;
  this.zoomMax = 1;
  this.translation = new Vector();
  this.ratio = 1;

  this.pointerDom = new Vector();
  this.pointerRender = new Vector();
  this.pointerWorld = new Vector();
  this.pointerWorldPrev = new Vector();
  this.pointerWorldDelta = new Vector();
  this.pointerIsDown = false;

  const demo = new TierList("abcd", "Demo Tier", "abcde")


  this.state = {
   list: demo
  }

  this.item("red", "white", "X", 1, 0,
   "https://alishabmarie.wordpress.com/wp-content/uploads/2015/05/photo-3.png"
  )
  this.item("red", "white", "X", 1, 1,
   "https://alishabmarie.wordpress.com/wp-content/uploads/2015/05/photo-3.png"
  )

  this.item("red", "white", "S", 0, 0)
  this.item("orange", "white", "A", 0, 1)
  this.item("yellow", "white", "B", 0, 2)
  this.item("green", "white", "C", 0, 3)
  this.item("blue", "white", "D", 0, 4)
  this.item("purple", "white", "F", 0, 5)

 }
 item(bg: string, fg: string, text: string, col: number, row: number, imageUrl: string = undefined) {
  const x = Math.floor(col)
  const y = Math.floor(row)

  const item = new TierItem(bg, fg, text).setData({
   column: x,
   row: y,
   id: text,
   imageUrl
  })
  item.position.set(col, row)

  this.state.list.items.add(
   item
  )
 }

 renderCanvas() {
  this.needsRedraw = false;

  const ctx = this.ctx;
  const c = this.canvasRef.current;
  if (!c) {
   console.warn("no canvas?")
  }
  if (c == null) return;

  this.ratio = c.height / c.width;

  ctx.save()
  ctx.lineWidth = (1 / c.height) * 2;
  ctx.scale(c.height, c.height)
  ctx.clearRect(0, 0, 1 / this.ratio, 1)

  ctx.fillStyle = "white"
  const zoomPerc = (this.zoomAmount * 100).toFixed(0)
  let fontSize = 1;

  ctx.save()

  ctx.scale(this.zoomAmount, this.zoomAmount)
  ctx.translate(this.translation.x, this.translation.y)

  fontSize = 0.5
  ctx.font = `${fontSize}px courier`

  for (const item of this.state.list.items) {
   ctx.save();
   ctx.translate(item.position.x, item.position.y)
   if (item.render(ctx, this.selectedItem == item)) {
    this.needsRedraw = true;
   }
   ctx.restore();
  }

  ctx.strokeRect(
   this.pointerWorld.x,
   this.pointerWorld.y,
   0.05,
   0.05
  )

  ctx.restore()
  fontSize = 0.03
  ctx.font = `${fontSize}px courier`

  ctx.fillText(`Zoom: ${zoomPerc}%`, 0.025, 0.05)

  if (this.needsRedraw) {
   ctx.strokeStyle = "red"
   ctx.strokeRect(0, 0, 0.01, 0.01)
  }

  ctx.restore()
 }
 fixCanvasRes() {
  const c = this.canvasRef.current;
  const p = c.parentElement;
  // const ps = getComputedStyle(p)
  c.style.display = "none";

  const r = p.getBoundingClientRect()

  const w = r.width //- (parseFloat(ps.marginLeft) + parseFloat(ps.marginRight))
  const h = r.height //- (parseFloat(ps.marginTop) + parseFloat(ps.marginBottom))

  c.width = Math.floor(w)
  c.height = Math.floor(h)

  c.style.width = c.width + "px"
  c.style.height = c.height + "px"
  c.style.display = "unset";
  this.needsRedraw = true;
 }
 componentDidMount(): void {
  const c = this.canvasRef.current;

  this.ctx = c.getContext("2d")

  window.onresize = () => {
   this.fixCanvasRes()
  }

  this.onAnimationFrame = (delta: number) => {
   window.requestAnimationFrame(this.onAnimationFrame)
   if (this.needsRedraw) {
    this.renderCanvas()
   }
  }
  window.requestAnimationFrame(this.onAnimationFrame)
  setInterval(() => {
   this.needsRedraw = true;
  }, 1000)
  setTimeout(() => {
   this.fixCanvasRes()
  }, 500)
 }
 onPointerDown() {
  console.log(this.pointerWorld)
 }
 findItemUnderPointer(): TierItem {
  for (const item of this.state.list.items) {
   if (
    this.pointerWorld.y > item.targetPosition.y &&
    this.pointerWorld.y < item.targetPosition.y + 1 &&
    this.pointerWorld.x > item.targetPosition.x &&
    this.pointerWorld.x < item.targetPosition.x + 1
   ) {
    return item;
   }
  }
  return null;
 }
 selectedItem: TierItem;
 onPointerUp() {
  const item = this.findItemUnderPointer()
  if (item == null) {
   this.selectedItem = null;
   return;
  }
  if (this.selectedItem) {
   this.selectedItem = null;
  } else {
   this.selectedItem = item;
  }
 }
 domToRender(v: Vector) {
  const c = this.canvasRef.current;

  v.x /= c.height;
  v.y /= c.height;
 }
 renderToWorld(v: Vector) {
  v.scale(1 / this.zoomAmount)

  v.sub(this.translation)
 }
 domToWorld(v: Vector) {
  this.domToRender(v)
  this.renderToWorld(v)
 }
 pointerEventUpdatePosition(evt: MouseEvent) {
  this.pointerWorldPrev.copy(this.pointerWorld)

  this.pointerDom.set(evt.offsetX, evt.offsetY)

  this.pointerRender.copy(this.pointerDom);
  this.domToRender(this.pointerRender)

  this.pointerWorld.copy(this.pointerRender)
  this.renderToWorld(this.pointerWorld)


  // this.pointerWorldDelta
  //  .copy(this.pointerWorld)
  //  .sub(this.pointerWorldPrev);

  this.pointerWorldDelta.set(
   evt.movementX,
   evt.movementY
  )
  this.domToRender(this.pointerWorldDelta)
  this.pointerWorldDelta.scale(1 / this.zoomAmount)
 }
 renderDrawerItem(itemdata: TierItemData) {

  return <img
   class="item"
   src={itemdata.imageUrl}
   onDragStart={(evt) => {
    evt.dataTransfer.setData("text/plain", itemdata.id)
   }}
  />
 }
 renderDrawerItems() {
  const result = []
  for (const item of this.state.list.items) {
   result.push(
    this.renderDrawerItem(item.data)
   )
  }
  return result
 }
 render() {
  return <div class="tier">

   <div class="container">
    <canvas
     ref={this.canvasRef}
     onWheel={(evt) => {
      this.zoomAmount -= (evt.deltaY * this.zoomWheelRate) * this.zoomAmount;

      if (this.zoomAmount < this.zoomMin) {
       this.zoomAmount = this.zoomMin;
      } else if (this.zoomAmount > this.zoomMax) {
       this.zoomAmount = this.zoomMax;
      }
      this.needsRedraw = true;
     }}
     onPointerDown={(evt) => {
      this.pointerEventUpdatePosition(evt);
      this.onPointerDown();
      this.pointerIsDown = true;
     }}
     onPointerUp={(evt) => {
      this.pointerEventUpdatePosition(evt);
      this.onPointerUp();
      this.pointerIsDown = false;
     }}
     onPointerMove={(evt) => {
      this.pointerEventUpdatePosition(evt);
      if (this.selectedItem) {
       this.selectedItem.targetPosition.x = Math.floor(this.pointerWorld.x)
       this.selectedItem.targetPosition.y = Math.floor(this.pointerWorld.y)
      } else if (this.pointerIsDown) {
       this.translation.add(this.pointerWorldDelta);
      }
      this.needsRedraw = true;

     }}
     onDragOver={(evt) => {
      evt.preventDefault()
     }}
     onDrop={(evt) => {
      evt.preventDefault()
      this.pointerEventUpdatePosition(evt)


      const html = evt.dataTransfer.getData("text/html")
      const uris = evt.dataTransfer.getData("text/uri-list")
      const text = evt.dataTransfer.getData("text/plain")

      if (html) {
       const src = htmlStringToImgSrc(html)
       
       this.item(
        "black",
        "white",
        "x",
        this.pointerWorld.x,
        this.pointerWorld.y,
        src
       )
      }
      
     }}
    />
   </div>
   <div class="drawer">
    {this.state.list &&
     this.renderDrawerItems()
    }
   </div>
  </div>
 }
}
