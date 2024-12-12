import { HttpErrorResponse, HttpStatusType } from '@/interfaces';

/**
 * @class ErrorManager
 * @extends Error
 * @description Custom error class for handling HTTP errors
 */
export class ErrorManager extends Error {
  public error: HttpStatusType;
  public details: string;
  public statusCode?: number;

  /**
   * @constructor
   * @param {HttpErrorResponse} errorResponse - Error response object
   */
  constructor({ error, message, statusCode }: HttpErrorResponse) {
    super(`${statusCode} :: ${error} :: ${typeof message === 'string' ? message : message.join(', ')}`);
    this.error = error;
    this.details = typeof message === 'string' ? message : message.join(', ');
    this.statusCode = statusCode;

    this.name = 'ErrorManager';
  }

  /**
   * @static
   * @method handleError
   * @description Handles an error response and returns an ErrorManager instance
   * @param {HttpErrorResponse} errorResponse - Error response object
   * @returns {ErrorManager} ErrorManager instance
   */
  static handleError(errorResponse: HttpErrorResponse): ErrorManager {
    return new this(errorResponse);
  }

  /**
   * @static
   * @method createSignature
   * @description Creates an error signature from a string
   * @param {string} content - Error content string
   * @returns {HttpErrorResponse} Error response object
   */
  static createSignature(content: string): HttpErrorResponse {
    const [statusCode, error, message] = content.split(' :: ');

    return {
      error: (error as HttpStatusType) || 'INTERNAL_SERVER_ERROR',
      message: message || content,
      statusCode: Number(statusCode) || 500,
    };
  }
}
