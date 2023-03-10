import { Connection, buildPageInfo } from "../../resolver-helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import { User } from "../../../services/internal/db/models/user";
import { PaginationArgs } from "../../../services/internal/common";
import { getSystemContext } from "../../../services/auth/helpers";
import { UserTrackingService } from "../../../services/internal/services/user-tracking-service";

interface Args extends PaginationArgs {
  search?: string;
  //Assumption radius is in km
  radius: number;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default {
  Query: {
    findusers: async (_parent: any, args: Args, _context: GraphQLContext): Promise<Connection<User>> => {
      const systemContext = await getSystemContext();
      const { radius } = args;
      const userTrackingService = new UserTrackingService(systemContext);
      const userTrackings = await userTrackingService.getAll(args);

      const user_ids = [];
      const length = userTrackings.length;

      for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
          const r = getDistanceFromLatLonInKm(
            userTrackings[i].lat,
            userTrackings[i].lng,
            userTrackings[j].lat,
            userTrackings[j].lng
          );
          if (r <= radius) {
            user_ids.push(userTrackings[i].user_id, userTrackings[j].user_id);
          }
        }
      }

      const userService = new UserService(systemContext);
      const totalCount = await userService.getCount({ ids: user_ids, ...args });
      const nodes = await userService.getAll({ ids: user_ids, ...args });
      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args),
      };
    },
  },
};
