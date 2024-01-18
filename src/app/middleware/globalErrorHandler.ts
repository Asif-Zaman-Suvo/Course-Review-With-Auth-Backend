import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/appError';

const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
    const errorDetails = {
      errorMessage: message,
      errorDetails: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        issues: err.issues.map((issue: any) => ({
          expected: issue.expected,
          received: issue.received,
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
        name: 'ZodError',
      },
      stack: config.NODE_ENV === 'development' ? err?.stack : null,
    };
    return res.status(statusCode).json({
      success: false,
      ...errorDetails,
    });
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
    const errorDetails = {
      errorMessage: message,
      errorDetails: {
        stringValue: err.stringValue,
        valueType: err.valueType,
        kind: err.kind,
        value: err.value,
        path: err.path,
        reason: err.reason,
        name: err.name,
        message: err.message,
      },
      stack: config.NODE_ENV === 'development' ? err?.stack : null,
    };

    return res.status(statusCode).json({
      success: false,
      ...errorDetails,
    });
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err instanceof AppError) {
    if (err?.statusCode === 401) {
      return res.status(err?.statusCode).json({
        success: false,
        message: 'Unauthorized Access',
        errorMessage:
          'You do not have the necessary permissions to access this resource.',
        errorDetails: null,
        stack: null,
      });
    }
    statusCode = err?.statusCode;
    message = err?.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  }
  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
