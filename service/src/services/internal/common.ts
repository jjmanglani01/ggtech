import { Model, QueryBuilderType } from "objection";

export interface PaginationArgs<SortType = string> {
  limit?: number;
  offset?: number;
  sort?: SortType;
}

export interface QueryInitializationResult<T extends Model> {
  query: QueryBuilderType<T>;
}

export interface DateQuery {
  eq?: Date;
  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
  isNull?: boolean;
  orIsNull?: boolean;
  day?: number;
}

interface NumberQueryFields {
  eq?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  isNull?: boolean;
  orIsNull?: boolean;
}

export type NumberQuery = number | NumberQueryFields;

interface StringQueryFields {
  eq?: string;
  isNull?: boolean;
  orIsNull?: boolean;
  startsWith?: string;
}

export type StringQuery = string | StringQueryFields;

export interface AuthorizationOptions {
  forceAuthorizationOverride: boolean;
}
