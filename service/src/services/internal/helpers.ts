import { AnyQueryBuilder, ColumnRef, Model, ModelProps, ModelType, QueryBuilder } from "objection";
import { PaginationArgs, DateQuery, NumberQuery, StringQuery } from "./common";

export function handlePagination<M extends Model>(builder: QueryBuilder<M, M[]>, args: PaginationArgs): void {
  if (args.limit) {
    builder.limit(args.limit);
  }

  if (args.offset) {
    builder.offset(args.offset);
  }
}

interface ExecuteOptions {
  showLogging?: boolean;
}

export async function executeSelectAll<M extends Model>(
  builder: QueryBuilder<M, M[]>,
  options?: ExecuteOptions
): Promise<M[]> {
  if (options && options.showLogging === true) {
    console.debug("Generated SQL", { sql: builder.toKnexQuery().toSQL() });
  }
  return await builder;
}

export async function executeSelectFirst<M extends Model>(
  builder: QueryBuilder<M, M[]>,
  options?: ExecuteOptions
): Promise<M | null> {
  if (options && options.showLogging === true) {
    console.debug("Generated SQL", { sql: builder.toKnexQuery().toSQL() });
  }
  const result = await builder.first();
  if (!result) {
    return null;
  }
  return result;
}

export async function executeSelectCount<M extends Model>(
  builder: QueryBuilder<M, M[]>,
  options?: ExecuteOptions
): Promise<number> {
  if (options && options.showLogging === true) {
    console.debug("Generated SQL", { sql: builder.toKnexQuery().toSQL() });
  }
  return builder.resultSize();
}

// Allow for querying based on a date using several operators
export function generateDateQuery<M extends Model>(
  queryBuilder: QueryBuilder<M, M[]>,
  column: string,
  dateQuery: DateQuery
): QueryBuilder<M, M[]> {
  queryBuilder.whereWrapped((queryBuilder) => {
    if (dateQuery.eq) {
      queryBuilder.where(column, dateQuery.eq);
    }
    if (dateQuery.gt) {
      queryBuilder.where(column, ">", dateQuery.gt);
    } else if (dateQuery.gte) {
      queryBuilder.where(column, ">=", dateQuery.gte);
    }
    if (dateQuery.lt) {
      queryBuilder.where(column, "<", dateQuery.lt);
    } else if (dateQuery.lte) {
      queryBuilder.where(column, "<=", dateQuery.lte);
    }
    if (dateQuery.isNull !== undefined) {
      if (dateQuery.isNull === true) {
        queryBuilder.whereNull(column);
      } else {
        queryBuilder.whereNotNull(column);
      }
    }
    if (dateQuery.orIsNull) {
      queryBuilder.orWhereNull(column);
    }
    if (dateQuery.day) {
      queryBuilder.whereRaw("DAY(??) = ?", [column, dateQuery.day]);
    }
  });
  return queryBuilder;
}

// Allow for querying a number based on using several operators
export function generateNumberQuery<M extends Model>(
  queryBuilder: QueryBuilder<M, M[]>,
  column: string,
  numberQuery: NumberQuery
): QueryBuilder<M, M[]> {
  if (typeof numberQuery === "number") {
    queryBuilder.where(column, numberQuery);
    return queryBuilder;
  }
  queryBuilder.whereWrapped((queryBuilder) => {
    if (numberQuery.eq) {
      queryBuilder.where(column, numberQuery.eq);
    }
    if (numberQuery.gt) {
      queryBuilder.where(column, ">", numberQuery.gt);
    } else if (numberQuery.gte) {
      queryBuilder.where(column, ">=", numberQuery.gte);
    }
    if (numberQuery.lt) {
      queryBuilder.where(column, "<", numberQuery.lt);
    } else if (numberQuery.lte) {
      queryBuilder.where(column, "<=", numberQuery.lte);
    }
    if (numberQuery.isNull) {
      queryBuilder.whereNull(column);
    }
  });
  return queryBuilder;
}

// Allow for querying a number based on using several operators
export function generateStringQuery<QB extends AnyQueryBuilder>(
  queryBuilder: QB,
  column: ModelProps<ModelType<QB>>,
  stringQuery: StringQuery
): AnyQueryBuilder {
  if (typeof stringQuery === "string") {
    queryBuilder.where(column, stringQuery);
    return queryBuilder;
  }
  queryBuilder.whereWrapped((queryBuilder) => {
    if (stringQuery.eq) {
      queryBuilder.where(column, stringQuery.eq);
    }
    if (stringQuery.isNull) {
      queryBuilder.whereNull(column as ColumnRef);
    }
    if (stringQuery.startsWith) {
      queryBuilder.where(column, "like", `${stringQuery.startsWith}%`);
    }
    if (stringQuery.orIsNull) {
      queryBuilder.orWhereNull(column as ColumnRef);
    }
  });
  return queryBuilder;
}

export function generateInWithNull<M extends Model, T>(
  queryBuilder: QueryBuilder<M, M[]>,
  column: string,
  values: (T | null)[]
) {
  if (!values.includes(null)) {
    // no null in list, normal in
    queryBuilder.whereIn(column, values as any);
  } else if (values.length === 1 && values.includes(null)) {
    // only a null in the list
    queryBuilder.whereNull(column);
  } else {
    // null and values
    queryBuilder.where((builder) => {
      builder.whereIn(column, values.filter((x) => !!x) as any).orWhereNull(column);
    });
  }
  return queryBuilder;
}
