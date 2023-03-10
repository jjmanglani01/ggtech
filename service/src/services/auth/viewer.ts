import jwt from "jsonwebtoken";

import { User } from "../internal/db/models/user";
import { getSystemContext } from "./helpers";
import { UserService } from "../internal/services/user-service";

export interface Viewer {
  userId: number;
  user: User;
  isSystem: boolean;
}

interface GetViewerOptions {
  jwtToken: string;
  requestId?: string;
}

export const getViewer = async (options: GetViewerOptions): Promise<Viewer> => {
  const jwtSecret = "godisgreat";
  const payload = jwt.verify(options.jwtToken, jwtSecret) as any;
  if (!payload || !payload.sub) {
    throw new Error("Invalid JWT specified.");
  }

  const systemContext = await getSystemContext(options.requestId);

  const userId = parseInt(payload.sub, 10);
  const user = await new UserService(systemContext).getById(userId);
  if (!user) {
    throw new Error("Invalid JWT specified.");
  }

  return {
    userId,
    user,
    isSystem: false,
  };
};
