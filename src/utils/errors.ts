// ============================================
# GESTION DES ERREURS
# ============================================

export class AppError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string = 'UNKNOWN', details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

export const getErrorMessage = (error: any): string => {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inattendue est survenue';
};

export const getErrorCode = (error: any): string => {
  if (isAppError(error)) {
    return error.code;
  }
  return 'UNKNOWN';
};

export const createError = (
  message: string,
  code: string = 'UNKNOWN',
  details?: any
): AppError => {
  return new AppError(message, code, details);
};

export const handleError = (error: any): void => {
  console.error('[ERROR]', error);
};

export const ERROR_CODES = {
  NETWORK: 'ERR_NETWORK',
  AUTH: 'ERR_AUTH',
  LICENCE_EXPIRED: 'ERR_LICENCE_EXPIRED',
  DATABASE: 'ERR_DATABASE',
  VALIDATION: 'ERR_VALIDATION',
  NOT_FOUND: 'ERR_NOT_FOUND',
  PERMISSION: 'ERR_PERMISSION',
} as const;
