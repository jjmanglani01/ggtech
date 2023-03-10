import { Model } from "objection";

export interface User {
  user_id: number;
  lat: number;
  lng: number;
}

export class UserTrackingModel extends Model implements User {
  static get tableName() {
    return "user_tracking";
  }

  user_id: number;
  lat: number;
  lng: number;
}
