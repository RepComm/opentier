
export class Vector {
 x: number;
 y: number;
 constructor(x = 0, y = 0) {
  this.set(x, y)
 }
 sub(o: Vector): this {
  this.x -= o.x;
  this.y -= o.y;
  return this;
 }
 add(o: Vector): this {
  this.x += o.x;
  this.y += o.y;
  return this;
 }
 set(x = 0, y = 0): this {
  this.x = x;
  this.y = y;
  return this;
 }
 copy(o: Vector): this {
  this.set(o.x, o.y)
  return this;
 }
 scale(v: number): this {
  this.x *= v;
  this.y *= v;
  return this;
 }
 mul(o: Vector): this {
  this.x *= o.x;
  this.y *= o.y;
  return this;
 }
 div(o: Vector): this {
  this.x /= o.x;
  this.y /= o.y;
  return this;
 }
 mag(): number {
  return Math.abs(
   Math.sqrt(
   Math.pow(this.x, 2) +
   Math.pow(this.y, 2)
   )
  )
 }
 lerp(o: Vector, a = 1): this {
  this.x = lerp(this.x, o.x, a)
  this.y = lerp(this.y, o.y, a)
  return this;
 }
 dist(o: Vector): number {
  return Math.sqrt(
   Math.pow(this.x - o.x, 2) +
   Math.pow(this.y - o.y, 2)
  )
 }
}

export const lerp = (from: number, to: number, by: number): number => {
  return from*(1-by)+to*by;
}
