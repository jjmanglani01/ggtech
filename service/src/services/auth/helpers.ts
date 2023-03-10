import { Viewer } from "./viewer";
import { AppContext } from "./app-context";

function UnauthorizedAccessError() {
  return "unauthorized acceess";
}

export const ensureUser = (viewer: Viewer | null): Viewer => {
  if (!viewer || !viewer.user) {
    throw UnauthorizedAccessError();
  }
  return viewer;
};

export function getSystemViewer() {
  return {
    userId: 1,
    user: { id: 1, first_name: "system", last_name: "system", gender: "system" },
    isSystem: true,
  };
}

export async function getSystemContext(requestId = "unknown"): Promise<AppContext> {
  const systemViewer = getSystemViewer();
  return {
    requestId,
    viewer: systemViewer,
  };
}
