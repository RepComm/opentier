
const cache = new Map<string, Thenplz<Img>>()

export type Img = HTMLImageElement

interface ThenplzCb<T> {
 (v: T, reason: any): void;
}

class Thenplz<T> {
 
 v: T;
 reason: any;
 waiting: Set<ThenplzCb<T>>;

 constructor (executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void)=>void) {
  this.waiting = new Set()

  new Promise<T>(executor).then((v)=>{
   this.resolve(v, undefined)
  }).catch((reason)=>{
   this.resolve(undefined, reason)
  })
 }
 private resolve(v: T, reason: any) {
  this.v = v;
  this.reason = reason;
  for (const w of this.waiting) {
   w(v, reason);
  }
  this.waiting.clear()
 }

 then(cb: ThenplzCb<T>) {
  if (this.v || this.reason) {
   cb(this.v, this.reason)
  } else {
   this.waiting.add(cb)
  }
 }
}

export function getImageFromUrl(url: string): Thenplz<Img> {
 let t = cache.get(url)
 if (!t) {
  t = new Thenplz((resolve, reject)=>{
   console.log("loading", url)
   const img = new Image()
   img.src = url
   img.addEventListener("load", (evt)=>{
    resolve(img)
   })
   img.addEventListener("error", (evt)=>{
    reject(evt.error)
   })
  })
  cache.set(url, t)
 }
 console.log("get", url)
 return t;
}
