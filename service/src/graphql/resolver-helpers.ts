import { QueryBuilder, Model } from "objection";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { formatApolloErrors, ApolloError } from "apollo-server-core";
import { PaginationArgs } from "../services/internal/common";

export interface Connection<T> {
  totalCount: number;
  nodes: T[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export function handlePagination<M extends Model>(builder: QueryBuilder<M, M[]>, args: PaginationArgs): void {
  if (args.limit) {
    builder.limit(args.limit);
  } else {
    builder.limit(1000);
  }

  if (args.offset) {
    builder.offset(args.offset);
  }
}

export function buildPageInfo(
  totalCount: number,
  args: PaginationArgs<any>
): { hasNextPage: boolean; hasPreviousPage: boolean } {
  return {
    hasNextPage: (args.offset || 0) + (args.limit || 1000) < totalCount,
    hasPreviousPage: totalCount > 0 && (args.offset || 0) > 0,
  };
}

export const transformError = (e: GraphQLError): GraphQLFormattedError => {
  console.debug(e.name, { e });
  if (e.originalError && e.originalError.name === "ValidationError") {
    console.log("got here");
    const newError = new ApolloError("Error", "BAD_INPUT_ERROR", {
      test: "this is a test.",
    });
    return formatApolloErrors([newError], {})[0];
  }
  return formatApolloErrors([e])[0];
};
