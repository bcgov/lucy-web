import { LoggerBase } from "../logger";

export const errorHandler = (error: any, req: any, res: any, next: any ) => {
    LoggerBase.logger.error(`Application unhandled error: ${error.message}`);
    let code = 500;
    // Checking code is valid http status or not
    if (typeof error.code === 'number' && error.code >= 100 && error.code <= 511) {
        ({ code } = error);
    }

    // Getting message from error.
    const message = error.message ? error.message : 'Internal Server Error';

    // Sending error status.
    res.status(code).json({ message: message, errors: [error]});
}

export const errorBody = (message: string, errors: object[]) => {
    return {
        message, 
        errors
    };
};