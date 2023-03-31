import { Model } from "objection";

export interface UserTracking {
  user_id: number;
  lat: number;
  lng: number;
}

export class UserTrackingModel extends Model implements UserTracking {
  static get tableName() {
    return "user_tracking";
  }

  user_id: number;
  lat: number;
  lng: number;
}
