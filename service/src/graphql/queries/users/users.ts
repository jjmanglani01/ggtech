import { Connection, buildPageInfo } from "../../resolver-helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import { User } from "../../../services/internal/db/models/user";
import { PaginationArgs } from "../../../services/internal/common";

interface Args extends PaginationArgs {
  search?: string;
  ids?: number[];
}

export default {
  Query: {
    users: async (_parent: any, args: Args, { context }: GraphQLContext): Promise<Connection<User>> => {
      const systemContext = context;
      const userService = new UserService(systemContext);
      const nodes = await userService.getAll(args);
      const totalCount = await userService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args),
      };
    },
  },
};
