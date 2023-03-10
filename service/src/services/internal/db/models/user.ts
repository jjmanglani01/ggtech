import { Model } from "objection";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
}

export class UserModel extends Model implements User {
  static get tableName() {
    return "user";
  }

  id: number;
  first_name: string;
  last_name: string;
  gender: string;
}
