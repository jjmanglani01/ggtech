import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { RequestHandler } from "express";
import http from "http";
import authMiddleware from "./auth-middleware";
import { getServer } from "./graphql";
import { getDb} from "./services/internal/db";

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  const corsOptions: CorsOptions = {
    credentials: true,
    origin: new RegExp(/https?\:\/\/(localhost\:.*$|studio\.apollographql\.com)/i),
  };
  app.options("*", cors(corsOptions) as RequestHandler);
  await getDb();

  app.get("/health", cors(corsOptions) as RequestHandler, (_req, res) => {
    res.send({ ok: true }).status(200);
  });

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use(authMiddleware);

  const apiServer = await getServer(httpServer);
  await apiServer.start();

  apiServer.applyMiddleware({
    app,
    cors: corsOptions,
    path: "/graphql",
  });

  // To handle intentionally malformed requests
  app.use((err: any, _req: express.Request, res: any, next: any) => {
    if (!err) {
      return next();
    }
    if (err instanceof URIError) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
      });
    }
    return res.status(500).json({ message: "An error occurred while processing the request." });
  });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready, listening on 4000...`);
  });
}

start().catch((e) => {
  console.error(`Error while starting up: ${e.message}`, { error: e, details: JSON.stringify(e) });
});
