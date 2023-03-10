export interface GraphQLResponseError {
  message: string;
  inputFieldErrors: GraphQLResponseFieldError[];
}

export interface GraphQLResponseFieldError {
  fieldName: string;
  message: string;
}

export function generateResponseError(): GraphQLResponseError {
  let mutationError: GraphQLResponseError = {
    message: "Something went wrong. Please try again.",
    inputFieldErrors: [],
  };
  return mutationError;
}
