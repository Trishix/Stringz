import { Request, Response, NextFunction } from 'express';

import Logger from '../utils/Logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    Logger.error(`❌ Error: ${err.stack}`);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
