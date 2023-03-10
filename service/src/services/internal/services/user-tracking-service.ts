import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { handlePagination, executeSelectFirst, executeSelectCount, executeSelectAll } from "../helpers";
import { ensureUser } from "../../auth/helpers";
import { UserTrackingModel } from "../db/models/user-tracking";
import { AppContext } from "../../auth/app-context";

export interface UserTrackingOptions extends PaginationArgs {
  user_ids?: number[];
}

export class UserTrackingService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<UserTrackingModel> {
    ensureUser(this.context.viewer);

    const query = UserTrackingModel.query();

    return {
      query,
    };
  }

  getAllQuery(options: UserTrackingOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.user_ids && options.user_ids.length > 0) {
      query.whereIn("user_id", options.user_ids);
    }

    return query;
  }

  async getFirst(options: UserTrackingOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: UserTrackingOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: UserTrackingOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }
}
