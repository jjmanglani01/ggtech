
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { handlePagination, executeSelectFirst, executeSelectCount, executeSelectAll } from "../helpers";
import {  ensureUser } from "../../auth/helpers";
import { UserModel } from "../db/models/user";
import { AppContext } from "../../auth/app-context";


export interface UsersOptions extends PaginationArgs {
  search?: string;
  ids?: number[];
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  gender: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC",
};

export class UserService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<UserModel> {
    ensureUser(this.context.viewer);

    const query = UserModel.query();

    return {
      query,
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const user = await query.findById(id);
    return user ?? null;
  }

  async getByIdOrThrow(id: number) {
    const user = await this.getById(id);
    if (!user) {
      throw new Error(`Unable to find specified User (ID: ${id})`);
    }
    return user;
  }


  getAllQuery(options: UsersOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where((builder) => {
        builder
          .where(`first_name`, "like", `%${options.search}%`)
          .orWhere(`last_name`, "like", `%${options.search}%`);
      });
    }

    if (options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${UserModel.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${UserModel.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${UserModel.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: UsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: UsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: UsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateUserInput) {
    ensureUser(this.context.viewer);

    const user = await UserModel.query().insertAndFetch({
      first_name: input.first_name,
      last_name: input.last_name,
      gender: input.gender,
    });

    return user;
  }
}
