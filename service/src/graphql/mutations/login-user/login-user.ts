import { GraphQLContext } from "../../../types/graphql-context";
import { setAuthCookie } from "../../cookie-helper";
import { getSystemViewer } from "../../../services/auth/helpers";
import { UserService } from "../../../services/internal/services/user-service";
import { User } from "../../../services/internal/db/models/user";

interface Args {
  input: {
    user_id: number;
    password: string;
  };
}

export default {
  Mutation: {
    loginUser: async (_parent: any, args: Args, context: GraphQLContext): Promise<{ isLoggedIn: boolean }> => {
      const viewer = getSystemViewer();
      const systemContext = { ...context.context, viewer };
      let user: User | null = null;
      const userService = new UserService(systemContext);
      const foundUser = await userService.getById(args.input.user_id);

      if (!foundUser) {
        return { isLoggedIn: false };
      }

      // We can use argoni2 to match the password and store password
      const isPasswordMatch = args.input.password === "admin";
      if (isPasswordMatch) {
        user = foundUser;
      }

      if (!user) {
        return { isLoggedIn: false };
      }

      await setAuthCookie(context.request, context.response, user.id);
      return { isLoggedIn: true };
    },
  },
};
