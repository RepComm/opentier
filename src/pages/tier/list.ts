
import { TierItem } from "./item";
import { User } from "./types";

export class TierList {
 id: string;
 ownerid: string;
 owner: User;
 name: string;
 items: Set<TierItem>;

 constructor(id: string, name: string = "untitled", ownerid: string = "") {
  this.items = new Set();
  this.id = id;
  this.name = name;
  this.ownerid = ownerid;
  this.owner = {
   id: ownerid,
   username: "OpenTier"
  }
 }
}