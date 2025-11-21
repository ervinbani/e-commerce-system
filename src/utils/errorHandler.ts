/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Custom error class for network connectivity errors
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Custom error class for data validation errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Handles API errors gracefully
 * @param error - The error to handle
 */
export function handleApiError(error: Error): void {
  if (error instanceof ApiError) {
    console.error(`API ERROR ${error.message}`);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
  } else {
    console.error(`ERROR ${error.message}`);
  }
}

/**
 * Handles network errors gracefully
 * @param error - The error to handle
 */
export function handleNetworkError(error: Error): void {
  if (error instanceof NetworkError) {
    console.error(`NETWORK ERROR ${error.message}`);
    console.error("Please check your internet connection and try again.");
  } else {
    console.error(`ERROR ${error.message}`);
  }
}

/**
 * Logs errors with context information
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(error: Error, context?: string): void {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error ${context ? `in ${context}` : ""}`);
  console.error(`Type: ${error.name}`);
  console.error(`Message: ${error.message}`);
  if (error.stack) {
    console.error(`Stack trace:\n${error.stack}`);
  }
}
