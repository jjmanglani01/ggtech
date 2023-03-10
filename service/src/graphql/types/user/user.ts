import { User } from "../../../services/internal/db/models/user";
import { UserTrackingService } from "../../../services/internal/services/user-tracking-service";
import { getSystemContext } from "../../../services/auth/helpers";

export default {
  User: {
    full_name: (user: User) => {
      return `${user.first_name} ${user.last_name}`;
    },
    location: async (user: User) => {
      const systemContext = await getSystemContext();
      const userTracking = await new UserTrackingService(systemContext).getFirst({
        user_ids: [user.id],
      });
      if (!userTracking) {
        return null;
      }
      return {
        lat: userTracking.lat,
        lng: userTracking.lng,
      };
    },
  },
};
