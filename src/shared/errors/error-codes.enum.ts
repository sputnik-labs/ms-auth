export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  USER_DOES_NOT_OWN_SESSION = 'USER_DOES_NOT_OWN_SESSION',
  FAILED_TO_GENERATE_TOKENS = 'FAILED_TO_GENERATE_TOKENS',

  // User errors
  INVALID_EMAIL = 'INVALID_EMAIL',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_CREATION_ERROR = 'USER_CREATION_ERROR',
  USER_SAVING_ERROR = 'USER_SAVING_ERROR',

  // Session errors
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',

  // Auth errors
  TOKEN_NOT_PROVIDED = 'TOKEN_NOT_PROVIDED',
}
