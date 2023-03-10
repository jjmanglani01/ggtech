import { join } from "path";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import resolvers from "./resolvers";
import { GraphQLContext } from "../types/graphql-context";
import { RequestWithContext } from "../types/request-with-context";
import { AppContext } from "../services/auth/app-context";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

export function getSchemaDefinition() {
  const typesArray = loadFilesSync(join(__dirname, "**/*.graphql"));
  return mergeTypeDefs(typesArray);
}

export async function getServer(httpServer: http.Server) {
  const isProduction = false;

  const schema = getSchemaDefinition();
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, res }): Promise<GraphQLContext> => {
      return {
        request: req,
        response: res,
        context: (req as RequestWithContext).context as AppContext,
      };
    },
    apollo: !isProduction
      ? undefined
      : {
          key: process.env.key,
          graphVariant: process.env.environment,
        },
    introspection: !isProduction,
    formatError: (err) => {
      const originalError = err.extensions?.exception;
      // TODO: Update db error
      if (originalError?.code === "DBError") {
        console.error(err.message, { err });
        return new Error("An unexpected error occurred while processing the request. Please try again later.");
      }
      return err;
    },
    debug: !isProduction,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  return server;
}
